# Ghost Article Image Generation Setup

This system automatically generates header and body images for Ghost articles using Google's Gemini API and inserts them into your Ghost CMS.

## Overview

The system acts as an intermediary between Ghost CMS and Google AI Studio (Gemini API):
1. Fetches Ghost articles
2. Generates header images using Gemini based on article content
3. Generates body illustrations using Gemini for article sections
4. Uploads images to Ghost CMS
5. Updates articles with the generated images

## Prerequisites

1. **Ghost Admin API Key** (different from Content API key)
   - Go to Ghost Admin → Settings → Integrations
   - Create a new integration or use an existing one
   - Copy the **Admin API Key** (not the Content API key)
   - The key will be in format: `id:secret` (e.g., `1234567890abcdef:abcdef1234567890`)
   - **Important**: Copy the entire key including the colon and both parts

2. **Google AI Studio API Key** (for Imagen API image generation)
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Click "Create API Key" or use an existing key
   - **Important**: The API key must have access to Imagen API
   - Copy the API key (should start with "AIza" and be 39+ characters)
   - **Note**: If you get "API key not valid" errors, the key may be:
     - Incorrect or expired
     - Missing Imagen API permissions
     - Need to enable Imagen API in Google Cloud Console

## Environment Variables

Add these to your `.env` or `.env.local` file:

```env
# Gemini API Key (from Google AI Studio)
GEMINI_API_KEY=your_gemini_api_key_here

# Ghost Admin API Key (from Ghost Settings → Integrations)
GHOST_ADMIN_API_KEY=your_ghost_admin_api_key_here
```

**Important**: The `GHOST_ADMIN_API_KEY` is different from `VITE_GHOST_API_KEY`. You need the Admin API key to upload images and update posts.

## Installation

Install the required dependency:

```bash
npm install form-data
```

## Quick Start

1. **Set environment variables** in `.env` or `.env.local`:
   ```env
   GEMINI_API_KEY=your_key_here
   GHOST_ADMIN_API_KEY=your_key_here
   ```

2. **Generate images for a specific article**:
   ```bash
   npm run generate-ghost-images POST_ID
   ```

3. **Process all new articles**:
   ```bash
   npm run generate-ghost-images
   ```

Or use the API endpoints (see below).

## API Endpoints

### Generate Images for a Specific Article

```bash
POST /api/ghost/generate-images/:postId

Body:
{
  "regenerateHeader": false,  // Set to true to regenerate even if image exists
  "regenerateBody": false,     // Set to true to regenerate body images
  "maxBodyImages": 3           // Maximum number of body images to generate
}
```

Example:
```bash
curl -X POST http://localhost:3001/api/ghost/generate-images/YOUR_POST_ID \
  -H "Content-Type: application/json" \
  -d '{
    "regenerateHeader": false,
    "regenerateBody": false,
    "maxBodyImages": 3
  }'
```

### Process All Posts

```bash
POST /api/ghost/process-all-posts

Body:
{
  "onlyNewPosts": true,        // Only process posts without feature images
  "regenerateExisting": false  // Regenerate images for posts that already have them
}
```

Example:
```bash
curl -X POST http://localhost:3001/api/ghost/process-all-posts \
  -H "Content-Type: application/json" \
  -d '{
    "onlyNewPosts": true,
    "regenerateExisting": false
  }'
```

## How It Works

### Header Image Generation

1. Extracts article title, excerpt, and tags
2. Creates a prompt: "Create a professional, eye-catching featured header image for an article titled [title]..."
3. Generates image using Gemini API (1920x1080, illustration style)
4. Uploads image to Ghost CMS
5. Updates article's `feature_image` field

### Body Image Generation

1. Splits article content into sections (typically 2-3 sections)
2. For each section, creates a prompt: "Create a professional illustration that visually represents this section..."
3. Generates images using Gemini API (1200x675, illustration style)
4. Uploads images to Ghost CMS
5. Inserts images into article HTML at appropriate locations (after every 2-3 paragraphs)

## Image Generation Prompts

The system uses standardized prompts that are automatically generated based on article content:

**Header Image Prompt:**
```
Create a professional, eye-catching featured header image for an article titled "[title]". 
Article excerpt: [excerpt]. Tags: [tags].
The image should be visually striking, modern, and relevant to the article's theme. 
Use a 16:9 aspect ratio, suitable for web article headers.
```

**Body Image Prompt:**
```
Create a professional illustration that visually represents this section from an article: "[section preview]".
The illustration should be clean, modern, and complement the article content.
Style: minimalist illustration with subtle colors, suitable for embedding in article body.
Aspect ratio: 16:9, suitable for web content.
```

## Important Notes

### Image Generation with Imagen API

**Important**: Gemini models are text-only and do not generate images. This system uses **Imagen API** (Google's image generation model) for creating images.

The system automatically uses:
- **Imagen 3.0** model: `imagen-3.0-generate-002`
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:generateImages`

**API Key Requirements**:
- Your `GEMINI_API_KEY` must have access to Imagen API
- Enable Imagen API in [Google Cloud Console](https://console.cloud.google.com/)
- The API key from Google AI Studio should work if Imagen API is enabled

**If you get "API key not valid" errors**:
1. Verify your API key is correct
2. Enable Imagen API in Google Cloud Console
3. Check that your API key has the necessary permissions
4. Ensure billing is enabled (Imagen API may require billing)

**Alternative**: If Imagen API is not available, you can modify `lib/gemini-server.js` to use:
- Another image generation service (DALL-E, Midjourney, Stable Diffusion, etc.)
- A different Google AI model that supports image generation

### Rate Limiting

The system includes a 2-second delay between processing posts to avoid rate limiting. If you process many posts, consider:
- Processing in batches
- Increasing delays between requests
- Using Ghost webhooks to trigger image generation only for new posts

## Troubleshooting

### "GEMINI_API_KEY is not set"
- Ensure `GEMINI_API_KEY` is set in your `.env` or `.env.local` file
- Restart the server after adding environment variables

### "API key not valid. Please pass a valid API key."
- **The API key in your environment is invalid or expired**
- Get a new API key from: https://aistudio.google.com/app/apikey
- Ensure the key starts with "AIza" and is 39+ characters long
- Update `GEMINI_API_KEY` in your `.env` or `.env.local` file
- Restart the server after updating the key
- **If the error persists**: The key may need Imagen API enabled in Google Cloud Console

### "GHOST_ADMIN_API_KEY is not set"
- Ensure `GHOST_ADMIN_API_KEY` is set (this is different from `VITE_GHOST_API_KEY`)
- Get the Admin API key from Ghost Settings → Integrations

### "Gemini API did not return image data"
- Gemini 2.0 Flash may not support direct image generation
- Consider using Imagen API or another image generation service
- Check Google AI Studio documentation for available models

### "Ghost Admin API upload error"
- Verify your Admin API key is correct
- Check that the integration has proper permissions
- Ensure Ghost instance is accessible

## Automation

You can automate image generation by:

1. **Using Ghost Webhooks**: Set up a webhook in Ghost that triggers when a new post is published
2. **Cron Job**: Schedule a script to run periodically and process new posts
3. **Manual Trigger**: Use the API endpoints manually when needed

Example cron job (runs daily at 3 AM):
```cron
0 3 * * * curl -X POST http://localhost:3001/api/ghost/process-all-posts -H "Content-Type: application/json" -d '{"onlyNewPosts": true}'
```

## Files

- `lib/gemini-server.js` - Gemini API integration for image generation
- `lib/ghost-admin-server.js` - Ghost Admin API integration for uploading images and updating posts
- `lib/ghost-image-generator-server.js` - Orchestrator service that coordinates the workflow
- `server.js` - Express server with API endpoints

## Next Steps

1. Set up environment variables
2. Install `form-data` dependency
3. Test with a single article: `POST /api/ghost/generate-images/:postId`
4. Process all new articles: `POST /api/ghost/process-all-posts`
5. Set up automation (webhooks or cron jobs)

