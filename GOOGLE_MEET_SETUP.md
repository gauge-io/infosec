# Google Meet Link Generation Setup

## Current Status

The application uses the **Google Meet REST API** to create meeting spaces for podcast meetings. The Meet link is inserted into the calendar event's location field.

## Requirements for Meet REST API

The Meet REST API requires:
1. **Meet API enabled** in Google Cloud Console
2. **Service account with proper scopes**:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
   - `https://www.googleapis.com/auth/meetings.space.create`

### Enable Meet API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `calendar-integration-478723`
3. Navigate to **APIs & Services** > **Library**
4. Search for "Google Meet API"
5. Click **Enable**

### Service Account Setup

The service account is already configured with the necessary scopes. Ensure:
- Service account key is properly loaded
- Calendar is shared with the service account
- Meet API is enabled in the project

## How It Works

For podcast meetings:
1. System creates a Google Meet space using Meet REST API
2. Gets the meeting URI (e.g., `https://meet.google.com/abc-defg-hij`)
3. Inserts the URI into the calendar event's `location` field
4. Email confirmation includes the Meet link in the location section

## Previous Setup (No Longer Used)

### Option 1: Domain-Wide Delegation (For Calendar API conferenceData - DEPRECATED)

If `nick@gauge.io` is a Google Workspace account, you need to set up domain-wide delegation:

1. **Enable Domain-Wide Delegation in Google Cloud Console:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to **IAM & Admin** > **Service Accounts**
   - Click on `gauge-io@calendar-integration-478723.iam.gserviceaccount.com`
   - Go to **Details** tab
   - Check **Enable Google Workspace Domain-wide Delegation**
   - Note the **Client ID** (you'll need this)

2. **Authorize the Service Account in Google Workspace Admin:**
   - Go to [Google Admin Console](https://admin.google.com/)
   - Navigate to **Security** > **API Controls** > **Domain-wide Delegation**
   - Click **Add new**
   - Enter the **Client ID** from step 1
   - Add these OAuth scopes:
     - `https://www.googleapis.com/auth/calendar`
     - `https://www.googleapis.com/auth/calendar.events`
   - Click **Authorize**

3. **Update the Service Account Scopes in server.js:**
   The code already includes the calendar scope, but you may need to add:
   ```javascript
   scopes: [
     'https://www.googleapis.com/auth/calendar',
     'https://www.googleapis.com/auth/calendar.events'
   ]
   ```

### Option 2: Calendar Settings (For Personal Google Accounts)

If `nick@gauge.io` is a personal Google account:

1. **Enable Google Meet in Calendar Settings:**
   - Open Google Calendar
   - Go to **Settings** > **Settings for my calendars** > Select `nick@gauge.io`
   - Under **Event settings**, ensure **Automatically add Google Meet video conferencing** is enabled
   - This should allow Meet links to be automatically added to events

2. **Verify Calendar Sharing:**
   - Ensure the calendar is shared with the service account
   - Service account should have **Make changes to events** permission

### Option 3: Manual Meet Link Addition (Fallback)

If automatic generation doesn't work, the system will:
- Create the calendar event successfully
- Use a placeholder location: "Google Meet link will be added to calendar invite"
- The calendar owner can manually add the Meet link in Google Calendar

## Troubleshooting

### Error: "Invalid conference type value"
- This usually means the service account doesn't have permission to create Meet links
- Try enabling domain-wide delegation (Option 1) or calendar Meet settings (Option 2)

### Error: "Insufficient permissions"
- Verify the calendar is shared with the service account
- Check that the service account has "Make changes to events" permission
- For Workspace accounts, ensure domain-wide delegation is set up

### Meet Link Not Generated
- Check server logs for detailed error messages
- Verify the calendar allows Meet links in settings
- Try creating a test event manually in Google Calendar to confirm Meet links work

## Testing

After setup, test by:
1. Creating a podcast meeting booking
2. Check server console logs for Meet link generation status
3. Verify the calendar event has a Meet link in Google Calendar
4. Check the email confirmation includes the Meet link

## Current Implementation

The code will:
1. Attempt to create event with `conferenceData` for podcast meetings
2. If that fails, create event without Meet link
3. Log detailed error information for debugging
4. Use placeholder text if Meet link can't be generated

Check the server console logs when booking a podcast meeting to see what's happening.

