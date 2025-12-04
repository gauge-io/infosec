import React from 'react';
import { Post } from '../types/ghost';
import { Card, CardContent, CardHeader, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
interface FeaturedPostProps {
  post: Post;
}
export function FeaturedPost({
  post
}: FeaturedPostProps) {
  const formattedDate = new Date(post.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return <section className="mb-16">
      <div className="flex items-center gap-2 mb-4">
        <span className="h-px w-8 bg-gray-400"></span>
        <span className="text-sm font-mono uppercase tracking-widest text-gray-500">
          Featured Insight
        </span>
      </div>

      <Card variant="elevated" className="overflow-hidden border-2 border-dashed border-gray-300 bg-white group hover:border-gray-400 transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="relative h-64 lg:h-auto overflow-hidden bg-gray-100 border-b lg:border-b-0 lg:border-r border-gray-200">
            {post.feature_image ? <img src={post.feature_image} alt={post.title} className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 font-mono">
                [NO IMAGE]
              </div>}
          </div>

          <div className="flex flex-col p-8 lg:p-12">
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map(tag => <span key={tag.id} className="px-2 py-1 text-xs font-mono border border-gray-300 rounded text-gray-600 uppercase tracking-wide">
                  {tag.name}
                </span>)}
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight tracking-tight">
              {post.title}
            </h2>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed font-light">
              {post.excerpt}
            </p>

            <div className="mt-auto flex items-center justify-between border-t border-dashed border-gray-200 pt-6">
              <div className="flex items-center gap-6 text-sm font-mono text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.reading_time} min read</span>
                </div>
              </div>

              <Button variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Read Article
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </section>;
}