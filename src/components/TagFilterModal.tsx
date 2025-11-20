import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { BlogPost } from '@/lib/ghost';
import { getFuzzyTime } from '@/lib/fuzzy-time';

interface TagFilterModalProps {
  tag: string;
  posts: BlogPost[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostClick: (post: BlogPost) => void;
}

export function TagFilterModal({
  tag,
  posts,
  open,
  onOpenChange,
  onPostClick,
}: TagFilterModalProps) {
  const filteredPosts = posts.filter((post) => post.tags.includes(tag));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif font-semibold text-foreground">
            Articles tagged: {tag}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {filteredPosts.length === 0 ? (
            <p className="text-muted-foreground">No articles found with this tag.</p>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => {
                  onPostClick(post);
                  onOpenChange(false);
                }}
                className="flex gap-4 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer bg-card"
              >
                {post.image && (
                  <div className="flex-shrink-0 w-32 h-24 overflow-hidden rounded">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover opacity-60"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-serif font-semibold text-foreground mb-1 hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {getFuzzyTime(post.publishedAt)}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

