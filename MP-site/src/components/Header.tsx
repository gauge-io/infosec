import React from 'react';
export function Header() {
  return <header className="fixed top-0 left-0 right-0 z-50 bg-black shadow-sm shadow-black/20">
      <div className="border-b-[5px] border-gauge-coral-2">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex justify-between items-center">
          <div className="font-mono text-white text-base md:text-lg font-semibold">
            [ gauge ]
          </div>
          <nav className="hidden md:flex gap-8 text-base md:text-lg font-sans">
            <a href="#services" className="text-white hover:text-gauge-coral-2 transition-colors">
              services
            </a>
            <a href="#approach" className="text-white hover:text-gauge-coral-2 transition-colors">
              approach
            </a>
            <a href="#case-studies" className="text-white hover:text-gauge-coral-2 transition-colors">
              case studies
            </a>
            <a href="#about" className="text-white hover:text-gauge-coral-2 transition-colors">
              about
            </a>
            <a href="#contact" className="text-white hover:text-gauge-coral-2 transition-colors">
              contact
            </a>
          </nav>
        </div>
      </div>
    </header>;
}