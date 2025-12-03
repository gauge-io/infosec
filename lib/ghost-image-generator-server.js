/**
 * Server-side orchestrator service for generating images and updating Ghost articles
 */

import {
  generateImage,
  generateHeaderImagePrompt,
  generateBodyImagePrompt,
} from './gemini-server.js';
import {
  uploadImageToGhost,
  updatePostFeatureImage,
  updatePostContent,
  getPostById,
  getAllPosts,
} from './ghost-admin-server.js';

/**
 * Generate and insert images for a single Ghost article
 */
export async function generateImagesForArticle(postId, options = {}) {
  const {
    regenerateHeader = false,
    regenerateBody = false,
    maxBodyImages = 3,
  } = options;

  try {
    // Get the post from Ghost
    const post = await getPostById(postId);

    if (!post) {
      throw new Error(`Post ${postId} not found`);
    }

    const result = {
      success: false,
      postId,
      headerImageUrl: null,
      bodyImageUrls: [],
      error: null,
    };

    // Extract text content for prompts
    const htmlText = post.html || '';
    const textContent = htmlText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const excerpt = textContent.substring(0, 300);
    // Extract tags if available (Ghost Admin API may return tags differently)
    const tags = (post.tags || []).map(tag => 
      typeof tag === 'string' ? tag : (tag.name || tag.slug || '')
    ).filter(Boolean);

    // Generate header image (always regenerate, even if one exists)
    try {
      if (post.feature_image) {
        console.log(`Post already has feature image, replacing it for: ${post.title}`);
      } else {
        console.log(`Generating header image for post: ${post.title}`);
      }
      
      const headerPrompt = generateHeaderImagePrompt(post.title, excerpt, tags);
      const headerImageBuffer = await generateImage({
        prompt: headerPrompt,
        width: 1920,
        height: 1080,
        style: 'illustration',
      });

      // Upload to Ghost
      const headerImageUrl = await uploadImageToGhost(
        headerImageBuffer,
        `header-${post.slug}-${Date.now()}.png`
      );

      // Update post with feature image (replaces existing if any)
      await updatePostFeatureImage(postId, headerImageUrl);
      result.headerImageUrl = headerImageUrl;
      console.log(`✓ Header image generated and uploaded: ${headerImageUrl}`);
    } catch (error) {
      console.error('Error generating header image:', error);
      result.error = `Header image generation failed: ${error.message}`;
    }

    // Generate body images (always generate if regenerateBody is true, or if none exist)
    if (regenerateBody || result.bodyImageUrls.length === 0) {
      try {
        // Split content into sections for body images
        // Always generate at least 3 body images if content is available
        const sections = splitContentIntoSections(textContent, maxBodyImages);

        if (sections.length === 0) {
          console.log(`⚠ No content sections found for body images in post: ${post.title}`);
          console.log(`  Content length: ${textContent.length} characters`);
        } else {
          console.log(`Generating ${sections.length} body images for post: ${post.title}`);

          const bodyImagePromises = sections.map(async (section, index) => {
            try {
              const bodyPrompt = generateBodyImagePrompt(section, post.title);
              const bodyImageBuffer = await generateImage({
                prompt: bodyPrompt,
                width: 1200,
                height: 675,
                style: 'illustration',
              });

              // Upload to Ghost
              const bodyImageUrl = await uploadImageToGhost(
                bodyImageBuffer,
                `body-${post.slug}-${index}-${Date.now()}.png`
              );

              return bodyImageUrl;
            } catch (error) {
              console.error(`Error generating body image ${index}:`, error);
              return null;
            }
          });

          const bodyImageUrls = (await Promise.all(bodyImagePromises)).filter(
            (url) => url !== null
          );

          result.bodyImageUrls = bodyImageUrls;

          // Insert body images into HTML content
          if (bodyImageUrls.length > 0) {
            const updatedHtml = insertBodyImagesIntoHtml(post.html, bodyImageUrls);
            await updatePostContent(postId, updatedHtml);
            console.log(`✓ Inserted ${bodyImageUrls.length} body images into post content`);
          }
        }
      } catch (error) {
        console.error('Error generating body images:', error);
        if (!result.error) {
          result.error = `Body image generation failed: ${error.message}`;
        }
      }
    }

    result.success = true;
    return result;
  } catch (error) {
    console.error('Error generating images for article:', error);
    return {
      success: false,
      postId,
      error: error.message,
    };
  }
}

/**
 * Split content into sections for body image generation
 */
function splitContentIntoSections(content, maxSections) {
  if (!content || content.trim().length < 100) {
    // If content is too short, create sections based on available text
    if (content.trim().length > 0) {
      // Split the available content into maxSections parts
      const chunkSize = Math.max(100, Math.floor(content.length / maxSections));
      const sections = [];
      for (let i = 0; i < maxSections && i * chunkSize < content.length; i++) {
        const start = i * chunkSize;
        const end = Math.min((i + 1) * chunkSize, content.length);
        const section = content.substring(start, end).trim();
        if (section.length > 50) {
          sections.push(section);
        }
      }
      return sections.length > 0 ? sections : [content.trim()];
    }
    return [];
  }

  // Split by paragraphs (double newlines) or sentences
  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim().length > 50);
  
  // Also try splitting by HTML paragraph tags if present
  if (paragraphs.length < 2) {
    const htmlParagraphs = content.split(/<\/p>|<p[^>]*>/i).filter((p) => p.trim().length > 50);
    if (htmlParagraphs.length > paragraphs.length) {
      paragraphs.push(...htmlParagraphs);
    }
  }

  // If we have fewer paragraphs than maxSections, try splitting by sentences
  if (paragraphs.length < maxSections) {
    const sentences = content.split(/[.!?]+\s+/).filter((s) => s.trim().length > 50);
    if (sentences.length > paragraphs.length) {
      // Group sentences into sections
      const sentencesPerSection = Math.ceil(sentences.length / maxSections);
      const sections = [];
      for (let i = 0; i < sentences.length; i += sentencesPerSection) {
        const section = sentences.slice(i, i + sentencesPerSection).join('. ').trim();
        if (section.length > 50) {
          sections.push(section);
        }
      }
      return sections.slice(0, maxSections);
    }
  }

  if (paragraphs.length <= maxSections) {
    return paragraphs.slice(0, maxSections);
  }

  // If too many paragraphs, group them
  const sections = [];
  const sectionSize = Math.ceil(paragraphs.length / maxSections);

  for (let i = 0; i < paragraphs.length; i += sectionSize) {
    const section = paragraphs.slice(i, i + sectionSize).join('\n\n');
    if (section.trim().length > 50) {
      sections.push(section);
    }
    if (sections.length >= maxSections) break;
  }

  return sections.slice(0, maxSections);
}

/**
 * Insert body images into HTML content at appropriate locations
 */
function insertBodyImagesIntoHtml(html, imageUrls) {
  // Split HTML by paragraphs
  const paragraphs = html.split(/(<\/p>|<\/div>)/);
  const result = [];
  let imageIndex = 0;

  for (let i = 0; i < paragraphs.length; i++) {
    result.push(paragraphs[i]);

    // Insert image after every 2-3 paragraphs (or at natural break points)
    if (imageIndex < imageUrls.length && i > 0 && (i + 1) % 3 === 0) {
      const imageUrl = imageUrls[imageIndex];
      result.push(
        `\n<figure class="kg-image-card kg-width-wide">\n` +
          `  <img src="${imageUrl}" alt="Article illustration ${imageIndex + 1}" />\n` +
          `</figure>\n`
      );
      imageIndex++;
    }
  }

  // If we have remaining images, add them at the end
  while (imageIndex < imageUrls.length) {
    const imageUrl = imageUrls[imageIndex];
    result.push(
      `\n<figure class="kg-image-card kg-width-wide">\n` +
        `  <img src="${imageUrl}" alt="Article illustration ${imageIndex + 1}" />\n` +
        `</figure>\n`
    );
    imageIndex++;
  }

  return result.join('');
}

/**
 * Process all posts that need images
 */
export async function processAllPostsNeedingImages(options = {}) {
  const { onlyNewPosts = true, regenerateExisting = false } = options;

  try {
    const posts = await getAllPosts(100);
    const results = [];

    for (const post of posts) {
      // Skip if post already has images and we're only processing new posts
      // But always regenerate header images (they will be replaced)
      if (onlyNewPosts && !regenerateExisting && post.feature_image) {
        // Still process if we want to regenerate body images
        if (!regenerateBody) {
          console.log(`Skipping post ${post.id} - already has feature image and body images`);
          continue;
        }
      }

      const result = await generateImagesForArticle(post.id, {
        regenerateHeader: true, // Always regenerate header images (replaces existing)
        regenerateBody: regenerateExisting,
      });

      results.push(result);

      // Add delay between requests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return results;
  } catch (error) {
    console.error('Error processing posts:', error);
    throw error;
  }
}

