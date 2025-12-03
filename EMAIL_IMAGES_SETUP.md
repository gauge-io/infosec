# Email Images Setup

## Issue: Gmail Email Clipping

Gmail clips emails larger than 102KB. Base64-encoded images significantly increase email size, causing truncation.

## Solution: External Image URLs

Images are now referenced via external URLs instead of being base64-encoded inline. This keeps email size small and prevents clipping.

## Configuration

Set these environment variables in `.env.local`:

```env
# External URLs for email images (optional)
# If not set, images will be omitted from emails to keep size small
EMAIL_COFFEE_SHACK_IMAGE_URL=https://your-cdn.com/images/coffee-shack.jpg
EMAIL_GAUGE_LOGO_IMAGE_URL=https://your-cdn.com/images/gauge-logo.gif
```

## Image Hosting Options

### Option 1: Host on Your Website
Upload images to your website and use absolute URLs:
- `https://gauge.io/images/coffee-shack.jpg`
- `https://gauge.io/images/gauge-logo.gif`

### Option 2: Use a CDN
Use a CDN like:
- Cloudflare Images
- AWS S3 + CloudFront
- Google Cloud Storage
- Imgur (for testing)

### Option 3: Omit Images
If environment variables are not set, images will be omitted from emails, keeping them small and preventing clipping.

## Current Behavior

- **If `EMAIL_COFFEE_SHACK_IMAGE_URL` is set**: Coffee Shack image appears in email header
- **If `EMAIL_GAUGE_LOGO_IMAGE_URL` is set**: Gauge logo appears in email footer
- **If neither is set**: Images are omitted, email remains small and won't be clipped

## Testing

1. Set the environment variables
2. Restart the server
3. Send a test booking email
4. Check email size and ensure it's not clipped in Gmail

