import React from 'react';
const clientLogos = ['https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&h=300&q=80&fit=crop', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=300&q=80&fit=crop', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&q=80&fit=crop', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&q=80&fit=crop', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&q=80&fit=crop'];
export function TrustSection() {
  return <section className="relative pt-12 pb-24 px-6 lg:px-12 bg-gauge-coral">
      {/* Black Oval Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
      background: 'radial-gradient(ellipse 80% 60% at center, transparent 30%, rgba(0,0,0,0.3) 100%)'
    }} />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-serif font-semibold text-white mb-12" style={{
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
      }}>
          Relevant Clientele
        </h2>
        <div className="flex flex-wrap gap-6 items-center justify-center">
          {clientLogos.map((logo, index) => <div key={index} className="aspect-video bg-white rounded-sm overflow-hidden opacity-80 hover:opacity-100 transition-opacity w-full max-w-[200px]">
              <img src={logo} alt={`Client ${index + 1}`} className="w-full h-full object-cover grayscale" />
            </div>)}
        </div>
      </div>
    </section>;
}