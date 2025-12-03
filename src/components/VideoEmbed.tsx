interface VideoEmbedProps {
  videoId: string;
  title?: string;
}
export function VideoEmbed({
  videoId,
  title = 'Video'
}: VideoEmbedProps) {
  return <section className="py-20 px-6 lg:px-12 border-b border-gray-800">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-12">
          Watch
        </h2>
        <div className="aspect-video w-full rounded-sm overflow-hidden bg-gray-900 border border-gray-800">
          <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}`} title={title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
        </div>
      </div>
    </section>;
}