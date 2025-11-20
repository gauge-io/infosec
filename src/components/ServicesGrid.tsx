import gaugeBg from '../assets/gauge-bg.webp';
import servicesResearch from '../assets/services-research.png';
import servicesStrategy from '../assets/services-strategy.png';
import servicesDesign from '../assets/services-design.png';
import { useServiceSlider } from '@/contexts/ServiceSliderContext';
import { SERVICES } from '@/lib/services';

// Map service display names to service IDs
const serviceNameToId: Record<string, string> = {
  'Specialty Recruitment': 'specialty-recruitment',
  'Applied Ethnography': 'applied-ethnography',
  'Mixed Methods Studies': 'mixed-methods-studies',
  'Survey Design and Programming': 'survey-design',
  'Experience Mapping': 'experience-mapping',
  'Audience Segmentation': 'audience-segmentation',
  'Persona Development': 'persona-development',
  'Community Growth and Advocacy': 'community-growth',
  'Heuristics and UX Assessments': 'heuristic-assessment',
  'Information Architecture': 'information-architecture',
  'Interaction Design and Prototyping': 'interaction-design',
  'Data Visualization': 'data-visualization',
};

const services = [{
  title: 'Developer Experience Research',
  description: 'We help you understand how developers interact with your tools, APIs, and platforms to build products that truly serve their workflows.',
  items: ['Specialty Recruitment', 'Applied Ethnography', 'Mixed Methods Studies', 'Survey Design and Programming'],
  align: 'left',
  borderColor: 'border-gauge-coral-1',
  bulletColor: 'text-gauge-coral-1',
  image: servicesResearch
}, {
  title: 'Strategy and Data Analytics',
  description: 'We transform user behavior data into actionable insights that guide confident product decisions and strategic direction.',
  items: ['Experience Mapping', 'Audience Segmentation', 'Persona Development', 'Community Growth and Advocacy'],
  align: 'right',
  borderColor: 'border-gauge-coral-2',
  bulletColor: 'text-gauge-coral-2',
  image: servicesStrategy
}, {
  title: 'Product and Service Design',
  description: 'We translate research insights into intuitive interfaces and interactive prototypes that validate your product vision with real users.',
  items: ['Heuristics and UX Assessments', 'Information Architecture', 'Interaction Design and Prototyping', 'Data Visualization'],
  align: 'left',
  borderColor: 'border-gauge-coral-3',
  bulletColor: 'text-gauge-coral-3',
  image: servicesDesign
}];

export function ServicesGrid() {
  const { setIsSliderOpen } = useServiceSlider();

  const handleServiceClick = (serviceName: string) => {
    const serviceId = serviceNameToId[serviceName];
    if (serviceId) {
      // Store the service ID in sessionStorage so ServiceSlider can read it
      sessionStorage.setItem('selectedServiceId', serviceId);
      setIsSliderOpen(true);
    }
  };
  return <section className="relative py-24 px-6 lg:px-12 bg-black border-b-[5px] border-purple-600 min-h-screen flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-35" 
        style={{
          backgroundImage: `url(${gaugeBg})`,
          backgroundSize: 'auto 110%',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          height: '100%',
          width: '100%'
        }} 
      />

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
                        <button
                          onClick={() => handleServiceClick(item)}
                          className="hover:text-gauge-coral-2 transition-colors text-left"
                        >
                          {item}
                        </button>
                      </li>)}
                  </ul>
                </div>
              </div>

              {/* Image Column - 40% width (2/5) */}
              <div className={`lg:col-span-2 ${service.align === 'right' ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                <div className="w-full bg-transparent rounded-sm overflow-hidden" style={{
              height: '400px'
            }}>
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover opacity-100" />
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
}