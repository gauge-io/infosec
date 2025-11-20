# SMTP Configuration for Calendar Invites

The server uses SMTP to send calendar invites to attendees automatically after booking an appointment.

## Environment Variables

Add these to your `.env.local` file:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Or use these alternative variable names
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Gmail Setup

If using Gmail, you'll need to:

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate an App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Gauge Calendar Booking" as the name
   - Copy the generated 16-character password
   - Use this as `SMTP_PASS` (not your regular Gmail password)

## Other Email Providers

### Outlook/Office 365
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
```

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
```

## Testing

After configuring SMTP, test by creating a booking. The server will:
1. Create the calendar event
2. Send calendar invites (.ics files) to all attendees via email
3. Include a link to view the event in Google Calendar

## Troubleshooting

- **"SMTP credentials not configured"**: Add SMTP_USER and SMTP_PASS to `.env.local`
- **"Authentication failed"**: Check your email and password are correct
- **Gmail "Less secure app" error**: Use an App Password instead of your regular password
- **Port blocked**: Try port 465 with SMTP_SECURE=true, or port 587 with SMTP_SECURE=false

