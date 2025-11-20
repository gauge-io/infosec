import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import gaugeBg3 from '../assets/gauge-bg-3.webp';
import { fetchGhostPosts, type BlogPost } from '../lib/ghost';
import { ArticleModal } from './ArticleModal';
import { TagFilterModal } from './TagFilterModal';
import { useServiceSlider } from '@/contexts/ServiceSliderContext';

export function BlogSection() {
  const { isSliderOpen } = useServiceSlider();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const itemsPerPage = 3;
  const totalItems = blogPosts.length;
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fetch posts from Ghost CMS
  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true);
        setError(null);
        const posts = await fetchGhostPosts(10);
        setBlogPosts(posts);
      } catch (err) {
        console.error('Failed to load blog posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to load posts');
        // Fallback to empty array - component will show loading/error state
        setBlogPosts([]);
      } finally {
        setLoading(false);
      }
    }
    
    // Load posts immediately
    loadPosts();
    
    // Set up interval to refetch every 24 hours (24 * 60 * 60 * 1000 ms)
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    const intervalId = setInterval(() => {
      console.log('Refreshing Ghost posts (24-hour interval)...');
      loadPosts();
    }, TWENTY_FOUR_HOURS);
    
    // Cleanup interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // No infinite loop - use actual posts
  const displayedPosts = blogPosts;

  // Normalize index to actual posts range for display
  const normalizedIndex = totalItems > 0 ? Math.min(currentIndex, totalItems - 1) : 0;

  const nextSlide = () => {
    setCurrentIndex(prevIndex => {
      if (prevIndex < totalItems - itemsPerPage) {
        return prevIndex + 1;
      }
      return prevIndex; // Don't go beyond the last item
    });
  };

  const prevSlide = () => {
    setCurrentIndex(prevIndex => {
      if (prevIndex > 0) {
        return prevIndex - 1;
      }
      return prevIndex; // Don't go below 0
    });
  };

  // Keyboard navigation - disabled when slider is open
  useEffect(() => {
    if (isSliderOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentIndex(prevIndex => {
          if (prevIndex > 0) {
            return prevIndex - 1;
          }
          return prevIndex;
        });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentIndex(prevIndex => {
          if (prevIndex < totalItems - itemsPerPage) {
            return prevIndex + 1;
          }
          return prevIndex;
        });
      }
    };

    // Add event listener when component mounts
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSliderOpen, totalItems, itemsPerPage]); // Re-run when slider state changes

  // Calculate the item width including gap
  const itemWidth = `calc((100% - ${(itemsPerPage - 1) * 2}rem) / ${itemsPerPage})`;

  return (
    <section className="relative pt-12 pb-24 px-6 lg:px-12 bg-black border-t-[5px] border-purple-500 border-b border-gray-800">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-55" 
        style={{
          backgroundImage: `url(${gaugeBg3})`,
          backgroundSize: 'auto 110%',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          height: '100%',
          width: '100%'
        }} 
      />
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-4xl font-serif font-semibold text-white mb-16 text-center">
          Insights & Articles
        </h2>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading articles...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <p className="text-sm text-gray-500">
              To enable Ghost CMS integration, please set VITE_GHOST_API_KEY in your .env file.
              <br />
              You can get your API key from: <a href="https://gauge-user-experience-consultancy.ghost.io/ghost/#/settings/integrations" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ghost Settings → Integrations</a>
            </p>
          </div>
        )}

        {!loading && !error && blogPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No articles available.</p>
          </div>
        )}

        {!loading && !error && blogPosts.length > 0 && (
          <div className="relative" ref={carouselRef}>
          {/* Carousel Container with padding for arrows */}
          <div className="overflow-hidden px-16">
            <div 
              className="flex transition-transform duration-500 ease-in-out gap-8" 
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`
              }}
            >
              {displayedPosts.map((post, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0" 
                  style={{ width: itemWidth }}
                >
                  <div 
                    onClick={() => {
                      setSelectedPost(post);
                      setArticleModalOpen(true);
                    }}
                    className="group cursor-pointer block border border-gray-700 rounded-lg overflow-hidden hover:border-gauge-coral-2 transition-colors bg-gray-900 h-full"
                  >
                    <div 
                      className="relative w-full bg-gray-900 overflow-hidden" 
                      style={{ aspectRatio: '16/9' }}
                    >
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:brightness-110" 
                      />
                    </div>
                    <div className="p-6 text-center flex flex-col h-full">
                      <div className="flex flex-wrap gap-2 justify-center mb-3">
                        {post.tags.map((tag, tagIndex) => (
                          <button
                            key={tagIndex}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTag(tag);
                              setTagModalOpen(true);
                            }}
                            className="px-3 py-1 text-xs font-sans bg-gray-800 text-gray-400 rounded-full hover:bg-gauge-coral-2 hover:text-white transition-colors"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                      <h3 className="text-xl md:text-2xl font-serif font-semibold text-white mb-3 group-hover:text-gauge-coral-2 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-base md:text-lg font-sans text-gray-400 font-light leading-relaxed mb-4 flex-grow">
                        {post.description}
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-auto">
                        <span>{post.fuzzyTime || post.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons - Disabled when slider is open */}
          <button 
            onClick={prevSlide}
            disabled={isSliderOpen}
            className={`absolute left-0 top-1/2 -translate-y-1/2 bg-gauge-coral-2 bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all z-10 ${
              isSliderOpen ? 'opacity-30 cursor-not-allowed' : ''
            }`}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={nextSlide}
            disabled={isSliderOpen}
            className={`absolute right-0 top-1/2 -translate-y-1/2 bg-gauge-coral-2 bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all z-10 ${
              isSliderOpen ? 'opacity-30 cursor-not-allowed' : ''
            }`}
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator - Shows normalized position */}
          <div className="flex justify-center gap-2 mt-8">
            {blogPosts.map((_, index) => (
              <button 
                key={index} 
                onClick={() => setCurrentIndex(index)} 
                className={`w-2 h-2 rounded-full transition-all ${
                  index === normalizedIndex ? 'bg-gauge-coral-2 w-8' : 'bg-gray-600'
                }`} 
                aria-label={`Go to slide ${index + 1}`} 
              />
            ))}
          </div>
          </div>
        )}

        {/* Article Modal */}
        <ArticleModal
          post={selectedPost}
          open={articleModalOpen}
          onOpenChange={setArticleModalOpen}
        />

        {/* Tag Filter Modal */}
        <TagFilterModal
          tag={selectedTag || ''}
          posts={blogPosts}
          open={tagModalOpen}
          onOpenChange={setTagModalOpen}
          onPostClick={(post) => {
            setSelectedPost(post);
            setArticleModalOpen(true);
          }}
        />
      </div>
    </section>
  );
}