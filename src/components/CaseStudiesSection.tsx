import React from 'react';
import gaugeBg5 from '../assets/gauge-bg-5.webp';
const caseStudies = [{
  title: 'Enterprise SaaS Platform',
  category: 'Developer Experience Research',
  description: 'Reduced API integration time by 60% through comprehensive developer journey mapping and documentation redesign.',
  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&q=80&fit=crop'
}, {
  title: 'Financial Technology App',
  category: 'Product and Service Design',
  description: 'Increased user onboarding completion by 45% with streamlined information architecture and progressive disclosure patterns.',
  image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&q=80&fit=crop'
}, {
  title: 'Healthcare Platform',
  category: 'Strategy and Data Analytics',
  description: 'Improved patient engagement by 35% through persona development and targeted experience optimization.',
  image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&q=80&fit=crop'
}];
export function CaseStudiesSection() {
  return <section className="relative pt-12 pb-24 px-6 lg:px-12 bg-black border-t-[5px] border-b-[5px] border-gauge-coral-2">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-80" 
        style={{
          backgroundImage: `url(${gaugeBg5})`,
          backgroundSize: 'auto 110%',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          height: '100%',
          width: '100%'
        }} 
      />
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-4xl font-serif font-semibold text-white mb-16 text-center">
          Case Studies
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <div key={index} className="group cursor-pointer bg-gray-900/60 backdrop-blur-sm rounded-lg p-6 border border-transparent hover:border-yellow-500 hover:bg-gray-900/80 transition-all duration-300">
              <div className="relative overflow-hidden rounded-sm mb-6 bg-gray-800" style={{
                height: '160px'
              }}>
                <img src={study.image} alt={study.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:brightness-110" style={{
                  filter: 'grayscale(20%)'
                }} />
                <div className="absolute inset-0 bg-gauge-coral-2 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </div>
              <div>
                <p className="text-sm font-sans text-gray-400 mb-2 uppercase tracking-wide">
                  {study.category}
                </p>
                <h3 className="text-xl md:text-2xl font-serif font-semibold text-white mb-3 group-hover:text-gauge-coral-2 transition-colors">
                  {study.title}
                </h3>
                <p className="text-base md:text-lg font-sans text-gray-400 font-light leading-relaxed">
                  {study.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>;
}