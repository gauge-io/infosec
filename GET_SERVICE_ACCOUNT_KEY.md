# How to Get the Service Account JSON Key File

The value `50cf6c9bbfca36a4d0f39c3f257db7b88c0db09b` appears to be a **private key ID**, but we need the **full JSON key file** to authenticate.

## Quick Steps to Download the Service Account Key

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Select Project**: `calendar-integration-478723`
3. **Navigate to Service Accounts**:
   - Go to **IAM & Admin** > **Service Accounts**
4. **Find Your Service Account**:
   - Look for: `gauge-io@calendar-integration-478723.iam.gserviceaccount.com`
   - Click on it
5. **Create a New Key**:
   - Click the **Keys** tab
   - Click **Add Key** > **Create new key**
   - Choose **JSON** format
   - Click **Create**
   - The JSON file will download automatically

## What the JSON File Should Look Like

The downloaded file should contain something like:

```json
{
  "type": "service_account",
  "project_id": "calendar-integration-478723",
  "private_key_id": "50cf6c9bbfca36a4d0f39c3f257db7b88c0db09b",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "gauge-io@calendar-integration-478723.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/gauge-io%40calendar-integration-478723.iam.gserviceaccount.com"
}
```

## After Downloading

1. **Save the file** as `service_account_key.json` in the project root directory
2. **Verify it's in `.gitignore`** (it should be already)
3. **Restart the server**: `npm run dev:all`

## Important Notes

- ⚠️ **You can only download the key once** when you create it
- ⚠️ **Keep this file secure** - never commit it to version control
- ⚠️ If you've already created a key, you'll need to create a new one (the old one cannot be retrieved)

## Alternative: If You Already Have the Key File

If you have the JSON key file saved elsewhere, you can:

1. Copy the entire JSON content
2. Save it as `service_account_key.json` in the project root
3. Or set it as an environment variable (base64 encoded)

