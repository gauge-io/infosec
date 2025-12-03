/**
 * Ghost Admin API service for uploading images and updating posts
 * Requires Ghost Admin API key (different from Content API key)
 */

const GHOST_URL = 'https://gauge.ghost.io';
const GHOST_ADMIN_API_KEY = process.env.GHOST_ADMIN_API_KEY || '';

export interface GhostAdminPost {
  id: string;
  title: string;
  slug: string;
  html: string;
  feature_image?: string;
  updated_at?: string;
}

/**
 * Upload an image to Ghost CMS
 * Returns the URL of the uploaded image
 */
export async function uploadImageToGhost(imageBuffer: Buffer, filename: string): Promise<string> {
  if (!GHOST_ADMIN_API_KEY) {
    throw new Error(
      'GHOST_ADMIN_API_KEY is not set. Please set GHOST_ADMIN_API_KEY in your .env file. ' +
      'This is different from the Content API key - you need an Admin API key from Ghost Settings → Integrations.'
    );
  }

  try {
    // Ghost Admin API endpoint for uploading images
    const uploadUrl = `${GHOST_URL}/ghost/api/admin/images/upload`;

    // Create form data with the image
    const formData = new FormData();
    const blob = new Blob([imageBuffer], { type: 'image/png' });
    formData.append('file', blob, filename);
    formData.append('purpose', 'image');

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Ghost ${GHOST_ADMIN_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Ghost Admin API upload error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    
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
    throw error;
  }
}

/**
 * Update a Ghost post with a new feature image
 */
export async function updatePostFeatureImage(postId: string, imageUrl: string): Promise<void> {
  if (!GHOST_ADMIN_API_KEY) {
    throw new Error('GHOST_ADMIN_API_KEY is not set');
  }

  try {
    const updateUrl = `${GHOST_URL}/ghost/api/admin/posts/${postId}/`;

    const response = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Ghost ${GHOST_ADMIN_API_KEY}`,
      },
      body: JSON.stringify({
        posts: [
          {
            id: postId,
            feature_image: imageUrl,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Ghost Admin API update error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    console.log(`✓ Updated post ${postId} with feature image: ${imageUrl}`);
    return data;
  } catch (error) {
    console.error('Error updating post feature image:', error);
    throw error;
  }
}

/**
 * Update a Ghost post's HTML content (to insert body images)
 */
export async function updatePostContent(postId: string, html: string): Promise<void> {
  if (!GHOST_ADMIN_API_KEY) {
    throw new Error('GHOST_ADMIN_API_KEY is not set');
  }

  try {
    const updateUrl = `${GHOST_URL}/ghost/api/admin/posts/${postId}/`;

    const response = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Ghost ${GHOST_ADMIN_API_KEY}`,
      },
      body: JSON.stringify({
        posts: [
          {
            id: postId,
            html: html,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Ghost Admin API update error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    console.log(`✓ Updated post ${postId} content`);
    return data;
  } catch (error) {
    console.error('Error updating post content:', error);
    throw error;
  }
}

/**
 * Get a post by ID from Ghost Admin API
 */
export async function getPostById(postId: string): Promise<GhostAdminPost> {
  if (!GHOST_ADMIN_API_KEY) {
    throw new Error('GHOST_ADMIN_API_KEY is not set');
  }

  try {
    const getUrl = `${GHOST_URL}/ghost/api/admin/posts/${postId}/`;

    const response = await fetch(getUrl, {
      method: 'GET',
      headers: {
        Authorization: `Ghost ${GHOST_ADMIN_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Ghost Admin API get error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    
    if (data.posts && data.posts[0]) {
      return data.posts[0];
    } else {
      throw new Error('Post not found in response: ' + JSON.stringify(data));
    }
  } catch (error) {
    console.error('Error fetching post from Ghost:', error);
    throw error;
  }
}

/**
 * Get all posts (for finding new posts that need images)
 */
export async function getAllPosts(limit: number = 50): Promise<GhostAdminPost[]> {
  if (!GHOST_ADMIN_API_KEY) {
    throw new Error('GHOST_ADMIN_API_KEY is not set');
  }

  try {
    const getUrl = `${GHOST_URL}/ghost/api/admin/posts/?limit=${limit}&fields=id,title,slug,html,feature_image,updated_at`;

    const response = await fetch(getUrl, {
      method: 'GET',
      headers: {
        Authorization: `Ghost ${GHOST_ADMIN_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Ghost Admin API get error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    
    if (data.posts) {
      return data.posts;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching posts from Ghost:', error);
    throw error;
  }
}


