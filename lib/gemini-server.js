/**
 * Server-side Gemini API service for image generation
 * Uses Google AI Studio's Gemini API
 */

import { request } from 'gaxios';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
// Gemini API endpoint (for text generation and prompt enhancement)
// Using gemini-2.0-flash as per user's curl example, but can also use gemini-2.5-flash
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
// Imagen API endpoint (for actual image generation - may need to be accessed differently)
// Try Imagen 4 first, then fallback to Imagen 3
const IMAGEN_4_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/imagen-4:generateImages';
const IMAGEN_3_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:generateImages';

/**
 * Generate an image using Google's Imagen API
 * Note: Gemini models are text-only and don't generate images.
 * We use Imagen API which is Google's image generation model.
 */
export async function generateImage(options) {
  const { prompt, width = 1920, height = 1080, style = 'illustration' } = options;

  if (!GEMINI_API_KEY) {
    throw new Error(
      'GEMINI_API_KEY is not set. Please set GEMINI_API_KEY in your .env file. ' +
      'Get your API key from: https://aistudio.google.com/app/apikey'
    );
  }
  
  // Validate API key format (should start with AIza)
  if (!GEMINI_API_KEY.startsWith('AIza') || GEMINI_API_KEY.length < 35) {
    console.warn('Warning: API key format looks incorrect. Valid keys typically start with "AIza" and are 39+ characters.');
  }

  // Enhanced prompt with style and dimensions
  const enhancedPrompt = `Generate a high-quality ${style} image: ${prompt}. 
    Image dimensions: ${width}x${height} pixels. 
    Style: professional, modern, visually appealing, suitable for article header.`;

  try {
    // Use Imagen API for image generation (Gemini doesn't generate images)
    // First, try using Gemini to enhance the prompt (optional step)
    let finalPrompt = enhancedPrompt;
    
    // Optionally use Gemini to refine the prompt
    try {
      const geminiResponse = await request({
        method: 'POST',
        url: GEMINI_API_URL,
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY, // Note: lowercase header as per API docs
        },
        data: {
          contents: [
            {
              parts: [
                {
                  text: `Refine this image generation prompt to be more specific and detailed: ${prompt}`
                },
              ],
            },
          ],
        },
      });
      
      if (geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text) {
        const refinedPrompt = geminiResponse.data.candidates[0].content.parts[0].text;
        finalPrompt = `${refinedPrompt}. Image dimensions: ${width}x${height} pixels. Style: ${style}, professional, modern.`;
        console.log('✓ Used Gemini to refine image prompt');
      }
    } catch (geminiError) {
      console.warn('Could not refine prompt with Gemini, using original:', geminiError.message);
      // Continue with original prompt
    }
    
    // Now use Imagen API for actual image generation
    // Try Imagen 4 first, then fallback to Imagen 3
    let imagenData;
    let imagenError;
    
    // Try Imagen 4
    try {
      const imagen4Response = await request({
        method: 'POST',
        url: IMAGEN_4_API_URL,
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY, // Note: lowercase header as per API docs
        },
        data: {
          prompt: finalPrompt,
          number_of_images: 1,
          aspect_ratio: '16:9',
        },
      });
      imagenData = imagen4Response.data;
      console.log('✓ Used Imagen 4 for image generation');
    } catch (error4) {
      imagenError = error4;
      console.log('Imagen 4 not available, trying Imagen 3...');
      
      // Fallback to Imagen 3
      try {
        const imagen3Response = await request({
          method: 'POST',
          url: IMAGEN_3_API_URL,
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': GEMINI_API_KEY, // Note: lowercase header as per API docs
          },
          data: {
            prompt: finalPrompt,
            number_of_images: 1,
            aspect_ratio: '16:9',
            safety_filter_level: 'block_some',
            person_generation: 'allow_all',
          },
        });
        imagenData = imagen3Response.data;
        console.log('✓ Used Imagen 3 for image generation');
      } catch (error3) {
        throw new Error(
          `Both Imagen 4 and Imagen 3 failed. ` +
          `Imagen 4 error: ${error4.message}. ` +
          `Imagen 3 error: ${error3.message}. ` +
          `Please check if Imagen API is enabled for your API key.`
        );
      }
    }

    // Imagen API returns images in different formats depending on version
    if (imagenData.generatedImages && imagenData.generatedImages[0]) {
      const imageData = imagenData.generatedImages[0];
      // Imagen 4 format
      if (imageData.image?.imageBytes) {
        return Buffer.from(imageData.image.imageBytes, 'base64');
      }
      // Imagen 3 format
      if (imageData.base64Bytes) {
        return Buffer.from(imageData.base64Bytes, 'base64');
      }
      // URL format
      if (imageData.imageUrl || imageData.image?.imageUrl) {
        const imageUrl = imageData.imageUrl || imageData.image.imageUrl;
        const imageResponse = await request({
          method: 'GET',
          url: imageUrl,
          responseType: 'arraybuffer',
        });
        return Buffer.from(imageResponse.data);
      }
    }

    throw new Error('Imagen API did not return image data in expected format: ' + JSON.stringify(imagenData, null, 2));
  } catch (error) {
    // If Imagen API fails, try alternative approach or provide helpful error
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      console.error('Imagen API error:', JSON.stringify(errorData, null, 2));
      
      // Check if it's an API key issue
      if (errorData.error && errorData.error.message && 
          (errorData.error.message.includes('API key') || errorData.error.message.includes('INVALID_ARGUMENT'))) {
        throw new Error(
          '❌ Invalid API key. The GEMINI_API_KEY in your .env file is not valid.\n' +
          '   Please:\n' +
          '   1. Go to https://aistudio.google.com/app/apikey\n' +
          '   2. Create a new API key or copy your existing valid key\n' +
          '   3. Update GEMINI_API_KEY in your .env file\n' +
          '   4. Ensure the key has access to Imagen API (may require enabling in Google Cloud Console)'
        );
      }
      
      // Check if Imagen API is not available
      if (error.response.status === 404 || errorData.error?.message?.includes('not found')) {
        throw new Error(
          'Imagen API endpoint not found. The model "imagen-3.0-generate-002" may not be available. ' +
          'Please check Google AI Studio for available image generation models.'
        );
      }
    }
    
    console.error('Error generating image with Imagen API:', error);
    throw new Error(
      `Failed to generate image: ${error.message}. ` +
      'Please verify your API key has access to Imagen API in Google Cloud Console.'
    );
  }
}

/**
 * Generate a header image prompt based on article content
 */
export function generateHeaderImagePrompt(title, excerpt, tags = []) {
  const tagContext = tags.length > 0 ? ` Tags: ${tags.join(', ')}.` : '';
  return `Create a professional, eye-catching featured header image for an article titled "${title}". 
    Article excerpt: ${excerpt}.${tagContext}
    The image should be visually striking, modern, and relevant to the article's theme. 
    Use a 16:9 aspect ratio, suitable for web article headers.`;
}

/**
 * Generate a body illustration prompt based on article section
 */
export function generateBodyImagePrompt(sectionText, articleTitle) {
  // Extract key concepts from section (first 200 chars)
  const sectionPreview = sectionText.replace(/<[^>]*>/g, '').substring(0, 200).trim();
  
  return `Create a professional illustration that visually represents this section from an article: "${sectionPreview}".
    The illustration should be clean, modern, and complement the article content.
    Style: minimalist illustration with subtle colors, suitable for embedding in article body.
    Aspect ratio: 16:9, suitable for web content.`;
}

