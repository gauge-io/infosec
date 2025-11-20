# Ghost CMS API Setup

The Insights & Articles section pulls data from the Ghost CMS instance at [gauge-user-experience-consultancy.ghost.io](https://gauge-user-experience-consultancy.ghost.io/).

## Getting Your API Key

1. Log in to your Ghost admin panel: https://gauge-user-experience-consultancy.ghost.io/ghost/
2. Navigate to **Settings** → **Integrations**
3. Click **Add custom integration**
4. Give it a name (e.g., "Website Integration")
5. Copy the **Content API Key**

## Setting Up the API Key

1. Create a `.env` file in the root of your project (if it doesn't exist)
2. Add your Ghost API key:

```env
VITE_GHOST_API_KEY=your_content_api_key_here
```

3. Restart your development server for the changes to take effect

## How It Works

The `BlogSection` component automatically fetches posts from Ghost CMS when it loads. It displays:

- **Header images** (feature images from Ghost)
- **Headlines** (post titles)
- **Dates** (formatted publication dates)
- **Authors** (post authors)
- **Descriptions** (post excerpts)
- **Tags** (post tags)

## Automatic Refreshing

The `BlogSection` component automatically refetches posts from Ghost CMS every 24 hours when the page is open. This ensures users always see the latest content.

## Standalone Script

A standalone script is available to fetch posts independently:

```bash
npm run fetch-ghost
```

This script can be scheduled as a cron job to run every 24 hours. See `scripts/README.md` for detailed setup instructions.

### Setting Up a Cron Job (24-hour interval)

Add to your crontab (`crontab -e`):
```cron
0 2 * * * cd /Users/gauge/Documents/GitHub/infosec && node scripts/fetch-ghost-posts.js >> /tmp/ghost-fetch.log 2>&1
```

This runs the script daily at 2 AM and logs output to `/tmp/ghost-fetch.log`.

## Fallback Behavior

If no API key is provided or the API request fails:
- The component will show an error message with instructions
- It will attempt to use public access (if enabled in Ghost)
- The carousel will not display until posts are successfully loaded

## API Endpoint

The integration uses the Ghost Content API:
```
https://gauge-user-experience-consultancy.ghost.io/ghost/api/content/posts/
```

For more information, see the [Ghost Content API documentation](https://ghost.org/docs/content-api/).

