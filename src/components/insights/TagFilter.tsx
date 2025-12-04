
interface Tag {
    name: string;
    slug: string;
    id?: string;
}

interface TagFilterProps {
    tags: Tag[];
    selectedTagSlug: string | null;
    onSelectTag: (tagSlug: string | null) => void;
}

export function TagFilter({
    tags,
    selectedTagSlug,
    onSelectTag
}: TagFilterProps) {
    return (
        <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex items-center gap-3 min-w-max px-1 py-2">
                <span className="text-sm font-sans font-semibold uppercase tracking-wider text-gray-400 mr-2">
                    Filter by:
                </span>

                <button
                    onClick={() => onSelectTag(null)}
                    className="px-3 py-0.5 text-base font-sans bg-mango transition-opacity duration-300 hover:opacity-80"
                    style={{
                        borderRadius: 'var(--radius)',
                        color: '#000000',
                        fontWeight: '600',
                        opacity: selectedTagSlug === null ? 1 : 0.5
                    }}
                >
                    All Topics
                </button>

                {tags.map((tag) => (
                    <button
                        key={tag.slug}
                        onClick={() => onSelectTag(tag.slug)}
                        className="px-3 py-0.5 text-base font-sans bg-mango transition-opacity duration-300 hover:opacity-80"
                        style={{
                            borderRadius: 'var(--radius)',
                            color: '#000000',
                            fontWeight: '600',
                            opacity: selectedTagSlug === tag.slug ? 1 : 0.5
                        }}
                    >
                        {tag.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
