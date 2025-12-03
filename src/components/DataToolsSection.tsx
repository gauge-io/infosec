import { ExternalLink } from 'lucide-react';
import dataSegmentation from '../assets/data-segmentation.png';
import dataNlp from '../assets/data-nlp.png';
import outcome1 from '../assets/outcome-1.png';
import outcome2 from '../assets/outcome-2.png';

const tools = [{
  title: 'Segmentation and Clustering',
  description: 'Upload 10,000 rows of survey data, classify the columns and see what segments result.',
  link: 'anchorbox.gauge.io',
  image: dataSegmentation,
  icon: outcome1
}, {
  title: 'Natural Language Sandbox',
  description: 'Differences in unstructured text between demographics in reviews and comments.',
  link: 'sandbox.gauge.io',
  image: dataNlp,
  icon: outcome2
}];
export function DataToolsSection() {
  return <section className="relative pt-12 pb-6 px-6 lg:px-12 border-b border-gray-800 overflow-hidden">
    {/* Animated Gradient Background */}
    <div
      className="absolute inset-0 animated-gradient z-0"
      style={{
        background: 'linear-gradient(135deg, #FF6B6B 0%, #FF6B8A 25%, #D99A3D 50%, #6B5B95 75%, #66ccff 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite'
      }}
    />
    {/* Black Oval Vignette */}
    <div className="absolute inset-0 pointer-events-none z-[1]" style={{
      background: 'radial-gradient(ellipse 80% 60% at center, transparent 30%, rgba(0,0,0,0.3) 100%)'
    }} />

    <div className="max-w-7xl mx-auto relative z-10">
      <h2 className="text-3xl md:text-4xl font-serif font-semibold text-white mb-16 text-center" style={{
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
      }}>
        Gauge Does More with Data
      </h2>

      <div className="flex flex-wrap gap-8 justify-center max-w-6xl mx-auto">
        {tools.map((tool, index) => <a key={index} href={`https://${tool.link}`} target="_blank" rel="noopener noreferrer" className="border border-purple-700 rounded-lg overflow-hidden hover:border-mango transition-colors text-center max-w-md w-full cursor-pointer group" style={{ backgroundColor: 'rgba(17, 17, 17, 0.9)' }}>
          <div className="w-full bg-gray-900 overflow-hidden p-[10px]" style={{
            aspectRatio: '16/9'
          }}>
            <img src={tool.image} alt={tool.title} className="w-full h-full object-cover opacity-100 group-hover:opacity-100 transition-opacity rounded-sm" />
          </div>
          <div className="p-12">
            {tool.icon && (
              <div className="mb-6 flex justify-center">
                <img 
                  src={tool.icon} 
                  alt=""
                  className="w-16 h-16 object-contain"
                />
              </div>
            )}
            <h3 className="text-2xl md:text-3xl font-serif font-semibold text-white mb-4 group-hover:text-mango transition-colors">
              {tool.title}
            </h3>
            <p className="text-base md:text-lg font-sans text-gray-300 font-light leading-relaxed mb-6">
              {tool.description}
            </p>
            <span className="text-mango font-sans text-base flex items-center justify-center gap-2">
              {tool.link}
              <ExternalLink className="w-4 h-4" />
            </span>
          </div>
        </a>)}
      </div>
    </div>
  </section>;
}