import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { BlogPost } from '@/lib/ghost';

interface ArticleModalProps {
  post: BlogPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArticleModal({ post, open, onOpenChange }: ArticleModalProps) {
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-card border-border text-foreground flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-3xl font-serif font-semibold text-foreground mb-4">
            {post.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto rounded-lg"
            />
          )}
          {post.html && (
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

