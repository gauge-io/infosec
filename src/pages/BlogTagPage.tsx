import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchGhostPosts, type BlogPost } from '../lib/ghost';
import { getFuzzyTime } from '../lib/fuzzy-time';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function BlogTagPage() {
  const { tag } = useParams<{ tag: string }>();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true);
        setError(null);
        // Fetch all posts and filter by tag
        const posts = await fetchGhostPosts(100); // Fetch more posts to ensure we get all tagged posts
        const filteredPosts = posts.filter((post) => post.tags.includes(tag || ''));
        setBlogPosts(filteredPosts);
      } catch (err) {
        console.error('Failed to load blog posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    }

    if (tag) {
      loadPosts();
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [tag]);

  if (!tag) {
    return (
      <div className="min-h-screen bg-black text-white font-sans">
        <Header />
        <main className="pt-32 pb-24 px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-red-400 mb-4">No tag specified</p>
            <Link
              to="/"
              className="inline-flex items-center gap-3 text-lg md:text-xl font-sans font-semibold text-white hover:text-mango transition-colors"
            >
              <span>←</span>
              <span>Back to Home</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Decode the tag from URL (tags may have spaces or special characters)
  const decodedTag = decodeURIComponent(tag);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-fuscia selection:text-white">
      <Header />
      <main className="pt-32 pb-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Back Link */}
          <Link
            to="/"
            className="inline-flex items-center gap-3 text-lg md:text-xl font-sans font-semibold text-white hover:text-mango transition-colors mb-8"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>

          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-4">
              Articles tagged: {decodedTag}
            </h1>
            <p className="text-lg md:text-xl font-sans text-gray-400">
              {blogPosts.length} {blogPosts.length === 1 ? 'article' : 'articles'} found
            </p>
          </div>

          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading articles...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">{error}</p>
            </div>
          )}

          {!loading && !error && blogPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-8">No articles found with this tag.</p>
              <Link
                to="/"
                className="inline-flex items-center gap-3 text-lg md:text-xl font-sans font-semibold text-white hover:text-mango transition-colors"
              >
                <span>←</span>
                <span>Back to Home</span>
              </Link>
            </div>
          )}

          {!loading && !error && blogPosts.length > 0 && (
            <div className="space-y-6">
              {blogPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="flex gap-6 p-6 border border-gray-700 rounded-lg hover:border-mango transition-colors bg-gray-900"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                >
                  {post.image && (
                    <div className="flex-shrink-0 w-48 h-32 md:w-64 md:h-40 overflow-hidden rounded-lg">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((postTag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className={`px-3 py-1 text-xs font-sans ${
                            postTag === decodedTag
                              ? 'bg-mango text-white'
                              : 'bg-gray-800 text-gray-400'
                          }`}
                          style={{ borderRadius: 'var(--radius)' }}
                        >
                          {postTag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-serif font-semibold text-white mb-2 hover:text-mango transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-gray-400 mb-3">
                      {getFuzzyTime(post.publishedAt)} • {post.author}
                    </p>
                    <p className="text-base md:text-lg text-gray-300 line-clamp-2">
                      {post.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

