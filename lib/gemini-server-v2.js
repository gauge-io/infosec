/**
 * Server-side Gemini API service for image generation
 * Uses Google GenAI SDK (official library) for better integration
 */

import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

/**
 * Generate an image using Google's Imagen API via Gemini API
 * Uses the official Google GenAI SDK
 */
export async function generateImage(options) {
  const { prompt, width = 1920, height = 1080, style = 'illustration' } = options;

  if (!GEMINI_API_KEY) {
    throw new Error(
      'GEMINI_API_KEY is not set. Please set GEMINI_API_KEY in your .env file. ' +
      'Get your API key from: https://aistudio.google.com/app/apikey'
    );
  }

  // Enhanced prompt with style and dimensions
  const enhancedPrompt = `Generate a high-quality ${style} image: ${prompt}. 
    Image dimensions: ${width}x${height} pixels. 
    Style: professional, modern, visually appealing, suitable for article header.`;

  try {
    // Initialize the Google GenAI client
    // The SDK automatically picks up GEMINI_API_KEY from environment
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    // First, optionally use Gemini to enhance the prompt
    let finalPrompt = enhancedPrompt;
    
    try {
      const promptResponse = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Refine this image generation prompt to be more specific and detailed: ${prompt}`,
      });
      
      if (promptResponse.text) {
        finalPrompt = `${promptResponse.text}. Image dimensions: ${width}x${height} pixels. Style: ${style}, professional, modern.`;
        console.log('✓ Used Gemini to refine image prompt');
      }
    } catch (geminiError) {
      console.warn('Could not refine prompt with Gemini, using original:', geminiError.message);
      // Continue with original prompt
    }

    // Generate image using Imagen API
    // Try Imagen 4 first (if available), then fallback to Imagen 3
    let imageResponse;
    
    try {
      // Try Imagen 4
      imageResponse = await ai.models.generateImages({
        model: 'imagen-4',
        prompt: finalPrompt,
        number_of_images: 1,
        aspect_ratio: '16:9',
      });
      console.log('✓ Used Imagen 4 for image generation');
    } catch (error4) {
      console.log('Imagen 4 not available, trying Imagen 3...');
      
      // Fallback to Imagen 3
      try {
        imageResponse = await ai.models.generateImages({
          model: 'imagen-3.0-generate-002',
          prompt: finalPrompt,
          number_of_images: 1,
          aspect_ratio: '16:9',
          safety_filter_level: 'block_some',
          person_generation: 'allow_all',
        });
        console.log('✓ Used Imagen 3 for image generation');
      } catch (error3) {
        throw new Error(
          `Both Imagen 4 and Imagen 3 failed. ` +
          `Imagen 4 error: ${error4.message}. ` +
          `Imagen 3 error: ${error3.message}. ` +
          `Please check if Imagen API is enabled for your API key in Google Cloud Console.`
        );
      }
    }

    // Extract image data from response
    if (imageResponse.generatedImages && imageResponse.generatedImages.length > 0) {
      const generatedImage = imageResponse.generatedImages[0];
      
      // Handle different response formats
      if (generatedImage.image?.imageBytes) {
        // Imagen 4 format
        return Buffer.from(generatedImage.image.imageBytes, 'base64');
      } else if (generatedImage.base64Bytes) {
        // Imagen 3 format
        return Buffer.from(generatedImage.base64Bytes, 'base64');
      } else if (generatedImage.imageUrl || generatedImage.image?.imageUrl) {
        // URL format - fetch the image
        const imageUrl = generatedImage.imageUrl || generatedImage.image.imageUrl;
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
      }
    }

    throw new Error('Imagen API did not return image data in expected format: ' + JSON.stringify(imageResponse, null, 2));
  } catch (error) {
    console.error('Error generating image:', error);
    
    // Provide helpful error messages
    if (error.message?.includes('API key') || error.message?.includes('authentication')) {
      throw new Error(
        '❌ Authentication failed. Please verify your GEMINI_API_KEY is correct and has access to Imagen API. ' +
        'You may need to enable Imagen API in Google Cloud Console.'
      );
    }
    
    if (error.message?.includes('not found') || error.message?.includes('404')) {
      throw new Error(
        'Imagen API model not found. Please check available models at https://ai.google.dev/gemini-api/docs/models/imagen'
      );
    }
    
    throw error;
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


