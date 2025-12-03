import { Link } from 'react-router-dom';

interface TopicTagProps {
  tag: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function TopicTag({ tag, onClick }: TopicTagProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  return (
    <Link
      to={`/blog/tag/${encodeURIComponent(tag)}`}
      className="px-3 py-0.5 text-base font-sans bg-mango transition-opacity duration-300 hover:opacity-80"
      style={{ borderRadius: 'var(--radius)', color: '#000000', fontWeight: '600' }}
      onClick={handleClick}
    >
      {tag}
    </Link>
  );
}

