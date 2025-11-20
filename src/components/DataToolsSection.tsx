import React from 'react';
import { ExternalLink } from 'lucide-react';
import dataSegmentation from '../assets/data-segmentation.png';
import dataNlp from '../assets/data-nlp.png';

const tools = [{
  title: 'Segmentation and Clustering',
  description: 'Upload 10,000 rows of survey data, classify the columns and see what segments result.',
  link: 'anchorbox.gauge.io',
  image: dataSegmentation
}, {
  title: 'Natural Language Sandbox',
  description: 'Differences in unstructured text between demographics in reviews and comments.',
  link: 'sandbox.gauge.io',
  image: dataNlp
}];
export function DataToolsSection() {
  return <section className="relative pt-12 pb-6 px-6 lg:px-12 bg-purple-900 border-b border-gray-800">
      {/* Black Oval Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
      background: 'radial-gradient(ellipse 80% 60% at center, transparent 30%, rgba(0,0,0,0.3) 100%)'
    }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-4xl font-serif font-semibold text-white mb-16 text-center" style={{
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
      }}>
          Gauge Does More with Data
        </h2>

        <div className="flex flex-wrap gap-8 justify-center max-w-6xl mx-auto">
          {tools.map((tool, index) => <a key={index} href={`https://${tool.link}`} target="_blank" rel="noopener noreferrer" className="border border-purple-700 rounded-lg overflow-hidden hover:border-gauge-coral-2 transition-colors bg-purple-950 bg-opacity-50 text-center max-w-md w-full cursor-pointer group">
              <div className="w-full bg-gray-900 overflow-hidden" style={{
            aspectRatio: '16/9'
          }}>
                <img src={tool.image} alt={tool.title} className="w-full h-full object-cover opacity-100 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-10">
                <h3 className="text-2xl md:text-3xl font-serif font-semibold text-white mb-4">
                  {tool.title}
                </h3>
                <p className="text-base md:text-lg font-sans text-gray-300 font-light leading-relaxed mb-6">
                  {tool.description}
                </p>
                <span className="text-gauge-coral-2 font-sans text-base hover:underline flex items-center justify-center gap-2">
                  {tool.link}
                  <ExternalLink className="w-4 h-4" />
                </span>
              </div>
            </a>)}
        </div>
      </div>
    </section>;
}