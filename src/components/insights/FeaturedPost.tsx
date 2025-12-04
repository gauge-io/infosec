import { type BlogPost } from '../../lib/ghost';
import { Card } from '../ui/card';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TopicTag } from '../TopicTag';

interface FeaturedPostProps {
    post: BlogPost;
}

export function FeaturedPost({
    post
}: FeaturedPostProps) {
    return (
        <section className="mb-16">
            <span className="text-sm font-sans font-semibold uppercase tracking-wider text-gray-400">
                Featured Insight
            </span>

            <Link to={`/blog/${post.slug}`} onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
                <Card className="overflow-hidden border-2 border-white/20 backdrop-blur-sm group hover:bg-mango/20 hover:border-mango transition-all duration-300 shadow-lg mt-6 cursor-pointer" style={{ backgroundColor: '#0d1520' }}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        <div className="relative h-64 lg:h-auto p-4 border-b lg:border-b-0 lg:border-r border-white/10">
                            <div className="w-full h-full overflow-hidden rounded-sm">
                                {post.image ? (
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/40 font-sans">
                                        [NO IMAGE]
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col p-8 lg:p-12">
                            <h3 className="text-4xl lg:text-5xl font-serif font-bold text-white mb-6 leading-tight tracking-tight cursor-pointer group-hover:text-mango transition-colors">
                                {post.title}
                            </h3>

                            <p className="text-2xl text-white/80 mb-8 leading-relaxed font-light cursor-pointer">
                                {post.description}
                            </p>

                            <div className="mt-auto flex items-center gap-4 border-t border-dashed border-white/10 pt-6 flex-wrap cursor-pointer">
                                <div className="flex items-center gap-2 text-sm font-sans text-white/60">
                                    <Calendar className="w-4 h-4" />
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
                            </div>
                        </div>
                    </div>
                </Card>
            </Link>
        </section>
    );
}
