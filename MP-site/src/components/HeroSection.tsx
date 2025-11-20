import React from 'react';
const industries = [{
  name: 'Information Security',
  url: 'https://infosec.gauge.io'
}, {
  name: 'Financial Services',
  url: 'https://fintech.gauge.io'
}, {
  name: 'Developer Operations',
  url: 'https://devops.gauge.io'
}];
export function HeroSection() {
  return <section className="relative min-h-[85vh] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 lg:px-12 py-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-semibold text-white mb-8 leading-tight max-w-5xl" style={{
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
        }}>
            Improving Product Outcomes.
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl font-sans text-gray-300 max-w-3xl leading-relaxed font-light mb-8">
            Gauge is a consultancy of designers, researchers, and strategists
            dedicated to helping understand your users and build products that
            serve their needs.
          </p>

          {/* Industry Badges */}
          <div className="flex flex-wrap gap-4">
            {industries.map((industry, index) => <a key={index} href={industry.url} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-gauge-coral-2 bg-opacity-20 text-white font-sans text-base font-semibold rounded-md hover:bg-opacity-30 transition-all duration-300">
                {industry.name}
              </a>)}
          </div>
        </div>
      </div>

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gauge-coral" />
    </section>;
}