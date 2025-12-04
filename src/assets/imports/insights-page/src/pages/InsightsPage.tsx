import React, { useMemo, useState } from 'react';
import { Search, ArrowUpDown, Filter } from 'lucide-react';
import { mockPosts } from '../data/mockData';
import { FeaturedPost } from '../components/FeaturedPost';
import { ArticleCard } from '../components/ArticleCard';
import { TagFilter } from '../components/TagFilter';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
type SortOption = 'newest' | 'oldest' | 'a-z' | 'z-a';
export function InsightsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  // Extract unique tags from all posts
  const allTags = useMemo(() => {
    const tagsMap = new Map();
    mockPosts.forEach(post => {
      post.tags.forEach(tag => {
        if (!tagsMap.has(tag.id)) {
          tagsMap.set(tag.id, tag);
        }
      });
    });
    return Array.from(tagsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, []);
  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let result = [...mockPosts];
    // 1. Filter by Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post => post.title.toLowerCase().includes(query) || post.excerpt.toLowerCase().includes(query));
    }
    // 2. Filter by Tag
    if (selectedTagId) {
      result = result.filter(post => post.tags.some(tag => tag.id === selectedTagId));
    }
    // 3. Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
        case 'oldest':
          return new Date(a.published_at).getTime() - new Date(b.published_at).getTime();
        case 'a-z':
          return a.title.localeCompare(b.title);
        case 'z-a':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
    return result;
  }, [searchQuery, selectedTagId, sortOption]);
  // Identify featured post (first one marked featured, or just the first one)
  const featuredPost = mockPosts.find(p => p.featured) || mockPosts[0];
  // Exclude featured post from grid if we're not filtering/searching
  // If user is filtering, we might show the featured post in the grid if it matches
  const displayPosts = filteredPosts.filter(p => searchQuery || selectedTagId ? true : p.id !== featuredPost.id);
  return <div className="min-h-screen bg-[#f5f5f7] text-[#1f2933] font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <header className="mb-16 text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900">
            Insights & Analysis
          </h1>
          <p className="text-xl text-gray-500 font-light leading-relaxed max-w-2xl mx-auto">
            Deep dives into strategy, technology, and the future of business.
            Explore our latest thinking and research.
          </p>
        </header>

        {/* Featured Post - Only show when not filtering */}
        {!searchQuery && !selectedTagId && <FeaturedPost post={featuredPost} />}

        {/* Controls Section */}
        <div className="sticky top-0 z-10 bg-[#f5f5f7]/95 backdrop-blur-sm py-4 border-b border-dashed border-gray-300 mb-8 transition-all">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
            <div className="w-full md:w-1/3">
              <Input placeholder="Search articles..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} startAdornment={<Search className="w-4 h-4 text-gray-400" />} className="bg-white" />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-sm font-mono text-gray-500 whitespace-nowrap hidden sm:inline">
                Sort by:
              </span>
              <div className="relative inline-block text-left w-full md:w-48">
                <select className="w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 appearance-none cursor-pointer font-mono" value={sortOption} onChange={e => setSortOption(e.target.value as SortOption)}>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="a-z">Title A-Z</option>
                  <option value="z-a">Title Z-A</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          <TagFilter tags={allTags} selectedTagId={selectedTagId} onSelectTag={setSelectedTagId} />
        </div>

        {/* Results Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-mono uppercase tracking-widest text-gray-500">
              {displayPosts.length}{' '}
              {displayPosts.length === 1 ? 'Result' : 'Results'}
            </h2>
            {(searchQuery || selectedTagId) && <Button variant="tertiary" size="small" onClick={() => {
            setSearchQuery('');
            setSelectedTagId(null);
          }} className="text-gray-500 hover:text-gray-900">
                Clear Filters
              </Button>}
          </div>

          {displayPosts.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayPosts.map(post => <ArticleCard key={post.id} post={post} />)}
            </div> : <div className="py-24 text-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
              <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No articles found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                We couldn't find any articles matching your current filters. Try
                adjusting your search terms or selecting a different topic.
              </p>
              <Button variant="secondary" onClick={() => {
            setSearchQuery('');
            setSelectedTagId(null);
          }}>
                Clear All Filters
              </Button>
            </div>}
        </div>
      </main>
    </div>;
}