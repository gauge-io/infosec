/**
 * Server-side Ghost Admin API service for uploading images and updating posts
 */

import { request } from 'gaxios';
import { readFileSync } from 'fs';
import FormData from 'form-data';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const GHOST_URL = 'https://gauge-user-experience-consultancy.ghost.io';
const GHOST_ADMIN_API_KEY = process.env.GHOST_ADMIN_API_KEY || '';

// Cache JWT token to avoid regenerating on every request
let cachedToken = null;
let tokenExpiry = 0;

/**
 * Generate a JWT token for Ghost Admin API authentication
 * Ghost Admin API requires JWT tokens generated from id:secret format
 * The secret is in hexadecimal and needs to be decoded
 */
function generateGhostJWT(apiKey) {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  // Check if we have a valid cached token
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && tokenExpiry > now + 60) {
    // Return cached token if it's still valid (with 60 second buffer)
    return cachedToken;
  }

  // Split the key into id and secret
  if (!apiKey.includes(':')) {
    throw new Error('Ghost Admin API key must be in format "id:secret"');
  }

  const [id, secret] = apiKey.split(':');
  
  // Decode the secret from hexadecimal to binary
  const secretBuffer = Buffer.from(secret, 'hex');

  // Generate JWT token
  // Token expires in 5 minutes (300 seconds) as per Ghost API requirements
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 5 * 60; // 5 minutes from now

  const token = jwt.sign(
    {
      iat: iat,
      exp: exp,
      aud: '/admin/',
    },
    secretBuffer,
    {
      keyid: id,
      algorithm: 'HS256',
    }
  );

  // Cache the token
  cachedToken = token;
  tokenExpiry = exp;

  return token;
}

/**
 * Get the authorization header for Ghost Admin API
 */
function getGhostAuthHeader() {
  if (!GHOST_ADMIN_API_KEY) {
    throw new Error(
      'GHOST_ADMIN_API_KEY is not set. Please set GHOST_ADMIN_API_KEY in your .env file. ' +
      'This is different from the Content API key - you need an Admin API key from Ghost Settings → Integrations.'
    );
  }

  try {
    const token = generateGhostJWT(GHOST_ADMIN_API_KEY);
    return `Ghost ${token}`;
  } catch (error) {
    console.error('Error generating Ghost JWT:', error);
    throw new Error(`Failed to generate Ghost Admin API token: ${error.message}`);
  }
}

/**
 * Upload an image to Ghost CMS
 * Returns the URL of the uploaded image
 */
export async function uploadImageToGhost(imageBuffer, filename) {
  if (!GHOST_ADMIN_API_KEY) {
    throw new Error(
      'GHOST_ADMIN_API_KEY is not set. Please set GHOST_ADMIN_API_KEY in your .env file. ' +
      'This is different from the Content API key - you need an Admin API key from Ghost Settings → Integrations.'
    );
  }

  try {
    // Ghost Admin API endpoint for uploading images
    const uploadUrl = `${GHOST_URL}/ghost/api/admin/images/upload`;

    // Create multipart form data
    const form = new FormData();
    form.append('file', imageBuffer, {
      filename: filename,
      contentType: 'image/png',
    });

    const response = await request({
      method: 'POST',
      url: uploadUrl,
      headers: {
        Authorization: getGhostAuthHeader(),
        ...form.getHeaders(),
      },
      data: form,
    });

    const data = response.data;
    
    // Ghost returns image data in different formats depending on version
    if (data.images && data.images[0] && data.images[0].url) {
      return data.images[0].url;
    } else if (data.url) {
      return data.url;
    } else if (data.image && data.image.url) {
      return data.image.url;
    } else {
      throw new Error('Unexpected response format from Ghost Admin API: ' + JSON.stringify(data));
    }
  } catch (error) {
    console.error('Error uploading image to Ghost:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

/**
 * Update a Ghost post with a new feature image
 */
export async function updatePostFeatureImage(postId, imageUrl) {
  if (!GHOST_ADMIN_API_KEY) {
    throw new Error('GHOST_ADMIN_API_KEY is not set');
  }

  try {
    const updateUrl = `${GHOST_URL}/ghost/api/admin/posts/${postId}/`;

    const response = await request({
      method: 'PUT',
      url: updateUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: getGhostAuthHeader(),
      },
      data: {
        posts: [
          {
            id: postId,
            feature_image: imageUrl,
          },
        ],
      },
    });

    console.log(`✓ Updated post ${postId} with feature image: ${imageUrl}`);
    return response.data;
  } catch (error) {
    console.error('Error updating post feature image:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

/**
 * Update a Ghost post's HTML content (to insert body images)
 */
export async function updatePostContent(postId, html) {
  if (!GHOST_ADMIN_API_KEY) {
    throw new Error('GHOST_ADMIN_API_KEY is not set');
  }

  try {
    const updateUrl = `${GHOST_URL}/ghost/api/admin/posts/${postId}/`;

    const response = await request({
      method: 'PUT',
      url: updateUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: getGhostAuthHeader(),
      },
      data: {
        posts: [
          {
            id: postId,
            html: html,
          },
        ],
      },
    });

    console.log(`✓ Updated post ${postId} content`);
    return response.data;
  } catch (error) {
    console.error('Error updating post content:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

/**
 * Get a post by ID from Ghost Admin API
 */
export async function getPostById(postId) {
  if (!GHOST_ADMIN_API_KEY) {
    throw new Error('GHOST_ADMIN_API_KEY is not set');
  }

  try {
    const getUrl = `${GHOST_URL}/ghost/api/admin/posts/${postId}/`;

    const response = await request({
      method: 'GET',
      url: getUrl,
      headers: {
        Authorization: getGhostAuthHeader(),
      },
    });

    const data = response.data;
    
    if (data.posts && data.posts[0]) {
      return data.posts[0];
    } else {
      throw new Error('Post not found in response: ' + JSON.stringify(data));
    }
  } catch (error) {
    console.error('Error fetching post from Ghost:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

/**
 * Get all posts (for finding new posts that need images)
 */
export async function getAllPosts(limit = 50) {
  if (!GHOST_ADMIN_API_KEY) {
    throw new Error('GHOST_ADMIN_API_KEY is not set');
  }

  try {
    const getUrl = `${GHOST_URL}/ghost/api/admin/posts/?limit=${limit}&fields=id,title,slug,html,feature_image,updated_at`;

    const response = await request({
      method: 'GET',
      url: getUrl,
      headers: {
        Authorization: getGhostAuthHeader(),
      },
    });

    const data = response.data;
    
    if (data.posts) {
      return data.posts;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching posts from Ghost:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

