import React from 'react';
const services = [{
  title: 'Developer Experience Research',
  description: 'We help you understand how developers interact with your tools, APIs, and platforms to build products that truly serve their workflows.',
  items: ['Specialty Recruitment', 'Applied Ethnography', 'Mixed Methods Studies', 'Survey Design and Programming'],
  align: 'left',
  borderColor: 'border-gauge-coral-1',
  bulletColor: 'text-gauge-coral-1',
  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&q=80&fit=crop'
}, {
  title: 'Strategy and Data Analytics',
  description: 'We transform user behavior data into actionable insights that guide confident product decisions and strategic direction.',
  items: ['Experience Mapping', 'Audience Segmentation', 'Persona Development', 'Community Growth and Advocacy'],
  align: 'right',
  borderColor: 'border-gauge-coral-2',
  bulletColor: 'text-gauge-coral-2',
  image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&q=80&fit=crop'
}, {
  title: 'Product and Service Design',
  description: 'We translate research insights into intuitive interfaces and interactive prototypes that validate your product vision with real users.',
  items: ['Heuristics and UX Assessments', 'Information Architecture', 'Interaction Design and Prototyping', 'Data Visualization'],
  align: 'left',
  borderColor: 'border-gauge-coral-3',
  bulletColor: 'text-gauge-coral-3',
  image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&q=80&fit=crop'
}];
export function ServicesGrid() {
  return <section className="relative py-24 px-6 lg:px-12 bg-black border-b-[5px] border-purple-600 min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-10" style={{
      backgroundImage: 'url(https://uploadthingy.s3.us-west-1.amazonaws.com/p3GQzqGFS671VCQ39UAzdU/gauge-bg.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }} />

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="space-y-32">
          {services.map((service, index) => <div key={index} className={`grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start ${service.align === 'right' ? 'lg:grid-flow-dense' : ''}`}>
              {/* Content Column - 60% width (3/5) */}
              <div className={`lg:col-span-3 ${service.align === 'right' ? 'lg:col-start-3' : ''}`}>
                <div className={`border-l-2 ${service.borderColor} pl-8`}>
                  <h3 className="text-3xl md:text-4xl font-serif font-semibold text-white mb-6">
                    {service.title}
                  </h3>
                  <p className="text-lg md:text-xl font-sans text-gray-200 mb-10 font-light leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {service.items.map((item, idx) => <li key={idx} className="text-lg md:text-xl font-sans text-gray-200 font-light flex items-start gap-3">
                        <span className={`${service.bulletColor} flex-shrink-0`}>
                          »
                        </span>
                        <a href="#" className="hover:text-gauge-coral-2 transition-colors">
                          {item}
                        </a>
                      </li>)}
                  </ul>
                </div>
              </div>

              {/* Image Column - 40% width (2/5) */}
              <div className={`lg:col-span-2 ${service.align === 'right' ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                <div className="w-full bg-gray-900 rounded-sm overflow-hidden" style={{
              height: '400px'
            }}>
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover opacity-60" />
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
}