interface CalendlyEmbedProps {
  url: string;
  title?: string;
}
export function CalendlyEmbed({
  url,
  title = 'Schedule a meeting'
}: CalendlyEmbedProps) {
  return <section className="py-20 px-6 lg:px-12 border-b border-gray-800">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4">
          Schedule a Talk
        </h2>
        <p className="text-base md:text-lg font-sans text-gray-300 mb-12 max-w-2xl font-light">
          Book time to discuss how Gauge can help your organization find clarity
          through research and design.
        </p>
        <div className="w-full h-[700px] rounded-sm overflow-hidden bg-white border border-gray-800">
          <iframe src={url} width="100%" height="100%" frameBorder="0" title={title} className="w-full h-full" />
        </div>
      </div>
    </section>;
}