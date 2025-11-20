import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';
import nodemailer from 'nodemailer';
import ical from 'ical-generator';

// Load environment variables from .env.local first, then .env
dotenv.config({ path: '.env.local' });
dotenv.config(); // Also load .env as fallback

// Log SMTP config status (without exposing password)
console.log('Environment variables loaded:');
console.log('  SMTP_HOST:', process.env.SMTP_HOST || 'not set');
console.log('  SMTP_PORT:', process.env.SMTP_PORT || 'not set');
console.log('  SMTP_USER:', process.env.SMTP_USER || process.env.EMAIL_USER || 'not set');
console.log('  SMTP_PASS:', (process.env.SMTP_PASS || process.env.EMAIL_PASS) ? '***SET***' : 'not set');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Google Calendar API with service account
let calendar;

async function initializeCalendar() {
  try {
    // Load service account key from environment variable or file
    // Try multiple possible filenames
    const possiblePaths = [
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH,
      join(__dirname, 'service_account_key.json'),
      join(__dirname, 'service-account-key.json'),
    ].filter(Boolean);
    
    const serviceAccountKeyPath = possiblePaths.find(path => existsSync(path)) || possiblePaths[0];
    
    let serviceAccount;
    
    // Try to load from environment variable first (base64 encoded JSON)
    if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      try {
        serviceAccount = JSON.parse(Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY, 'base64').toString());
        console.log('Loaded service account from environment variable');
      } catch (err) {
        console.error('Failed to parse service account from environment variable:', err);
      }
    }
    
    // If not loaded from env, try to load from file
    if (!serviceAccount && existsSync(serviceAccountKeyPath)) {
      try {
        const keyFileContent = readFileSync(serviceAccountKeyPath, 'utf8');
        serviceAccount = JSON.parse(keyFileContent);
        console.log('Loaded service account from file:', serviceAccountKeyPath);
      } catch (err) {
        console.error('Failed to load service account from file:', err);
      }
    }
    
    if (!serviceAccount) {
      throw new Error('Service account key not found. Set GOOGLE_SERVICE_ACCOUNT_KEY_PATH or GOOGLE_SERVICE_ACCOUNT_KEY environment variable. See SERVICE_ACCOUNT_SETUP.md for instructions.');
    }

    // Check if this is a service account key (has client_email and private_key)
    // vs OAuth2 client credentials (has client_id and client_secret)
    if (!serviceAccount.client_email || !serviceAccount.private_key) {
      if (serviceAccount.web || serviceAccount.client_id) {
        throw new Error(
          'OAuth2 client credentials detected, but service account key is required.\n' +
          'The file provided appears to be OAuth2 client credentials, not a service account key.\n' +
          'Please download the service account JSON key file from Google Cloud Console:\n' +
          '1. Go to IAM & Admin > Service Accounts\n' +
          '2. Select: gauge-io@calendar-integration-478723.iam.gserviceaccount.com\n' +
          '3. Go to Keys tab > Add Key > Create new key > JSON\n' +
          '4. Save as service_account_key.json\n' +
          'Service account keys have "type": "service_account" and include "client_email" and "private_key" fields.'
        );
      } else {
        throw new Error('Invalid service account key format. Missing client_email and private_key fields.');
      }
    }

    // Create JWT auth with service account credentials
    const auth = new google.auth.JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    // Authorize and get access token
    await auth.authorize();
    
    calendar = google.calendar({ version: 'v3', auth });
    console.log('Google Calendar API initialized successfully');
    console.log('Service account:', serviceAccount.client_email);
  } catch (error) {
    console.error('Error initializing Google Calendar API:', error);
    throw error;
  }
}

// API endpoint to fetch calendar events (uses service account)
app.get('/api/calendar/events', async (req, res) => {
  try {
    if (!calendar) {
      await initializeCalendar();
    }

    const { calendarId, timeMin, timeMax } = req.query;

    if (!calendarId || !timeMin || !timeMax) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: calendarId, timeMin, and timeMax are required',
      });
    }

    const response = await calendar.events.list({
      calendarId: calendarId || 'nick@gauge.io',
      timeMin: timeMin,
      timeMax: timeMax,
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 250,
    });

    const events = (response.data.items || []).map((item) => {
      // Check if event is all-day (has date but no dateTime)
      const isAllDay = !item.start?.dateTime && !item.end?.dateTime;
      return {
        id: item.id,
        summary: item.summary || 'Busy',
        start: item.start?.dateTime || item.start?.date || '',
        end: item.end?.dateTime || item.end?.date || '',
        description: item.description,
        isAllDay,
      };
    });

    console.log(`Fetched ${events.length} events from calendar ${calendarId}`);

    res.json({
      success: true,
      events,
    });
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    
    let errorMessage = 'Failed to fetch calendar events';
    if (error.response) {
      errorMessage = error.response.data?.error?.message || errorMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
      events: [],
    });
  }
});

// API endpoint to create calendar events
app.post('/api/calendar/create-event', async (req, res) => {
  try {
    if (!calendar) {
      await initializeCalendar();
    }

    const { summary, description, start, end, location, attendees, calendarId, notes } = req.body;

    // Validate required fields
    if (!summary || !start || !end) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: summary, start, and end are required',
      });
    }

    // Build description with attendee info
    // Note: Service accounts cannot add attendees without Domain-Wide Delegation
    // We include attendee info in the description so the calendar owner can add them manually
    let eventDescription = description || '';
    if (attendees && attendees.length > 0) {
      const attendeeList = attendees.map(email => `- ${email}`).join('\n');
      eventDescription += (eventDescription ? '\n\n' : '') + 'Attendees:\n' + attendeeList;
      eventDescription += '\n\nNote: Please add these attendees manually to send calendar invites.';
    }

    // Create the calendar event
    const event = {
      summary,
      description: eventDescription,
      start: {
        dateTime: start,
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: end,
        timeZone: 'America/Los_Angeles',
      },
      location: location || '',
      attendees: [], // Service accounts can't add attendees without Domain-Wide Delegation
      sendUpdates: 'none',
    };

    const response = await calendar.events.insert({
      calendarId: calendarId || 'nick@gauge.io',
      requestBody: event,
    });

    console.log('Calendar event created:', response.data.id);

    // Send calendar invites via SMTP if attendees are provided
    if (attendees && attendees.length > 0) {
      try {
        console.log(`Sending calendar invites to ${attendees.length} attendee(s):`, attendees);
        console.log(`Organizer email: ${calendarId || 'nick@gauge.io'}`);
        await sendCalendarInvites({
          summary,
          description: description || '',
          start,
          end,
          location: location || '',
          attendees,
          organizerEmail: calendarId || 'nick@gauge.io',
          eventId: response.data.id,
          htmlLink: response.data.htmlLink,
          notes: (notes && typeof notes === 'string') ? notes.trim() : '', // Coffee preference for email subject
        });
        console.log('✓ All calendar invites sent successfully');
      } catch (emailError) {
        console.error('✗ Error sending calendar invites:', emailError);
        console.error('Error details:', {
          message: emailError.message,
          code: emailError.code,
          command: emailError.command,
          response: emailError.response,
        });
        // Don't fail the request if email fails, but log the error
        console.error('Event was created successfully, but email invites failed. Event ID:', response.data.id);
        // Still return success for the calendar event creation
      }
    } else {
      console.log('No attendees provided, skipping email invites');
    }

    res.json({
      success: true,
      id: response.data.id,
      htmlLink: response.data.htmlLink,
    });
  } catch (error) {
    console.error('Error creating calendar event:', error);
    console.error('Error stack:', error.stack);
    
    let errorMessage = 'Failed to create calendar event';
    if (error.response) {
      errorMessage = error.response.data?.error?.message || errorMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Send calendar invites via SMTP
 */
async function sendCalendarInvites({
  summary,
  description,
  start,
  end,
  location,
  attendees,
  organizerEmail,
  eventId,
  htmlLink,
  notes = '',
}) {
  // Configure SMTP transporter
  // Use environment variables for SMTP configuration
  const smtpConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || process.env.EMAIL_USER,
      pass: (process.env.SMTP_PASS || process.env.EMAIL_PASS)?.replace(/\s/g, ''), // Remove spaces from app password
    },
  };

  if (!smtpConfig.auth.user || !smtpConfig.auth.pass) {
    console.warn('SMTP credentials not configured. Skipping email invites.');
    console.warn('Set SMTP_USER and SMTP_PASS environment variables to enable email invites.');
    return;
  }

  console.log(`Attempting to send calendar invites via SMTP`);
  console.log(`SMTP Config:`, {
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    user: smtpConfig.auth.user,
    pass: smtpConfig.auth.pass ? '***' + smtpConfig.auth.pass.slice(-4) : 'NOT SET',
  });
  
  const transporter = nodemailer.createTransport(smtpConfig);
  
  // Verify SMTP connection
  try {
    console.log('Verifying SMTP connection...');
    const verifyResult = await transporter.verify();
    console.log('✓ SMTP connection verified successfully:', verifyResult);
  } catch (verifyError) {
    console.error('✗ SMTP connection verification failed:');
    console.error('  Error message:', verifyError.message);
    console.error('  Error code:', verifyError.code);
    console.error('  Full error:', verifyError);
    throw new Error(`SMTP connection failed: ${verifyError.message}`);
  }

  // Create iCal file for calendar invite
  const cal = ical({
    prodId: { company: 'Gauge.io', product: 'Calendar Booking', language: 'EN' },
    method: 'REQUEST',
    events: [
      {
        start: new Date(start),
        end: new Date(end),
        summary,
        description,
        location,
        organizer: { name: 'Gauge.io', email: organizerEmail },
        attendees: attendees.map(email => ({ email, rsvp: true })),
        url: htmlLink,
        uid: eventId,
        status: 'CONFIRMED',
      },
    ],
  });

  // Include organizer (nick@gauge.io) in the recipient list
  const allRecipients = [...new Set([...attendees, organizerEmail])];
  console.log(`Sending emails to ${allRecipients.length} recipient(s):`, allRecipients);

  // Generate email subject based on coffee preference
  const coffeePreference = notes && typeof notes === 'string' ? notes.trim() : '';
  
  // Extract attendee name from description (format: "Meeting with Name (email)")
  let attendeeName = 'Guest';
  if (description) {
    const nameMatch = description.match(/Meeting with\s+([^(]+)\s*\(/);
    if (nameMatch && nameMatch[1]) {
      attendeeName = nameMatch[1].trim();
    } else if (attendees && attendees.length > 0) {
      // Fallback to email username if name not found
      attendeeName = attendees[0].split('@')[0].split('.').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
  } else if (attendees && attendees.length > 0) {
    attendeeName = attendees[0].split('@')[0].split('.').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
  
  // For organizer (nick@gauge.io), include attendee name and coffee preference
  // For attendee, use the standard coffee subject
  const organizerSubject = coffeePreference && coffeePreference.length > 0
    ? `☕ ${coffeePreference} with ${attendeeName}`
    : `☕ Coffee with ${attendeeName}`;
  
  const attendeeSubject = coffeePreference && coffeePreference.length > 0
    ? `☕ ${coffeePreference} with Nick @ Gauge`
    : `☕ Coffee with Nick @ Gauge`;

  // Send invites to each recipient (attendees + organizer)
  const emailPromises = allRecipients.map(async (recipientEmail) => {
    const isOrganizer = recipientEmail === organizerEmail;
    // Use different subjects for organizer vs attendee
    const subject = isOrganizer ? organizerSubject : attendeeSubject;
    
    const textContent = isOrganizer
      ? `
New appointment booked: ${summary}

Attendee: ${attendees.join(', ')}
Date: ${new Date(start).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}
Location: ${location || 'TBD'}

${description}

View in calendar: ${htmlLink}
      `.trim()
      : `
You have been invited to: ${summary}

Date: ${new Date(start).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}
Location: ${location || 'TBD'}

${description}

View in calendar: ${htmlLink}
      `.trim();

    // Create HTML email template matching site design
    const dateTimeStr = new Date(start).toLocaleString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/Los_Angeles' 
    });
    
    // Escape user input for security
    const safeSummary = escapeHtml(summary);
    const safeAttendees = attendees.map(email => escapeHtml(email)).join(', ');
    const safeLocation = location ? escapeHtml(location) : '';
    const safeCoffeePreference = coffeePreference ? escapeHtml(coffeePreference) : '';
    const safeDescription = description ? escapeHtml(description).replace(/\n/g, '<br>') : '';
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #000000;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #000000;">
          <!-- Header with border -->
          <tr>
            <td style="border-bottom: 5px solid #D99A3D; padding-bottom: 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td>
                    <h1 style="margin: 0; font-family: 'IBM Plex Mono', monospace; font-size: 18px; font-weight: 600; color: #ffffff; letter-spacing: 0.5px;">
                      [ gauge ]
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 0;">
              ${isOrganizer ? `
                <h2 style="margin: 0 0 24px 0; font-family: 'IBM Plex Serif', Georgia, serif; font-size: 28px; font-weight: 600; color: #ffffff; line-height: 1.3;">
                  New Appointment Booking
                </h2>
                <p style="margin: 0 0 32px 0; font-family: 'IBM Plex Sans', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #e5e5e5;">
                  You have a new coffee meeting scheduled:
                </p>
              ` : `
                <h2 style="margin: 0 0 24px 0; font-family: 'IBM Plex Serif', Georgia, serif; font-size: 28px; font-weight: 600; color: #ffffff; line-height: 1.3;">
                  Coffee Meeting Confirmed
                </h2>
                <p style="margin: 0 0 32px 0; font-family: 'IBM Plex Sans', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #e5e5e5;">
                  Your coffee meeting with Nick @ Gauge has been confirmed:
                </p>
              `}
              
              <!-- Event Details Card -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #1a1a1a; border-radius: 8px; border: 1px solid #333333;">
                <tr>
                  <td style="padding: 24px;">
                    ${isOrganizer ? `
                      <p style="margin: 0 0 16px 0; font-family: 'IBM Plex Sans', Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #b3b3b3;">
                        <strong style="color: #ffffff;">Attendee:</strong><br>
                        <span style="color: #e5e5e5;">${safeAttendees}</span>
                      </p>
                    ` : ''}
                    <p style="margin: 0 0 16px 0; font-family: 'IBM Plex Sans', Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #b3b3b3;">
                      <strong style="color: #ffffff;">Date & Time:</strong><br>
                      <span style="color: #e5e5e5;">${dateTimeStr}</span>
                    </p>
                    ${safeLocation ? `
                      <p style="margin: 0 0 16px 0; font-family: 'IBM Plex Sans', Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #b3b3b3;">
                        <strong style="color: #ffffff;">Location:</strong><br>
                        <span style="color: #e5e5e5;">${safeLocation}</span>
                      </p>
                    ` : ''}
                    ${safeCoffeePreference ? `
                      <p style="margin: 0; font-family: 'IBM Plex Sans', Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #b3b3b3;">
                        <strong style="color: #ffffff;">Coffee Preference:</strong><br>
                        <span style="color: #e5e5e5;">${safeCoffeePreference}</span>
                      </p>
                    ` : ''}
                  </td>
                </tr>
              </table>
              
              ${safeDescription ? `
                <div style="margin: 32px 0; padding: 20px; background-color: #1a1a1a; border-radius: 8px; border-left: 2px solid #D99A3D;">
                  <p style="margin: 0; font-family: 'IBM Plex Sans', Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #e5e5e5; white-space: pre-line;">
                    ${safeDescription}
                  </p>
                </div>
              ` : ''}
              
              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 32px;">
                <tr>
                  <td align="center">
                    <a href="${htmlLink}" style="display: inline-block; background-color: #D99A3D; color: #000000; font-family: 'IBM Plex Sans', Arial, sans-serif; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 4px; letter-spacing: 0.3px;">
                      View in Calendar
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding-top: 40px; border-top: 1px solid #333333;">
              <p style="margin: 0; font-family: 'IBM Plex Sans', Arial, sans-serif; font-size: 12px; line-height: 1.6; color: #666666; text-align: center;">
                This email was sent from <a href="https://gauge.io" style="color: #D99A3D; text-decoration: none;">gauge.io</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    const mailOptions = {
      from: `"Nick Cawthon" <${smtpConfig.auth.user}>`,
      replyTo: `"Nick Cawthon" <${smtpConfig.auth.user}>`,
      to: recipientEmail,
      subject,
      text: textContent,
      html: htmlContent,
      headers: {
        'X-Mailer': 'Gauge.io Calendar Booking System',
        'X-Priority': '1',
      },
      icalEvent: isOrganizer ? undefined : {
        filename: 'invite.ics',
        method: 'REQUEST',
        content: cal.toString(),
      },
    };

    try {
      console.log(`Attempting to send email to ${recipientEmail} (${isOrganizer ? 'organizer' : 'attendee'})...`);
      console.log(`Email HTML length: ${htmlContent.length} characters`);
      console.log(`Email has HTML: ${!!htmlContent}`);
      console.log(`Email subject: ${subject}`);
      
      const info = await transporter.sendMail(mailOptions);
      console.log(`✓ Email sent to ${recipientEmail}:`, info.messageId, `Response: ${info.response}`);
      console.log(`Email accepted by: ${info.accepted?.join(', ') || 'unknown'}`);
      return info;
    } catch (emailError) {
      console.error(`✗ Failed to send email to ${recipientEmail}:`, emailError.message);
      console.error('Full error:', emailError);
      throw emailError;
    }
  });

  const results = await Promise.allSettled(emailPromises);
  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  
  if (successful > 0) {
    console.log(`✓ Successfully sent ${successful} email(s) (${successful === allRecipients.length ? 'all' : 'some'} recipients)`);
  }
  if (failed > 0) {
    console.error(`✗ Failed to send ${failed} email(s)`);
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`  - ${allRecipients[index]}: ${result.reason?.message || result.reason}`);
      }
    });
    throw new Error(`Failed to send ${failed} of ${allRecipients.length} emails`);
  }
}

// Test SMTP endpoint
app.get('/api/test-smtp', async (req, res) => {
  try {
    const smtpConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_USER,
        pass: (process.env.SMTP_PASS || process.env.EMAIL_PASS)?.replace(/\s/g, ''),
      },
    };

    if (!smtpConfig.auth.user || !smtpConfig.auth.pass) {
      return res.status(400).json({
        success: false,
        error: 'SMTP credentials not configured',
        config: {
          hasUser: !!smtpConfig.auth.user,
          hasPass: !!smtpConfig.auth.pass,
        },
      });
    }

    console.log('Testing SMTP connection...');
    const transporter = nodemailer.createTransport(smtpConfig);
    
    // Verify connection
    await transporter.verify();
    
    // Send test email
    const testEmail = {
      from: `"Gauge.io" <${smtpConfig.auth.user}>`,
      to: smtpConfig.auth.user, // Send to self for testing
      subject: 'SMTP Test - Calendar Booking System',
      text: 'This is a test email from the Gauge.io calendar booking system. If you receive this, SMTP is working correctly!',
      html: '<p>This is a test email from the Gauge.io calendar booking system. If you receive this, SMTP is working correctly!</p>',
    };

    const info = await transporter.sendMail(testEmail);
    
    res.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: info.messageId,
      response: info.response,
      config: {
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: smtpConfig.secure,
        user: smtpConfig.auth.user,
      },
    });
  } catch (error) {
    console.error('SMTP test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      command: error.command,
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'calendar-api' });
});

// Start server
async function startServer() {
  try {
    await initializeCalendar();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API endpoint: http://localhost:${PORT}/api/calendar/create-event`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

