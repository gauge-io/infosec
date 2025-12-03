#!/usr/bin/env node

/**
 * Standalone script to generate images for Ghost articles
 * Can be run manually or as a cron job
 * 
 * Usage:
 *   node scripts/generate-ghost-images.js [postId]
 * 
 * If postId is provided, generates images for that specific post.
 * Otherwise, processes all posts that need images.
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });
dotenv.config({ path: join(__dirname, '..', '.env') });

import {
  generateImagesForArticle,
  processAllPostsNeedingImages,
} from '../lib/ghost-image-generator-server.js';

async function main() {
  const postId = process.argv[2];

  try {
    if (postId) {
      // Generate images for a specific post
      console.log(`Generating images for post: ${postId}`);
      const result = await generateImagesForArticle(postId, {
        regenerateHeader: true, // Always regenerate header (replaces existing)
        regenerateBody: true, // Always generate body images
        maxBodyImages: 3,
      });

      if (result.success) {
        console.log('✓ Successfully generated images');
        console.log(`  Header image: ${result.headerImageUrl || 'failed to generate'}`);
        console.log(`  Body images: ${result.bodyImageUrls?.length || 0} generated`);
        if (result.bodyImageUrls && result.bodyImageUrls.length > 0) {
          result.bodyImageUrls.forEach((url, idx) => {
            console.log(`    - Body image ${idx + 1}: ${url}`);
          });
        }
      } else {
        console.error('✗ Failed to generate images:', result.error);
        process.exit(1);
      }
    } else {
      // Process all posts
      console.log('Processing all posts that need images...');
      const results = await processAllPostsNeedingImages({
        onlyNewPosts: true,
        regenerateExisting: false,
      });

      const successful = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success).length;

      console.log(`\n✓ Processing complete`);
      console.log(`  Total: ${results.length}`);
      console.log(`  Successful: ${successful}`);
      console.log(`  Failed: ${failed}`);

      if (failed > 0) {
        console.log('\nFailed posts:');
        results
          .filter((r) => !r.success)
          .forEach((r) => {
            console.log(`  - ${r.postId}: ${r.error}`);
          });
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();

