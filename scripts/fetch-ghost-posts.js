#!/usr/bin/env node

/**
 * Standalone script to fetch Ghost posts
 * Can be run as a cron job or scheduled task
 * 
 * Usage:
 *   node scripts/fetch-ghost-posts.js
 * 
 * Or set up as a cron job (runs daily at 2 AM):
 *   0 2 * * * cd /path/to/infosec && node scripts/fetch-ghost-posts.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');

let GHOST_API_KEY = process.env.VITE_GHOST_API_KEY || '';

try {
  const envFile = readFileSync(envPath, 'utf-8');
  const envVars = envFile.split('\n').reduce((acc, line) => {
    const match = line.match(/^VITE_GHOST_API_KEY=(.+)$/);
    if (match) {
      acc.VITE_GHOST_API_KEY = match[1].trim();
    }
    return acc;
  }, {});
  
  if (envVars.VITE_GHOST_API_KEY) {
    GHOST_API_KEY = envVars.VITE_GHOST_API_KEY;
  }
} catch (err) {
  // .env file might not exist, use process.env only
  console.warn('Could not read .env file, using process.env only');
}

const GHOST_URL = 'https://gauge-user-experience-consultancy.ghost.io';

async function fetchGhostPosts(limit = 10) {
  try {
    const apiUrl = `${GHOST_URL}/ghost/api/content/posts/?key=${GHOST_API_KEY}&include=tags,authors&limit=${limit}`;
    
    console.log(`Fetching posts from Ghost CMS...`);
    console.log(`API URL: ${GHOST_URL}/ghost/api/content/posts/`);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Ghost API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log(`✓ Successfully fetched ${data.posts.length} posts`);
    console.log(`Posts:`);
    data.posts.forEach((post, index) => {
      console.log(`  ${index + 1}. ${post.title} (${post.published_at})`);
    });
    
    return data.posts;
  } catch (error) {
    console.error('Error fetching Ghost posts:', error.message);
    throw error;
  }
}

// Main execution
(async () => {
  try {
    if (!GHOST_API_KEY) {
      console.error('Error: VITE_GHOST_API_KEY not set in .env file');
      process.exit(1);
    }
    
    await fetchGhostPosts(10);
    console.log('\n✓ Script completed successfully');
  } catch (error) {
    console.error('\n✗ Script failed:', error.message);
    process.exit(1);
  }
})();

