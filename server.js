import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';
import nodemailer from 'nodemailer';
import ical from 'ical-generator';
import { request } from 'gaxios';
import {
  generateImagesForArticle,
  processAllPostsNeedingImages,
} from './lib/ghost-image-generator-server.js';

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
let meetAuth; // Separate auth for Meet API

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
    // Note: For Google Meet link generation, you may need domain-wide delegation
    // See GOOGLE_MEET_SETUP.md for setup instructions
    const auth = new google.auth.JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events'
        // Meet API scope added separately if Meet API is available
      ],
    });

    // Authorize and get access token
    await auth.authorize();
    
    calendar = google.calendar({ version: 'v3', auth });
    
    // Initialize Meet API auth (for direct REST API calls)
    // The googleapis library may not have Meet API, so we'll use direct HTTP calls
    try {
      meetAuth = new google.auth.JWT({
        email: serviceAccount.client_email,
        key: serviceAccount.private_key,
        scopes: [
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/calendar.events',
          'https://www.googleapis.com/auth/meetings.space.create'
        ],
      });
      
      // Don't test authorization here - getAccessToken() may try to validate scopes
      // and fail if googleapis doesn't recognize the Meet API scope
      // We'll test it when we actually need to make the API call
      console.log('✓ Google Meet API auth object created');
      console.log('  Service account:', serviceAccount.client_email);
      console.log('  Scopes:', meetAuth.scopes);
      console.log('  Auth will be tested when creating Meet spaces');
    } catch (meetError) {
      console.error('✗ Google Meet API auth initialization failed:');
      console.error('  Error:', meetError.message);
      console.error('  Stack:', meetError.stack);
      if (meetError.response) {
        console.error('  Response status:', meetError.response.status);
        console.error('  Response data:', JSON.stringify(meetError.response.data, null, 2));
      }
      console.error('  Meet links will not be automatically generated for podcast meetings.');
      console.error('  Please check:');
      console.error('    1. Meet API is enabled in Google Cloud Console');
      console.error('    2. Service account has meetings.space.create scope');
      console.error('    3. Service account key is valid');
      meetAuth = null;
    }
    
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
    
    // Ensure calendar is initialized
    if (!calendar) {
      return res.status(500).json({
        success: false,
        error: 'Calendar API not initialized. Check service account configuration.',
        events: [],
      });
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
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
    });
    
    let errorMessage = 'Failed to fetch calendar events';
    const requestedCalendarId = req.query.calendarId || 'nick@gauge.io';
    
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error.message || errorMessage;
      // If authentication error, provide helpful message
      if (error.response.data.error.message?.includes('authentication') || 
          error.response.data.error.message?.includes('OAuth') ||
          error.response.data.error.message?.includes('invalid authentication credentials')) {
        const serviceAccountEmail = calendar?.context?._options?.auth?.email || 'gauge-io@calendar-integration-478723.iam.gserviceaccount.com';
        errorMessage = `Authentication failed. The calendar "${requestedCalendarId}" must be shared with the service account "${serviceAccountEmail}". ` +
          'Go to Google Calendar > Settings > Share with specific people and add the service account with "Make changes to events" permission.';
      }
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

    const { summary, description, start, end, location, attendees, calendarId, notes, meetingType } = req.body;

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

    // For podcast meetings, create Google Meet link using Meet REST API
    // Fallback approach: Create Meet space separately and add to event.location
    // This avoids the "Invalid conference type value" error with conferenceData
    let finalLocation = location || '';
    
    if (meetingType === 'podcast') {
      console.log('=== PODCAST MEETING DETECTED ===');
      console.log('Using Meet REST API to create Google Meet link');
      console.log('Original location parameter:', location);
      
      if (!meetAuth) {
        console.error('✗ Meet API auth not available - Meet link will not be generated');
        console.error('Event will be created without Meet link');
        finalLocation = location || '';
      } else {
        try {
          console.log('Creating Google Meet space for podcast meeting...');
          
          // Get access token for Meet API
          const accessToken = await meetAuth.getAccessToken();
          console.log('✓ Access token obtained for Meet API');
          console.log('Access token length:', accessToken.token ? accessToken.token.length : 'NO TOKEN');
          
          // Make direct HTTP call to Meet REST API
          // API endpoint: https://meet.googleapis.com/v1/spaces
          console.log('Calling Meet REST API: https://meet.googleapis.com/v1/spaces');
          const meetResponse = await request({
            method: 'POST',
            url: 'https://meet.googleapis.com/v1/spaces',
            headers: {
              'Authorization': `Bearer ${accessToken.token}`,
              'Content-Type': 'application/json',
            },
            data: {
              config: {
                accessType: 'OPEN',
                entryPointAccess: 'CREATOR_APP_ONLY'
              }
            }
          });
          
          console.log('Meet API response status:', meetResponse.status);
          const meetData = meetResponse.data;
          console.log('Meet API response data:', JSON.stringify(meetData, null, 2));
          
          // Extract Meet link from response
          // According to Meet API docs, response should have: name, meetingUri, meetingCode, entryPoints
          if (meetData && meetData.meetingUri) {
            finalLocation = meetData.meetingUri;
            console.log('✓ Google Meet space created with meetingUri:', finalLocation);
          } else if (meetData && meetData.meetingCode) {
            finalLocation = `https://meet.google.com/${meetData.meetingCode}`;
            console.log('✓ Google Meet space created with meetingCode:', finalLocation);
          } else if (meetData && meetData.name) {
            // Extract meeting code from space name: "spaces/{meetingCode}"
            const spaceName = meetData.name;
            if (spaceName.startsWith('spaces/')) {
              const meetingCode = spaceName.replace('spaces/', '');
              finalLocation = `https://meet.google.com/${meetingCode}`;
              console.log('✓ Google Meet space created from name:', finalLocation);
            } else {
              finalLocation = `https://meet.google.com/${spaceName}`;
              console.log('✓ Google Meet space created from name (no prefix):', finalLocation);
            }
          } else if (meetData && Array.isArray(meetData.entryPoints) && meetData.entryPoints.length > 0) {
            // Check entryPoints array for video entry point
            const videoEntryPoint = meetData.entryPoints.find(ep => 
              ep.entryPointType === 'video' || ep.entryPointType === 'VIDEO'
            );
            if (videoEntryPoint && videoEntryPoint.uri) {
              finalLocation = videoEntryPoint.uri;
              console.log('✓ Google Meet space created from entryPoints:', finalLocation);
            } else {
              const firstEntryPoint = meetData.entryPoints[0];
              if (firstEntryPoint && firstEntryPoint.uri) {
                finalLocation = firstEntryPoint.uri;
                console.log('✓ Google Meet space created from first entryPoint:', finalLocation);
              }
            }
          } else {
            console.error('✗ Meet space created but no recognizable URI format found');
            console.error('Response data:', JSON.stringify(meetData, null, 2));
            finalLocation = location || '';
          }
          
          console.log('=== FINAL LOCATION SET TO ===');
          console.log('finalLocation:', finalLocation);
        } catch (meetError) {
          console.error('✗ Failed to create Google Meet space:');
          console.error('  Error message:', meetError.message);
          console.error('  Error stack:', meetError.stack);
          if (meetError.response) {
            console.error('  Response status:', meetError.response.status);
            console.error('  Response statusText:', meetError.response.statusText);
            console.error('  Response data:', JSON.stringify(meetError.response.data, null, 2));
          }
          console.error('Event will be created without Meet link');
          finalLocation = location || '';
        }
      }
    } else {
      console.log('=== COFFEE MEETING DETECTED ===');
      console.log('No Meet link needed for coffee meetings');
    }

    // Create the calendar event
    console.log('=== CREATING CALENDAR EVENT ===');
    console.log('meetingType:', meetingType);
    console.log('summary:', summary);
    console.log('start:', start);
    console.log('end:', end);
    console.log('original location param:', location);
    console.log('finalLocation (with Meet link if podcast):', finalLocation);
    
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
      location: finalLocation || location || '',
      attendees: [], // Service accounts can't add attendees without Domain-Wide Delegation
      sendUpdates: 'none',
    };
    
    console.log('=== FULL EVENT OBJECT ===');
    console.log(JSON.stringify(event, null, 2));
    console.log('Event location field:', event.location);
    console.log('Event location includes meet.google.com:', event.location ? event.location.includes('meet.google.com') : false);

    let response;
    try {
      console.log('=== CALLING CALENDAR API ===');
      console.log('calendarId:', calendarId || 'nick@gauge.io');
      
    // No conferenceData needed - Meet link is already in event.location
    // IMPORTANT: Do NOT add conferenceData or conferenceDataVersion
    const insertParams = {
      calendarId: calendarId || 'nick@gauge.io',
      requestBody: event,
    };
    
    // Explicitly ensure no conferenceData is in the event
    if (insertParams.requestBody.conferenceData) {
      console.warn('⚠ WARNING: conferenceData found in event object - removing it');
      delete insertParams.requestBody.conferenceData;
    }
    
    console.log('=== API CALL PARAMETERS ===');
    console.log('calendarId:', insertParams.calendarId);
    console.log('requestBody.summary:', insertParams.requestBody.summary);
    console.log('requestBody.location:', insertParams.requestBody.location);
    console.log('requestBody.hasConferenceData:', !!insertParams.requestBody.conferenceData);
    console.log('conferenceDataVersion:', 'NOT SET (should not be set)');
    
    console.log('=== MAKING CALENDAR API CALL ===');
    console.log('Calling calendar.events.insert() - no conferenceData, Meet link in location field');
    console.log('Event object keys:', Object.keys(insertParams.requestBody));
    
    response = await calendar.events.insert(insertParams);
      
      console.log('✓ Calendar API call completed successfully');
      
      console.log('=== CALENDAR EVENT CREATED ===');
      console.log('Event ID:', response.data.id);
      console.log('Event location in response:', response.data.location);
      console.log('Event HTML link:', response.data.htmlLink);
      
      // Meet link is already in finalLocation (set before event creation via Meet REST API)
      // Verify it's in the response
      if (response.data.location && response.data.location.includes('meet.google.com')) {
        console.log('✓ Google Meet link confirmed in event location:', response.data.location);
        finalLocation = response.data.location;
      } else if (finalLocation && finalLocation.includes('meet.google.com')) {
        console.log('✓ Google Meet link was set before event creation:', finalLocation);
        console.log('  Note: Response location may differ, but Meet link was created');
      } else {
        console.warn('⚠ No Meet link found in event location');
        console.warn('  Response location:', response.data.location);
        console.warn('  finalLocation:', finalLocation);
      }
      
      console.log('=== FINAL LOCATION RESULT ===');
      console.log('Final location:', finalLocation);
      console.log('Final location includes meet.google.com:', finalLocation ? finalLocation.includes('meet.google.com') : false);
    } catch (insertError) {
      console.error('=== ERROR CREATING CALENDAR EVENT ===');
      console.error('Error message:', insertError.message);
      console.error('Error code:', insertError.code);
      console.error('Error stack:', insertError.stack);
      
      if (insertError.response) {
        console.error('Response status:', insertError.response.status);
        console.error('Response statusText:', insertError.response.statusText);
        console.error('Response headers:', JSON.stringify(insertError.response.headers, null, 2));
        console.error('Response data:', JSON.stringify(insertError.response.data, null, 2));
        
        // Check for specific conference-related errors
        if (insertError.response.data && insertError.response.data.error) {
          const errorData = insertError.response.data.error;
          console.error('Error details:', JSON.stringify(errorData, null, 2));
          
          if (errorData.message && (errorData.message.includes('conference') || errorData.message.includes('Invalid conference type'))) {
            console.error('');
            console.error('⚠ CONFERENCE-RELATED ERROR DETECTED');
            console.error('Full error message:', errorData.message);
            console.error('Error code:', errorData.code);
            console.error('Error status:', errorData.status);
            if (errorData.errors) {
              console.error('Error details array:', JSON.stringify(errorData.errors, null, 2));
            }
            console.error('');
            console.error('POSSIBLE CAUSES:');
            console.error('  1. Calendar does NOT support "hangoutsMeet" in allowedConferenceSolutionTypes');
            console.error('  2. Service account needs domain-wide delegation for conferenceData');
            console.error('  3. Calendar owner account does not have Google Meet enabled');
            console.error('  4. The conferenceSolutionKey.type value is not recognized by this calendar');
            console.error('');
            console.error('CHECK SERVER LOGS ABOVE for "CHECKING CALENDAR CONFERENCE PROPERTIES"');
            console.error('This will show which conference types the calendar actually supports');
            console.error('');
            if (errorData.message.includes('Invalid conference type value')) {
              console.error('=== SPECIFIC: Invalid conference type value ===');
              console.error('This means the calendar rejected "hangoutsMeet" as a valid type');
              console.error('SOLUTION: Check the calendar.conferenceProperties output above');
              console.error('  If hangoutsMeet is NOT listed, we need to use Meet REST API instead');
            }
          }
        }
      } else if (insertError.request) {
        console.error('Request was made but no response received');
        console.error('Request details:', JSON.stringify(insertError.request, null, 2));
      }
      
      throw insertError;
    }
    
    // Log Meet link status for podcast meetings
    if (meetingType === 'podcast') {
      console.log('=== PODCAST MEETING SUMMARY ===');
      console.log('finalLocation:', finalLocation);
      console.log('response.data.location:', response.data.location);
      if (finalLocation && finalLocation.includes('meet.google.com')) {
        console.log('✓ Podcast meeting created with Google Meet link');
        console.log('  Meet URL:', finalLocation);
        console.log('  Location in calendar event:', response.data.location);
        if (response.data.location !== finalLocation) {
          console.warn('⚠ WARNING: Location mismatch!');
          console.warn('  Expected:', finalLocation);
          console.warn('  Actual:', response.data.location);
        }
      } else {
        console.error('✗ Podcast meeting created but Meet link generation failed');
        console.error('  finalLocation:', finalLocation);
        console.error('  response.data.location:', response.data.location);
        console.error('  Add Meet link manually in Google Calendar');
      }
    }

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
          location: finalLocation || location || '',
          attendees,
          organizerEmail: calendarId || 'nick@gauge.io',
          eventId: response.data.id,
          htmlLink: response.data.htmlLink,
          notes: (notes && typeof notes === 'string') ? notes.trim() : '', // Coffee preference for email subject
          meetingType: meetingType || 'coffee', // 'coffee' or 'podcast'
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
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error.message || errorMessage;
      // If authentication error, provide helpful message
      if (error.response.data.error.message?.includes('authentication') || 
          error.response.data.error.message?.includes('OAuth') ||
          error.response.data.error.message?.includes('invalid authentication credentials')) {
        const serviceAccountEmail = calendar?.context?._options?.auth?.email || 'gauge-io@calendar-integration-478723.iam.gserviceaccount.com';
        errorMessage = `Authentication failed. The calendar must be shared with the service account "${serviceAccountEmail}". ` +
          'Go to Google Calendar > Settings > Share with specific people and add the service account with "Make changes to events" permission.';
      }
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
  meetingType = 'coffee',
}) {
  // Load images for email (use base64 for podcast header, external URLs for others to prevent clipping)
  let coffeeShackImage = '';
  let podcastHeaderImage = '';
  let gaugeLogoImage = '';
  
  try {
    // For podcast meetings, load the podcast header image
    if (meetingType === 'podcast') {
      // Try multiple possible paths for the podcast header image
      const possiblePaths = [
        join(__dirname, 'src', 'assets', 'podcast-header-email.jpg'),
        join(process.cwd(), 'src', 'assets', 'podcast-header-email.jpg'),
        join(__dirname, 'podcast-header-email.jpg'),
      ];
      
      let podcastHeaderPath = null;
      for (const path of possiblePaths) {
        if (existsSync(path)) {
          podcastHeaderPath = path;
          console.log('✓ Found podcast header image at:', path);
          break;
        }
      }
      
      if (podcastHeaderPath) {
        try {
          const podcastHeaderBuffer = readFileSync(podcastHeaderPath);
          podcastHeaderImage = `data:image/jpeg;base64,${podcastHeaderBuffer.toString('base64')}`;
          console.log('✓ Podcast header image loaded, size:', podcastHeaderBuffer.length, 'bytes');
          console.log('  Base64 length:', podcastHeaderImage.length, 'characters');
        } catch (readError) {
          console.error('✗ Failed to read podcast header image:', readError.message);
        }
      } else {
        console.error('✗ Podcast header image not found in any of these paths:');
        possiblePaths.forEach(path => console.error('  -', path));
        console.error('  Current __dirname:', __dirname);
        console.error('  Current process.cwd():', process.cwd());
      }
    } else {
      // For coffee meetings, use external URL if available, or load from file
      const coffeeShackUrl = process.env.EMAIL_COFFEE_SHACK_IMAGE_URL;
      if (coffeeShackUrl) {
        coffeeShackImage = coffeeShackUrl;
      } else {
        const coffeeShackPath = join(__dirname, 'src', 'assets', 'coffee-shack.jpg');
        if (existsSync(coffeeShackPath)) {
          const coffeeShackBuffer = readFileSync(coffeeShackPath);
          coffeeShackImage = `data:image/jpeg;base64,${coffeeShackBuffer.toString('base64')}`;
        }
      }
    }
    
    // Gauge logo - use external URL if available
    const gaugeLogoUrl = process.env.EMAIL_GAUGE_LOGO_IMAGE_URL;
    if (gaugeLogoUrl) {
      gaugeLogoImage = gaugeLogoUrl;
    } else {
      const gaugeLogoPath = join(__dirname, 'src', 'assets', 'gauge-logo.gif');
      if (existsSync(gaugeLogoPath)) {
        const gaugeLogoBuffer = readFileSync(gaugeLogoPath);
        gaugeLogoImage = `data:image/gif;base64,${gaugeLogoBuffer.toString('base64')}`;
      }
    }
  } catch (error) {
    console.warn('Could not load images for email:', error.message);
  }
  
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
  
  // Extract attendee name from description
  let attendeeName = 'Guest';
  if (description) {
    // Try to match "Meeting with Name" or "Podcast Intro Meeting with Name"
    const nameMatch = description.match(/(?:Meeting|Podcast Intro Meeting) with\s+([^(]+)\s*\(/);
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
  
  // Generate email subjects based on meeting type
  let organizerSubject, attendeeSubject;
  if (meetingType === 'podcast') {
    organizerSubject = `🎙️ Podcast Intro Meeting with ${attendeeName}`;
    attendeeSubject = `🎙️ Podcast Intro Meeting with Nick @ Gauge`;
  } else {
    // Coffee meeting subjects
    organizerSubject = coffeePreference && coffeePreference.length > 0
      ? `☕ ${coffeePreference} with ${attendeeName}`
      : `☕ Coffee with ${attendeeName}`;
    
    attendeeSubject = coffeePreference && coffeePreference.length > 0
      ? `☕ ${coffeePreference} with Nick @ Gauge`
      : `☕ Coffee with Nick @ Gauge`;
  }

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
          <!-- Header with image -->
          <tr>
            <td style="border-bottom: 5px solid #D99A3D; padding-bottom: 0;">
              ${meetingType === 'podcast' && podcastHeaderImage ? `
                <img src="${podcastHeaderImage}" alt="Podcast Header" style="display: block; width: 100%; max-width: 600px; height: auto; margin: 0; padding: 0;" />
              ` : coffeeShackImage ? `
                <img src="${coffeeShackImage}" alt="Coffee Shack" style="display: block; width: 100%; max-width: 600px; height: auto; margin: 0; padding: 0;" />
              ` : `
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding-bottom: 20px;">
                      <h1 style="margin: 0; font-family: 'IBM Plex Mono', monospace; font-size: 18px; font-weight: 600; color: #ffffff; letter-spacing: 0.5px;">
                        [ gauge ]
                      </h1>
                    </td>
                  </tr>
                </table>
              `}
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 0;">
              ${isOrganizer ? `
                <h2 style="margin: 0 0 24px 0; font-family: 'IBM Plex Serif', Georgia, serif; font-size: 28px; font-weight: 600; color: #ffffff; line-height: 1.3;">
                  ${meetingType === 'podcast' ? 'New Podcast Intro Meeting' : 'New Appointment Booking'}
                </h2>
                <p style="margin: 0 0 32px 0; font-family: 'IBM Plex Sans', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #e5e5e5;">
                  ${meetingType === 'podcast' ? 'You have a new podcast intro meeting scheduled:' : 'You have a new coffee meeting scheduled:'}
                </p>
              ` : `
                <h2 style="margin: 0 0 24px 0; font-family: 'IBM Plex Serif', Georgia, serif; font-size: 28px; font-weight: 600; color: #ffffff; line-height: 1.3;">
                  ${meetingType === 'podcast' ? 'Podcast Intro Meeting Confirmed' : 'Confirming Coffee, Chaos and Cuss Words'}
                </h2>
                <p style="margin: 0 0 32px 0; font-family: 'IBM Plex Sans', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #e5e5e5;">
                  ${meetingType === 'podcast' ? 'We\'re looking forward to our conversation and exploring potential podcast collaboration.' : 'We\'re looking forward to hosting you for a brief moment of caffeinated bliss.'}
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
                        <strong style="color: #ffffff;">${meetingType === 'podcast' ? 'Meeting Link:' : 'Location:'}</strong><br>
                        ${meetingType === 'podcast' && safeLocation.includes('meet.google.com') ? `
                          <a href="${safeLocation}" style="color: #D99A3D; text-decoration: none; word-break: break-all;">${safeLocation}</a>
                        ` : meetingType === 'podcast' ? `
                          <span style="color: #e5e5e5;">${safeLocation}</span>
                        ` : `
                          <span style="color: #e5e5e5;">${safeLocation}</span>
                        `}
                      </p>
                    ` : ''}
                    ${safeCoffeePreference ? `
                      <p style="margin: 0; font-family: 'IBM Plex Sans', Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #b3b3b3;">
                        <strong style="color: #ffffff;">${meetingType === 'podcast' ? 'Notes:' : 'Coffee Preference:'}</strong><br>
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
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 16px;">
                    ${gaugeLogoImage ? `
                      <img src="${gaugeLogoImage}" alt="Gauge Logo" style="display: block; max-width: 120px; height: auto; margin: 0 auto;" />
                    ` : ''}
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin: 0; font-family: 'IBM Plex Sans', Arial, sans-serif; font-size: 12px; line-height: 1.6; color: #666666; text-align: center;">
                      This email was sent from <a href="https://gauge.io" style="color: #D99A3D; text-decoration: none;">gauge.io</a>
                    </p>
                  </td>
                </tr>
              </table>
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

// Ghost Image Generation Endpoints

// Generate images for a specific Ghost article
app.post('/api/ghost/generate-images/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const {
      regenerateHeader = false,
      regenerateBody = false,
      maxBodyImages = 3,
    } = req.body;

    console.log(`Generating images for Ghost post: ${postId}`);
    const result = await generateImagesForArticle(postId, {
      regenerateHeader,
      regenerateBody,
      maxBodyImages,
    });

    res.json({
      success: result.success,
      postId: result.postId,
      headerImageUrl: result.headerImageUrl,
      bodyImageUrls: result.bodyImageUrls,
      error: result.error,
    });
  } catch (error) {
    console.error('Error generating images for Ghost article:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

// Process all posts that need images
app.post('/api/ghost/process-all-posts', async (req, res) => {
  try {
    const { onlyNewPosts = true, regenerateExisting = false } = req.body;

    console.log('Processing all Ghost posts for image generation...');
    const results = await processAllPostsNeedingImages({
      onlyNewPosts,
      regenerateExisting,
    });

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    res.json({
      success: true,
      total: results.length,
      successful,
      failed,
      results,
    });
  } catch (error) {
    console.error('Error processing Ghost posts:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
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

