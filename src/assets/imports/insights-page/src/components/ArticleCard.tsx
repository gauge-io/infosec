import React from 'react';
import { Post } from '../types/ghost';
import { Card, CardContent, CardHeader, CardFooter } from './ui/Card';
import { Calendar } from 'lucide-react';
interface ArticleCardProps {
  post: Post;
}
export function ArticleCard({
  post
}: ArticleCardProps) {
  const formattedDate = new Date(post.published_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  return <Card variant="outlined" isClickable className="h-full flex flex-col group border-dashed border-gray-300 hover:border-solid hover:border-gray-400 bg-white transition-all duration-300">
      <div className="aspect-video w-full bg-gray-100 overflow-hidden border-b border-gray-200 relative">
        {post.feature_image ? <img src={post.feature_image} alt={post.title} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 font-mono text-xs">
            [IMAGE PLACEHOLDER]
          </div>}

        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {post.tags.slice(0, 1).map(tag => <span key={tag.id} className="px-2 py-0.5 text-[10px] font-mono bg-white/90 backdrop-blur border border-gray-200 text-gray-700 uppercase tracking-wider">
              {tag.name}
            </span>)}
          {post.tags.length > 1 && <span className="px-2 py-0.5 text-[10px] font-mono bg-white/90 backdrop-blur border border-gray-200 text-gray-700">
              +{post.tags.length - 1}
            </span>}
        </div>
      </div>

      <CardHeader className="pt-6 pb-2">
        <h3 className="text-xl font-bold text-gray-900 leading-snug group-hover:text-gray-700 transition-colors">
          {post.title}
        </h3>
      </CardHeader>

      <CardContent className="flex-grow py-2">
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 font-light">
          {post.excerpt}
        </p>
      </CardContent>

      <CardFooter className="pt-4 pb-6 border-t border-dashed border-gray-100 mt-4 flex items-center justify-between text-xs font-mono text-gray-500">
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3" />
          <span>{formattedDate}</span>
        </div>
        <span>{post.reading_time} min</span>
      </CardFooter>
    </Card>;
}