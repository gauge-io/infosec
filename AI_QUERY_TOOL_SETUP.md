# AI Query Tool - Setup & Deployment Guide

## Overview

The AI Query Tool is now integrated into your site! It appears as a floating button in the bottom-right corner of the home page and enables visitors to ask questions about Gauge.io's services, case studies, and booking options.

## Local Development

### Option 1: Test with Netlify CLI (Recommended)

This runs both the Vite dev server AND the Netlify Functions locally:

```bash
# Install Netlify CLI globally (one-time setup)
npm install -g netlify-cli

# Run the dev server with Functions support
netlify dev
```

The app will run on `http://localhost:8888` (Netlify's default port).

### Option 2: Test Frontend Only

If you just want to test the UI without the AI functionality:

```bash
npm run dev
```

The floating button and chat interface will work, but sending messages will fail (no Function endpoint).

## Deploying to Netlify

### 1. Add Environment Variable

In your Netlify dashboard:
1. Go to **Site Settings** → **Environment Variables**
2. Click **Add a variable**
3. Add:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: (paste your Gemini API key from `.env.local`)
4. Click **Save**

### 2. Deploy

Your site should automatically deploy when you push to your Git repository. The `netlify.toml` file is already configured.

If deploying manually:
```bash
npm run build
netlify deploy --prod
```

### 3. Verify

Visit your live site and:
1. Click the floating AI button in the bottom-right
2. Try a starter prompt like "What services does Gauge.io offer?"
3. Verify the AI responds correctly

## Features Implemented

✅ **Floating AI Assistant Button** - Bottom-right corner with gradient and sparkle icon  
✅ **Chat Interface** - Collapsible chat window with dark mode styling  
✅ **Starter Prompts** - Pre-written questions to help visitors get started  
✅ **Markdown Rendering** - AI responses support links, bold, lists, etc.  
✅ **Guardrails** - Blocks pricing questions and off-topic inquiries  
✅ **Knowledge Base** - Embedded info about services, case studies, and booking  
✅ **Smart Responses** - Suggests booking meetings when appropriate  

## Guardrails

The AI assistant has built-in guardrails:

### ✅ Allowed Topics
- Services and capabilities
- Case studies and portfolio
- Research methodologies
- Booking meetings (coffee/podcast)
- Company approach and principles
- UX research and design topics

### 🚫 Blocked Topics
- Pricing and costs (redirects to booking a meeting)
- Inappropriate or off-topic questions
- Personal or sensitive information

## Customization

### Update Knowledge Base

Edit `netlify/functions/query.js` and modify the `KNOWLEDGE_BASE` constant to add/update information about:
- New services
- New case studies
- Updated company info
- Additional resources

### Modify Guardrails

In `netlify/functions/query.js`, adjust:
- `GUARDRAILS.allowedTopics` - Add/remove acceptable topics
- `GUARDRAILS.blockedTopics` - Add/remove blocked keywords
- `GUARDRAILS.redirectToBooking` - Topics that suggest booking a meeting

### Update Starter Prompts

Edit `src/components/QueryTool.tsx` and modify the `STARTER_PROMPTS` array:

```typescript
const STARTER_PROMPTS = [
  "What services does Gauge.io offer?",
  "Show me case studies",
  "How can I book a meeting?",
  "Tell me about Gauge's approach to UX research"
];
```

### Styling

The component uses your existing design system from `STYLE_GUIDE.md`:
- Gradient colors (`fuscia` to `mango`)
- Dark mode theme
- IBM Plex Sans font
- Consistent spacing and borders

To customize colors, edit `src/components/QueryTool.tsx` and change the className references.

## Troubleshooting

### "Error processing your question"

**Cause**: Gemini API key not configured or invalid

**Fix**:
1. Check `.env.local` has `GEMINI_API_KEY=...`
2. For production: Add to Netlify environment variables
3. Verify the API key is valid in Google AI Studio

### Chat button not visible

**Cause**: Component not rendering or z-index issue

**Fix**:
1. Check browser console for errors
2. Verify `<QueryTool />` is in `src/pages/Home.tsx`
3. Check that the button has `z-50` (high z-index)

### Messages not sending

**Cause**: Netlify Function not running

**Fix**:
1. Use `netlify dev` instead of `npm run dev`
2. Check `netlify/functions/query.js` exists
3. Verify `netlify.toml` is in project root

### "Method not allowed" error

**Cause**: Function receiving wrong HTTP method

**Fix**: The function only accepts POST requests. Check that the fetch call in `QueryTool.tsx` uses `method: 'POST'`.

## Phase 2: Google Drive Integration (Future)

To add Google Drive document search:

1. Create a specific folder in Drive for agency resources
2. Share folder with service account: `gauge-io@calendar-integration-478723.iam.gserviceaccount.com`
3. Add Drive API scope to `server.js`
4. Create document indexing script
5. Implement RAG (Retrieval Augmented Generation) in the query Function

This will allow the AI to reference actual documents from Drive when answering questions.

## Support

For issues or questions about the AI Query Tool:
- Check the browser console for errors
- Review Netlify Function logs in dashboard
- Test with starter prompts first
- Verify environment variables are set correctly
