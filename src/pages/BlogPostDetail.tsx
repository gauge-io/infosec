import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchGhostPostBySlug, type BlogPost } from '../lib/ghost';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { BlogSection } from '../components/BlogSection';
import { TopicTag } from '../components/TopicTag';

export function BlogPostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadPost() {
      if (!slug) {
        setError('No post slug provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const fetchedPost = await fetchGhostPostBySlug(slug);
        if (fetchedPost) {
          setPost(fetchedPost);
        } else {
          setError('Post not found');
        }
      } catch (err) {
        console.error('Failed to load blog post:', err);
        setError(err instanceof Error ? err.message : 'Failed to load post');
      } finally {
        setLoading(false);
      }
    }

    loadPost();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  // Style paragraphs before first heading and format pull quotes
  useEffect(() => {
    if (contentRef.current && post?.html) {
      const content = contentRef.current;
      const allElements = Array.from(content.children);
      const firstHeadingIndex = allElements.findIndex(el => 
        ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(el.tagName)
      );
      
      if (firstHeadingIndex > 0) {
        // Style all elements (and their nested paragraphs) before the first heading
        for (let i = 0; i < firstHeadingIndex; i++) {
          const element = allElements[i];
          if (element.tagName === 'P') {
            element.classList.add('article-intro-paragraph');
          } else {
            // Check for nested paragraphs
            const nestedParagraphs = element.querySelectorAll('p');
            nestedParagraphs.forEach(p => p.classList.add('article-intro-paragraph'));
          }
        }
      } else if (firstHeadingIndex === -1) {
        // No headings found, style all paragraphs
        const allParagraphs = content.querySelectorAll('p');
        allParagraphs.forEach(p => p.classList.add('article-intro-paragraph'));
      }
      
      // Format pull quotes to match case study style - aggressive DOM manipulation
      const blockquotes = content.querySelectorAll('blockquote');
      
      blockquotes.forEach((blockquote) => {
        
        // Get the text content and strip any existing straight quotes
        let textContent = blockquote.textContent?.trim() || '';
        // Remove straight quotes that might be in the original content
        textContent = textContent.replace(/^["']|["']$/g, '').trim();
        
        // Create a new styled blockquote structure matching case study exactly
        const newBlockquote = document.createElement('section');
        newBlockquote.className = 'article-pullquote-section';
        newBlockquote.style.cssText = `
          margin-bottom: 6rem;
          margin-top: 6rem;
          width: 130%;
          margin-left: -15%;
          margin-right: -15%;
        `;
        
        const innerDiv = document.createElement('div');
        innerDiv.style.cssText = `
          max-width: 80rem;
          margin-left: auto;
          margin-right: auto;
          text-align: center;
          position: relative;
        `;
        
        const blockquoteEl = document.createElement('blockquote');
        blockquoteEl.style.cssText = `
          position: relative;
          padding: 3rem 0;
        `;
        
        const pEl = document.createElement('p');
        pEl.style.cssText = `
          font-family: 'IBM Plex Serif', serif;
          font-style: italic;
          color: #ffffff;
          font-size: 3.5rem;
          font-weight: 300;
          line-height: 1.5;
          margin: 0;
          padding: 0;
          position: relative;
          z-index: 1;
        `;
        
        // Create opening quote
        const openQuote = document.createElement('span');
        openQuote.textContent = '"';
        openQuote.style.cssText = `
          font-family: 'IBM Plex Serif', serif;
          position: absolute;
          font-size: 6rem;
          font-weight: 700;
          line-height: 1;
          z-index: 10;
          left: -0.8em;
          top: 0;
          pointer-events: none;
          color: #D99A3D;
        `;
        
        // Create closing quote  
        const closeQuote = document.createElement('span');
        closeQuote.textContent = '"';
        closeQuote.style.cssText = `
          font-family: 'IBM Plex Serif', serif;
          position: absolute;
          font-size: 6rem;
          font-weight: 700;
          line-height: 1;
          z-index: 10;
          right: -0.8em;
          top: 0;
          pointer-events: none;
          color: #D99A3D;
        `;
        
        // Wrap text in span with relative positioning for quotes
        const textWrapper = document.createElement('span');
        textWrapper.style.cssText = 'position: relative; display: inline-block;';
        textWrapper.appendChild(openQuote);
        textWrapper.appendChild(document.createTextNode(textContent));
        textWrapper.appendChild(closeQuote);
        
        pEl.appendChild(textWrapper);
        blockquoteEl.appendChild(pEl);
        innerDiv.appendChild(blockquoteEl);
        newBlockquote.appendChild(innerDiv);
        
        // Replace original blockquote with new structure
        blockquote.parentNode?.replaceChild(newBlockquote, blockquote);
      });
    }
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-sans">
        <Header />
        <main className="pt-32 pb-24 px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-400">Loading article...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-black text-white font-sans">
        <Header />
        <main className="pt-32 pb-24 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-red-400 mb-4">{error || 'Post not found'}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-fuscia selection:text-white">
      <Header />
      
      {/* Hero Section with Full-Width Image */}
      <section className="relative w-full min-h-[60vh] flex items-end">
        {/* Background Image */}
        {post.image && (
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${post.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          </div>
        )}
        
        {/* Hero Content */}
        <div className="relative z-10 w-full px-6 lg:px-12 pb-16 pt-32">
          <div className="max-w-7xl mx-auto">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, tagIndex) => (
                <TopicTag key={tagIndex} tag={tag} />
              ))}
            </div>
            
            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6" style={{ lineHeight: '1.3' }}>
              {post.title}
            </h1>
            
            {/* Author and Date */}
            <div className="flex items-center gap-4 text-base md:text-lg font-sans text-gray-300">
              <span>{post.author}</span>
              <span>•</span>
              <span>{post.fuzzyTime || post.date || 'Recently published'}</span>
            </div>
          </div>
        </div>
      </section>
      
      <main className="pt-16 pb-24 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Content */}
          {post.html && (
            <div
              ref={contentRef}
              className="article-content"
              dangerouslySetInnerHTML={{ __html: post.html }}
              style={{
                color: '#e5e7eb',
              }}
            />
          )}
        </div>
      </main>
      
      {/* Insights & Articles Section */}
      <BlogSection excludeSlug={post.slug} />
      
      <Footer />
    </div>
  );
}

