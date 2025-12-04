import { type BlogPost } from '../../lib/ghost';
import { Card, CardContent, CardHeader, CardFooter } from '../ui/card';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TopicTag } from '../TopicTag';

interface ArticleCardProps {
    post: BlogPost;
}

export function ArticleCard({
    post
}: ArticleCardProps) {
    return (
        <Link to={`/blog/${post.slug}`} className="block h-full cursor-pointer">
            <Card className="h-full flex flex-col group border-dashed border-white/20 backdrop-blur-sm hover:bg-mango/20 hover:border-mango transition-all duration-300 hover:shadow-xl cursor-pointer" style={{ backgroundColor: '#0d1520' }}>
                <div className="aspect-video w-full p-3 border-b border-white/10 relative">
                    <div className="w-full h-full overflow-hidden rounded-sm">
                        {post.image ? (
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/40 font-sans text-xs">
                                [IMAGE PLACEHOLDER]
                            </div>
                        )}
                    </div>
                </div>

                <CardHeader className="pt-6 pb-2">
                    <h3 className="text-3xl font-serif font-bold text-white leading-snug group-hover:text-mango transition-colors cursor-pointer">
                        {post.title}
                    </h3>
                </CardHeader>

                <CardContent className="flex-grow py-2">
                    <p className="text-white/70 text-xl leading-relaxed line-clamp-3 font-light cursor-pointer">
                        {post.description}
                    </p>
                </CardContent>

                <CardFooter className="pt-4 pb-6 border-t border-dashed border-white/10 mt-4 flex items-center gap-4 text-sm font-sans text-white/50 flex-wrap cursor-pointer">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>{post.fuzzyTime}</span>
                    </div>
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag, index) => (
                                <TopicTag
                                    key={index}
                                    tag={tag}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            ))}
                        </div>
                    )}
                </CardFooter>
            </Card>
        </Link>
    );
}
