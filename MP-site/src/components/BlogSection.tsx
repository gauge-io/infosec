import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
const blogPosts = [{
  title: 'Understanding Developer Experience Research',
  description: 'How to conduct effective research with developer audiences and build tools they actually want to use.',
  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&q=80&fit=crop',
  url: 'https://gauge-user-experience-consultancy.ghost.io/',
  date: 'March 15, 2024',
  tags: ['Research', 'Developer Experience']
}, {
  title: 'Data-Driven UX Strategy',
  description: 'Combining qualitative insights with quantitative data to make confident product decisions.',
  image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&q=80&fit=crop',
  url: 'https://gauge-user-experience-consultancy.ghost.io/',
  date: 'March 8, 2024',
  tags: ['Strategy', 'Data Analytics']
}, {
  title: 'Prototyping for Validation',
  description: 'Using interactive prototypes to test assumptions and validate design decisions early.',
  image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=450&q=80&fit=crop',
  url: 'https://gauge-user-experience-consultancy.ghost.io/',
  date: 'February 28, 2024',
  tags: ['Design', 'Prototyping']
}, {
  title: 'Building Accessible Interfaces',
  description: 'Best practices for creating inclusive digital experiences that work for everyone.',
  image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=450&q=80&fit=crop',
  url: 'https://gauge-user-experience-consultancy.ghost.io/',
  date: 'February 20, 2024',
  tags: ['Design', 'Accessibility']
}, {
  title: 'User Research in Agile Teams',
  description: 'Integrating continuous research practices into fast-paced development cycles.',
  image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=450&q=80&fit=crop',
  url: 'https://gauge-user-experience-consultancy.ghost.io/',
  date: 'February 12, 2024',
  tags: ['Research', 'Agile']
}];
export function BlogSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const maxIndex = Math.max(0, blogPosts.length - itemsPerPage);
  const nextSlide = () => {
    setCurrentIndex(prevIndex => Math.min(prevIndex + 1, maxIndex));
  };
  const prevSlide = () => {
    setCurrentIndex(prevIndex => Math.max(prevIndex - 1, 0));
  };
  return <section className="pt-12 pb-24 px-6 lg:px-12 bg-black border-t-[5px] border-purple-500 border-b border-gray-800">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif font-semibold text-white mb-16 text-center">
          Insights & Articles
        </h2>

        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out gap-8" style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerPage + 2.67)}%)`
          }}>
              {blogPosts.map((post, index) => <div key={index} className="flex-shrink-0" style={{
              width: `calc(${100 / itemsPerPage}% - ${8 * (itemsPerPage - 1) / itemsPerPage}px)`
            }}>
                  <a href={post.url} target="_blank" rel="noopener noreferrer" className="group cursor-pointer block border border-gray-700 rounded-lg overflow-hidden hover:border-gauge-coral-2 transition-colors bg-gray-900 h-full">
                    <div className="relative w-full bg-gray-900 overflow-hidden" style={{
                  aspectRatio: '16/9'
                }}>
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:brightness-110" />
                    </div>
                    <div className="p-6 text-center">
                      <div className="flex items-center justify-center gap-2 mb-3 text-sm text-gray-500">
                        <span>{post.date}</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-serif font-semibold text-white mb-3 group-hover:text-gauge-coral-2 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-base md:text-lg font-sans text-gray-400 font-light leading-relaxed mb-4">
                        {post.description}
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {post.tags.map((tag, tagIndex) => <span key={tagIndex} className="px-3 py-1 text-xs font-sans bg-gray-800 text-gray-400 rounded-full">
                            {tag}
                          </span>)}
                      </div>
                    </div>
                  </a>
                </div>)}
            </div>
          </div>

          {/* Navigation Buttons */}
          {currentIndex > 0 && <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-gauge-coral-2 bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all" aria-label="Previous slide">
              <ChevronLeft className="w-6 h-6" />
            </button>}
          {currentIndex < maxIndex && <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-gauge-coral-2 bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all" aria-label="Next slide">
              <ChevronRight className="w-6 h-6" />
            </button>}

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({
            length: maxIndex + 1
          }).map((_, index) => <button key={index} onClick={() => setCurrentIndex(index)} className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-gauge-coral-2 w-8' : 'bg-gray-600'}`} aria-label={`Go to slide ${index + 1}`} />)}
          </div>
        </div>
      </div>
    </section>;
}