/**
 * Orchestrator service for generating images and updating Ghost articles
 * This service coordinates between Gemini API and Ghost Admin API
 */

import { generateImage, generateHeaderImagePrompt, generateBodyImagePrompt } from './gemini';
import { 
  uploadImageToGhost, 
  updatePostFeatureImage, 
  updatePostContent, 
  getPostById,
  getAllPosts 
} from './ghost-admin';

export interface ArticleImageGenerationResult {
  success: boolean;
  postId: string;
  headerImageUrl?: string;
  bodyImageUrls?: string[];
  error?: string;
}

/**
 * Generate and insert images for a single Ghost article
 */
export async function generateImagesForArticle(
  postId: string,
  options?: {
    regenerateHeader?: boolean;
    regenerateBody?: boolean;
    maxBodyImages?: number;
  }
): Promise<ArticleImageGenerationResult> {
  const { regenerateHeader = false, regenerateBody = false, maxBodyImages = 3 } = options || {};

  try {
    // Get the post from Ghost
    const post = await getPostById(postId);
    
    if (!post) {
      throw new Error(`Post ${postId} not found`);
    }

    const result: ArticleImageGenerationResult = {
      success: false,
      postId,
      bodyImageUrls: [],
    };

    // Extract text content for prompts
    const htmlText = post.html || '';
    const textContent = htmlText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const excerpt = textContent.substring(0, 300);
    const tags: string[] = []; // Would need to fetch tags separately if needed

    // Generate header image if needed
    if (regenerateHeader || !post.feature_image) {
      try {
        console.log(`Generating header image for post: ${post.title}`);
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

        // Update post with feature image
        await updatePostFeatureImage(postId, headerImageUrl);
        result.headerImageUrl = headerImageUrl;
        console.log(`✓ Header image generated and uploaded: ${headerImageUrl}`);
      } catch (error) {
        console.error('Error generating header image:', error);
        result.error = `Header image generation failed: ${error instanceof Error ? error.message : String(error)}`;
      }
    } else {
      console.log(`Post already has feature image, skipping header generation`);
      result.headerImageUrl = post.feature_image;
    }

    // Generate body images if needed
    if (regenerateBody || result.bodyImageUrls!.length === 0) {
      try {
        // Split content into sections for body images
        const sections = splitContentIntoSections(textContent, maxBodyImages);
        
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
          (url): url is string => url !== null
        );

        result.bodyImageUrls = bodyImageUrls;

        // Insert body images into HTML content
        if (bodyImageUrls.length > 0) {
          const updatedHtml = insertBodyImagesIntoHtml(post.html, bodyImageUrls);
          await updatePostContent(postId, updatedHtml);
          console.log(`✓ Inserted ${bodyImageUrls.length} body images into post content`);
        }
      } catch (error) {
        console.error('Error generating body images:', error);
        if (!result.error) {
          result.error = `Body image generation failed: ${error instanceof Error ? error.message : String(error)}`;
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
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Split content into sections for body image generation
 */
function splitContentIntoSections(content: string, maxSections: number): string[] {
  // Split by paragraphs (double newlines) or sentences
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 50);
  
  if (paragraphs.length <= maxSections) {
    return paragraphs;
  }

  // If too many paragraphs, group them
  const sections: string[] = [];
  const sectionSize = Math.ceil(paragraphs.length / maxSections);

  for (let i = 0; i < paragraphs.length; i += sectionSize) {
    const section = paragraphs.slice(i, i + sectionSize).join('\n\n');
    if (section.trim().length > 50) {
      sections.push(section);
    }
  }

  return sections.slice(0, maxSections);
}

/**
 * Insert body images into HTML content at appropriate locations
 */
function insertBodyImagesIntoHtml(html: string, imageUrls: string[]): string {
  // Split HTML by paragraphs
  const paragraphs = html.split(/(<\/p>|<\/div>)/);
  const result: string[] = [];
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
export async function processAllPostsNeedingImages(
  options?: {
    onlyNewPosts?: boolean;
    regenerateExisting?: boolean;
  }
): Promise<ArticleImageGenerationResult[]> {
  const { onlyNewPosts = true, regenerateExisting = false } = options || {};

  try {
    const posts = await getAllPosts(100);
    const results: ArticleImageGenerationResult[] = [];

    for (const post of posts) {
      // Skip if post already has images and we're only processing new posts
      if (onlyNewPosts && !regenerateExisting && post.feature_image) {
        console.log(`Skipping post ${post.id} - already has feature image`);
        continue;
      }

      const result = await generateImagesForArticle(post.id, {
        regenerateHeader: regenerateExisting || !post.feature_image,
        regenerateBody: regenerateExisting,
      });

      results.push(result);

      // Add delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return results;
  } catch (error) {
    console.error('Error processing posts:', error);
    throw error;
  }
}


