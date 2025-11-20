import { getFuzzyTime } from './fuzzy-time';

// Ghost CMS API integration
const GHOST_URL = 'https://gauge-user-experience-consultancy.ghost.io';
const GHOST_API_KEY = import.meta.env.VITE_GHOST_API_KEY || '';

export interface GhostPost {
  id: string;
  title: string;
  slug: string;
  html: string;
  custom_excerpt: string | null;
  published_at: string;
  feature_image: string | null;
  url?: string;
  tags: Array<{
    name: string;
    slug: string;
  }>;
  authors: Array<{
    name: string;
    slug: string;
  }>;
}

export interface GhostResponse {
  posts: GhostPost[];
  meta: {
    pagination: {
      page: number;
      limit: number;
      pages: number;
      total: number;
      next: number | null;
      prev: number | null;
    };
  };
}

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  image: string;
  url: string;
  date: string;
  fuzzyTime: string;
  publishedAt: string;
  tags: string[];
  author: string;
  html: string;
}

/**
 * Fetch posts from Ghost CMS
 */
export async function fetchGhostPosts(limit: number = 10): Promise<BlogPost[]> {
  try {
    // Build API URL - Ghost Content API
    const apiUrl = `${GHOST_URL}/ghost/api/content/posts/?key=${GHOST_API_KEY}&include=tags,authors&limit=${limit}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      // If API key is missing or invalid, try without key (public access)
      if (response.status === 401 || response.status === 403) {
        console.warn('Ghost API key may be required. Attempting public access...');
        // Try without key - some Ghost instances allow public access
        const publicUrl = `${GHOST_URL}/ghost/api/content/posts/?include=tags,authors&limit=${limit}`;
        const publicResponse = await fetch(publicUrl);
        
        if (!publicResponse.ok) {
          throw new Error(`Ghost API error: ${publicResponse.status} - API key may be required. Please set VITE_GHOST_API_KEY in your .env file.`);
        }
        
        const data: GhostResponse = await publicResponse.json();
        return transformGhostPosts(data.posts);
      }
      
      throw new Error(`Ghost API error: ${response.status} ${response.statusText}`);
    }
    
    const data: GhostResponse = await response.json();
    return transformGhostPosts(data.posts);
  } catch (error) {
    console.error('Error fetching Ghost posts:', error);
    throw error;
  }
}

/**
 * Extract first sentence from HTML or text
 */
function extractFirstSentence(text: string): string {
  // Remove HTML tags
  const textOnly = text.replace(/<[^>]*>/g, '').trim();
  
  // Find first sentence (ending with . ! or ?)
  const match = textOnly.match(/^[^.!?]+[.!?]/);
  if (match) {
    return match[0].trim();
  }
  
  // If no sentence ending found, take first 150 characters
  return textOnly.substring(0, 150).trim() + (textOnly.length > 150 ? '...' : '');
}

/**
 * Transform Ghost posts to our BlogPost format
 */
function transformGhostPosts(posts: GhostPost[]): BlogPost[] {
  return posts.map((post) => {
    // Format date
    const date = new Date(post.published_at);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Get fuzzy time
    const fuzzyTime = getFuzzyTime(post.published_at);
    
    // Get author name (first author if multiple)
    const author = post.authors && post.authors.length > 0 
      ? post.authors[0].name 
      : 'Gauge';
    
    // Get tags
    const tags = post.tags 
      ? post.tags.map(tag => tag.name)
      : [];
    
    // Use feature image or fallback
    const image = post.feature_image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&q=80&fit=crop';
    
    // Use Ghost's custom_excerpt, truncate to 100 characters with ellipsis (25% increase from 80)
    let description = post.custom_excerpt || '';
    if (!description && post.html) {
      description = extractFirstSentence(post.html);
    }
    if (!description) {
      description = post.title;
    }
    // Truncate to 100 characters with ellipsis
    if (description.length > 100) {
      description = description.substring(0, 97).trim() + '...';
    }
    
    // Construct URL if not provided
    const postUrl = post.url || `${GHOST_URL}/${post.slug}/`;
    
    return {
      id: post.id,
      title: post.title || 'Untitled',
      description: description || 'No description available',
      image: image,
      url: postUrl,
      date: formattedDate,
      fuzzyTime: fuzzyTime,
      publishedAt: post.published_at,
      tags: tags,
      author: author,
      html: post.html || '<p>Content not available</p>'
    };
  });
}

