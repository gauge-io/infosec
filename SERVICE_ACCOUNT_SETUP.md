# Google Calendar Service Account Setup

## Service Account Details

- **Service Account Email**: `gauge-io@calendar-integration-478723.iam.gserviceaccount.com`
- **Calendar Email**: `nick@gauge.io` (must be shared with service account)

## Setup Instructions

### 1. Download Service Account Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **IAM & Admin** > **Service Accounts**
3. Find the service account: `gauge-io@calendar-integration-478723.iam.gserviceaccount.com`
4. Click on it and go to the **Keys** tab
5. Click **Add Key** > **Create new key**
6. Choose **JSON** format
7. Download the key file

### 2. Place the Key File

Place the downloaded JSON key file in the project root directory and name it:
```
service-account-key.json
```

**Important**: Add this file to `.gitignore` to prevent committing it to version control.

### 3. Alternative: Environment Variable

Instead of a file, you can set the service account key as a base64-encoded environment variable:

```bash
# Encode the JSON file to base64
cat service-account-key.json | base64

# Add to .env.local
GOOGLE_SERVICE_ACCOUNT_KEY=<base64-encoded-json>
```

### 4. Share Calendar with Service Account

1. Open Google Calendar
2. Go to **Settings** > **Settings for my calendars** > Select `nick@gauge.io`
3. Scroll to **Share with specific people**
4. Click **Add people**
5. Add: `gauge-io@calendar-integration-478723.iam.gserviceaccount.com`
6. Set permission to **Make changes to events**
7. Click **Send**

### 5. Verify Setup

The server will automatically initialize the Google Calendar API when it starts. Check the console for:
```
Google Calendar API initialized successfully
```

## Running the Server

### Development (with frontend)
```bash
npm run dev:all
```

This starts both the backend API server (port 3001) and the Vite dev server (port 5173).

### Backend only
```bash
npm run dev:server
```

## Environment Variables

Create a `.env.local` file (or add to existing `.env.local`):

```env
# Service Account Key (choose one method)
# Method 1: File path
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./service-account-key.json

# Method 2: Base64 encoded JSON
# GOOGLE_SERVICE_ACCOUNT_KEY=<base64-encoded-json>

# Server port (optional, defaults to 3001)
PORT=3001
```

## Troubleshooting

### "Service account key not found"
- Ensure `service-account-key.json` exists in the project root
- Or set `GOOGLE_SERVICE_ACCOUNT_KEY` environment variable

### "Calendar not found" or "Insufficient permissions"
- Verify the calendar is shared with the service account email
- Check that the service account has "Make changes to events" permission

### "Invalid credentials"
- Verify the service account key file is valid JSON
- Check that the key hasn't been revoked in Google Cloud Console

