/**
 * Gemini API service for image generation
 * Uses Google AI Studio's Gemini API to generate images for Ghost articles
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

export interface ImageGenerationOptions {
  prompt: string;
  width?: number;
  height?: number;
  style?: 'photographic' | 'digital-art' | 'illustration' | 'minimalist';
}

/**
 * Generate an image using Gemini API
 * Note: Gemini 2.0 Flash may not directly generate images. This function attempts to use
 * the API and will need to be adapted based on actual Gemini capabilities or use Imagen.
 */
export async function generateImage(options: ImageGenerationOptions): Promise<Buffer> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set. Please set VITE_GEMINI_API_KEY or GEMINI_API_KEY in your .env file.');
  }

  const { prompt, width = 1920, height = 1080, style = 'illustration' } = options;

  // Enhanced prompt with style and dimensions
  const enhancedPrompt = `Generate a high-quality ${style} image: ${prompt}. 
    Image dimensions: ${width}x${height} pixels. 
    Style: professional, modern, visually appealing, suitable for article header.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: enhancedPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Gemini API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();

    // Check if response contains image data
    // Note: Gemini may return image as base64 or URL, or may need to use Imagen API
    if (data.candidates && data.candidates[0]?.content?.parts) {
      for (const part of data.candidates[0].content.parts) {
        // If Gemini returns inline image data
        if (part.inline_data && part.inline_data.data) {
          return Buffer.from(part.inline_data.data, 'base64');
        }
        // If Gemini returns image URL
        if (part.url) {
          const imageResponse = await fetch(part.url);
          if (imageResponse.ok) {
            const arrayBuffer = await imageResponse.arrayBuffer();
            return Buffer.from(arrayBuffer);
          }
        }
      }
    }

    // Fallback: If Gemini doesn't directly generate images, we might need to use Imagen
    // For now, throw an error to indicate this needs configuration
    throw new Error(
      'Gemini API did not return image data. You may need to use Imagen API for image generation. ' +
      'Response: ' + JSON.stringify(data, null, 2)
    );
  } catch (error) {
    console.error('Error generating image with Gemini:', error);
    throw error;
  }
}

/**
 * Generate a header image prompt based on article content
 */
export function generateHeaderImagePrompt(title: string, excerpt: string, tags: string[]): string {
  const tagContext = tags.length > 0 ? ` Tags: ${tags.join(', ')}.` : '';
  return `Create a professional, eye-catching featured header image for an article titled "${title}". 
    Article excerpt: ${excerpt}.${tagContext}
    The image should be visually striking, modern, and relevant to the article's theme. 
    Use a 16:9 aspect ratio, suitable for web article headers.`;
}

/**
 * Generate a body illustration prompt based on article section
 */
export function generateBodyImagePrompt(sectionText: string, articleTitle: string): string {
  // Extract key concepts from section (first 200 chars)
  const sectionPreview = sectionText.replace(/<[^>]*>/g, '').substring(0, 200).trim();
  
  return `Create a professional illustration that visually represents this section from an article: "${sectionPreview}".
    The illustration should be clean, modern, and complement the article content.
    Style: minimalist illustration with subtle colors, suitable for embedding in article body.
    Aspect ratio: 16:9, suitable for web content.`;
}

/**
 * Alternative: Use Imagen API for image generation (if Gemini doesn't support direct image generation)
 * This would require a different API endpoint and setup
 */
export async function generateImageWithImagen(prompt: string): Promise<Buffer> {
  // This is a placeholder - would need to implement Imagen API integration
  // Imagen API endpoint: https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:generateImages
  throw new Error('Imagen API integration not yet implemented. Please configure Gemini image generation or Imagen API.');
}


