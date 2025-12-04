import React from 'react';
import { Button } from './ui/Button';
import { Tag } from '../types/ghost';
interface TagFilterProps {
  tags: Tag[];
  selectedTagId: string | null;
  onSelectTag: (tagId: string | null) => void;
}
export function TagFilter({
  tags,
  selectedTagId,
  onSelectTag
}: TagFilterProps) {
  return <div className="w-full overflow-x-auto pb-2 scrollbar-hide border-b border-dashed border-gray-300 mb-8">
      <div className="flex items-center gap-3 min-w-max px-1 py-4">
        <span className="text-xs font-mono text-gray-500 uppercase tracking-widest mr-2">
          Filter by:
        </span>

        <Button variant={selectedTagId === null ? 'primary' : 'secondary'} size="small" onClick={() => onSelectTag(null)} className={selectedTagId === null ? 'bg-gray-800 text-white' : 'bg-transparent border border-gray-300 hover:bg-gray-100'}>
          All Topics
        </Button>

        {tags.map(tag => <Button key={tag.id} variant={selectedTagId === tag.id ? 'primary' : 'secondary'} size="small" onClick={() => onSelectTag(tag.id)} className={selectedTagId === tag.id ? 'bg-gray-800 text-white' : 'bg-transparent border border-gray-300 hover:bg-gray-100'}>
            {tag.name}
          </Button>)}
      </div>
    </div>;
}