import { useState, useEffect, useMemo } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { fetchGhostPosts, type BlogPost } from '../lib/ghost';
import { FeaturedPost } from '../components/insights/FeaturedPost';
import { ArticleCard } from '../components/insights/ArticleCard';
import { TagFilter } from '../components/insights/TagFilter';
import { Search, ArrowUpDown, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import gaugeBgInvTop from '../assets/gauge-bg-inv-top-1.png';
import gaugeBgInvBottom from '../assets/gauge-bg-inv-bottom-6.png';

type SortOption = 'newest' | 'oldest' | 'a-z' | 'z-a';

export function Insights() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagSlug, setSelectedTagSlug] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true);
        const fetchedPosts = await fetchGhostPosts(100); // Fetch enough posts
        setPosts(fetchedPosts);
      } catch (err) {
        console.error('Failed to load insights:', err);
        setError('Failed to load insights. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  // Extract unique tags from all posts
  const allTags = useMemo(() => {
    const tagsMap = new Map();
    posts.forEach(post => {
      if (post.fullTags) {
        post.fullTags.forEach(tag => {
          if (!tagsMap.has(tag.slug)) {
            tagsMap.set(tag.slug, tag);
          }
        });
      }
    });
    return Array.from(tagsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [posts]);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // 1. Filter by Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query)
      );
    }

    // 2. Filter by Tag
    if (selectedTagSlug) {
      result = result.filter(post =>
        post.fullTags && post.fullTags.some(tag => tag.slug === selectedTagSlug)
      );
    }

    // 3. Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'oldest':
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        case 'a-z':
          return a.title.localeCompare(b.title);
        case 'z-a':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return result;
  }, [posts, searchQuery, selectedTagSlug, sortOption]);

  // Identify featured post (first one, or logic to pick specific one)
  // Logic: First post is featured unless filtered
  const featuredPost = posts.length > 0 ? posts[0] : null;

  // Exclude featured post from grid if we're not filtering/searching
  // If user is filtering, we might show the featured post in the grid if it matches
  const displayPosts = filteredPosts.filter(p => {
    if (!featuredPost) return true;
    // If filtering, show all matches. If not filtering, hide the featured post from grid.
    if (searchQuery || selectedTagSlug) return true;
    return p.id !== featuredPost.id;
  });

  return (
    <div className="min-h-screen bg-black font-sans relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div
        className="absolute inset-0 animated-gradient z-0"
        style={{
          background: 'linear-gradient(135deg, #FF6B6B 0%, #FF6B8A 25%, #D99A3D 50%, #6B5B95 75%, #66ccff 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite'
        }}
      />
      {/* Black Fill Layer - 87.5% opacity between gradient and PNGs */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.875)'
        }}
      />
      {/* Top Image with Screen Blend */}
      <div
        className="absolute z-[2]"
        style={{
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          width: '100%'
        }}
      >
        <img
          src={gaugeBgInvTop}
          alt=""
          className="w-full h-full object-cover"
          style={{
            mixBlendMode: 'screen',
            objectPosition: 'top center',
            display: 'block'
          }}
        />
      </div>
      {/* Bottom Image with Screen Blend */}
      <div
        className="absolute z-[2]"
        style={{
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          width: '100%'
        }}
      >
        <img
          src={gaugeBgInvBottom}
          alt=""
          className="w-full h-full object-cover"
          style={{
            mixBlendMode: 'screen',
            objectPosition: 'bottom center',
            display: 'block'
          }}
        />
      </div>

      <div className="relative z-10">
        <Header />

        {/* Hero Section with Dark Grey Background and Blue Border */}
        <section className="relative pt-48 pb-32 px-6 lg:px-12 text-center" style={{ backgroundColor: '#0d1520' }}>
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-semibold tracking-tight mb-10 text-white">
              Insights & Analysis
            </h1>
            <p className="text-2xl md:text-3xl text-white/80 font-light leading-relaxed max-w-4xl mx-auto">
              Deep dives into strategy, technology, and the future of business.
              Explore our latest thinking and research.
            </p>
          </div>
          {/* Blue Bottom Border */}
          <div className="absolute bottom-0 left-0 right-0 h-[5px] bg-blue" />
        </section>

        <main className="pb-24 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">

            {loading ? (
              <div className="flex justify-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mango"></div>
              </div>
            ) : error ? (
              <div className="text-center py-24 text-destructive">
                <p>{error}</p>
                <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
                  Retry
                </Button>
              </div>
            ) : (
              <>
                {/* Featured Post */}
                {featuredPost && (
                  <div className="mt-16 pt-8">
                    <FeaturedPost post={featuredPost} />
                  </div>
                )}

                {/* Controls Section */}
                <div className="sticky top-20 z-10 backdrop-blur-md py-4 mb-8 transition-all rounded-lg px-4" style={{ backgroundColor: '#0d1520' }}>
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-center pb-6 border-b border-dashed border-white/20">
                    <div className="w-full md:w-1/3 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                      <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-mango focus:border-mango"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <span className="text-sm font-sans text-white/60 whitespace-nowrap hidden sm:inline">
                        Sort by:
                      </span>
                      <div className="relative inline-block text-left w-full md:w-48">
                        <select
                          className="w-full pl-3 pr-10 py-2 text-sm border border-white/20 rounded-md bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-mango focus:border-mango appearance-none cursor-pointer font-sans"
                          value={sortOption}
                          onChange={(e) => setSortOption(e.target.value as SortOption)}
                        >
                          <option value="newest">Newest First</option>
                          <option value="oldest">Oldest First</option>
                          <option value="a-z">Title A-Z</option>
                          <option value="z-a">Title Z-A</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/50">
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <TagFilter tags={allTags} selectedTagSlug={selectedTagSlug} onSelectTag={setSelectedTagSlug} />
                  </div>
                </div>

                {/* Results Grid */}
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-sm font-sans font-semibold uppercase tracking-wider text-gray-400">
                      {displayPosts.length}{' '}
                      {displayPosts.length === 1 ? 'Result' : 'Results'}
                    </span>
                    {(searchQuery || selectedTagSlug) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedTagSlug(null);
                        }}
                        className="text-white/60 hover:text-white"
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>

                  {displayPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {displayPosts.map(post => (
                        <ArticleCard key={post.id} post={post} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-24 text-center border-2 border-dashed border-white/20 rounded-lg bg-white/5">
                      <Filter className="w-12 h-12 text-white/40 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">
                        No articles found
                      </h3>
                      <p className="text-white/60 max-w-md mx-auto mb-6">
                        We couldn't find any articles matching your current filters. Try
                        adjusting your search terms or selecting a different topic.
                      </p>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedTagSlug(null);
                        }}
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
