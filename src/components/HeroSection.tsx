import doaIcon from '../assets/doa-icon.png';
import ewasteBg from '../assets/ewaste-bg.jpg';

export function HeroSection() {

  return (
    <section className="relative min-h-[50vh] flex items-center">
      {/* Background Image with Overlay and Vignette */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `url(${ewasteBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />
        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60" style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.6) 100%)'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 lg:px-12 py-20">
        <div className="max-w-7xl mx-auto">
          {/* De-Risk DOA Section */}
          <div className="flex items-start gap-4 md:gap-6 mb-8 pt-8 md:pt-12">
            <img
              src={doaIcon}
              alt="DOA Icon"
              className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex-shrink-0 object-contain"
            />
            <div className="flex-1">
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-semibold text-white mb-4 md:mb-6 leading-tight" style={{
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
              }}>
                De-Risk DOA.
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl font-sans text-white max-w-4xl font-medium mb-8" style={{ lineHeight: '1.70625', textIndent: '-6px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                <span className="bg-black py-1" style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem', display: 'inline' }}>
                  Poor UX, misaligned features, or confusing user flows can cause your application to launch – <em className="text-gray-200">dead on arrival</em> – wasting months of effort in engineering and planning. Gauge helps protect your investment and improve product outcomes.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-salmon" />
    </section>
  );
}