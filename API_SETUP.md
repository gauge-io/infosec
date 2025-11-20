# Google Calendar API Backend Setup

## Overview

The calendar booking system requires a backend API endpoint to create calendar events using the Google Calendar service account. This is because service account authentication cannot be done securely from the frontend.

## Service Account Details

- **Service Account Email**: `gauge-io@calendar-integration-478723.iam.gserviceaccount.com`
- **Calendar Email**: `nick@gauge.io` (shared with service account)

## Required Backend API Endpoint

Create a backend API endpoint at `/api/calendar/create-event` that:

1. Accepts POST requests with the following body:
```json
{
  "summary": "Coffee Talk with John Doe",
  "description": "Meeting details...",
  "start": "2024-01-15T10:00:00Z",
  "end": "2024-01-15T11:00:00Z",
  "location": "1 Ferry Plaza, San Francisco, CA 94111, USA",
  "attendees": ["user@example.com"],
  "calendarId": "nick@gauge.io"
}
```

2. Uses the service account credentials to authenticate with Google Calendar API
3. Creates the event in the specified calendar
4. Sends calendar invites to attendees
5. Returns the created event ID

## Implementation Example (Node.js/Express)

```javascript
const { google } = require('googleapis');
const serviceAccount = require('./path/to/service-account-key.json');

const calendar = google.calendar({ version: 'v3' });

app.post('/api/calendar/create-event', async (req, res) => {
  try {
    const auth = new google.auth.JWT(
      serviceAccount.client_email,
      null,
      serviceAccount.private_key,
      ['https://www.googleapis.com/auth/calendar']
    );

    const response = await calendar.events.insert({
      auth: auth,
      calendarId: req.body.calendarId,
      requestBody: {
        summary: req.body.summary,
        description: req.body.description,
        start: { dateTime: req.body.start, timeZone: 'America/Los_Angeles' },
        end: { dateTime: req.body.end, timeZone: 'America/Los_Angeles' },
        location: req.body.location,
        attendees: req.body.attendees.map(email => ({ email })),
        sendUpdates: 'all', // Send invites to attendees
      },
    });

    res.json({ success: true, id: response.data.id });
  } catch (error) {
    console.error('Error creating calendar event:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
```

## Service Account Key

You'll need to download the service account JSON key file from Google Cloud Console and store it securely (not in the repository).

## Environment Variables

Add to your backend `.env`:
```
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=/path/to/service-account-key.json
```

## Testing

Once the backend is set up, the frontend `createCalendarEvent` function in `src/lib/google-calendar.ts` will automatically call this endpoint.

