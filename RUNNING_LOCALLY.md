# Running the AI Query Tool Locally

## The Issue

The AI query tool requires the Netlify Functions backend to work. When you run `npm run dev`, only the Vite frontend runs, so queries will fail with errors.

## Solution: Run with Netlify Dev

To test the AI query tool locally, you need to run with Netlify CLI:

### One-Time Setup

```bash
npm install -g netlify-cli
```

### Run the Development Server

Instead of `npm run dev`, use:

```bash
netlify dev
```

This will:
- Start the Vite dev server
- Run the Netlify Functions locally  
- Make the chat AI queries work at `http://localhost:8888`

## Alternative: Deploy to Netlify

If you want to test on the actual deployment:

1. Add `GEMINI_API_KEY` to Netlify environment variables (from `.env.local`)
2. Push your code to Git
3. Netlify will auto-deploy
4. Test on the live site

## Quick Comparison

| Command | Frontend | AI Queries | URL |
|---------|----------|------------|-----|
| `npm run dev` | ✅ Works | ❌ Fails | localhost:5173 |
| `netlify dev` | ✅ Works | ✅ Works | localhost:8888 |
| Deployed | ✅ Works | ✅ Works | Your Netlify URL |

## What You'll See

**With `npm run dev`**: Chat opens but queries show error messages

**With `netlify dev`** or **deployed**: Chat works perfectly with AI responses
