import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Users } from 'lucide-react';
import gaugeLogo from '../assets/gauge-logo.gif';
import { ServiceSlider } from './ServiceSlider';
import { getServicesByCategory } from '@/lib/services';
import { useServiceSlider } from '@/contexts/ServiceSliderContext';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { SlackIcon } from './icons/SlackIcon';
import { OpenSeaIcon } from './icons/OpenSeaIcon';

export function Footer() {
  const { setIsSliderOpen } = useServiceSlider();
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>();

  // Check for service ID from ServicesGrid when slider opens
  useEffect(() => {
    const checkStoredId = () => {
      const storedId = sessionStorage.getItem('selectedServiceId');
      if (storedId) {
        setSelectedServiceId(storedId);
      }
    };

    // Check immediately and also set up interval to catch async updates
    checkStoredId();
    const interval = setInterval(checkStoredId, 100);

    return () => clearInterval(interval);
  }, []);

  const handleServiceClick = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setIsSliderOpen(true);
  };

  const researchServices = getServicesByCategory('Research');
  const strategyServices = getServicesByCategory('Strategy');
  const designServices = getServicesByCategory('Design');

  return (
    <>
      <footer className="py-16 px-6 lg:px-12 bg-black border-t-[5px] border-mango">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div>
              <img
                src={gaugeLogo}
                alt="Gauge.io Logo"
                className="mb-6 max-w-[150px]"
              />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-serif font-semibold text-white mb-6">
                Research
              </h3>
              <ul className="space-y-3 text-lg md:text-xl font-sans text-white" style={{ lineHeight: '1.6' }}>
                {researchServices.map((service) => (
                  <li key={service.id}>
                    <button
                      onClick={() => handleServiceClick(service.id)}
                      className="text-white hover:!text-mango transition-colors text-left"
                    >
                      {service.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-serif font-semibold text-white mb-6">
                Strategy
              </h3>
              <ul className="space-y-3 text-lg md:text-xl font-sans text-white" style={{ lineHeight: '1.6' }}>
                {strategyServices.map((service) => (
                  <li key={service.id}>
                    <button
                      onClick={() => handleServiceClick(service.id)}
                      className="text-white hover:!text-mango transition-colors text-left"
                    >
                      {service.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-serif font-semibold text-white mb-6">
                Design
              </h3>
              <ul className="space-y-3 text-lg md:text-xl font-sans text-white" style={{ lineHeight: '1.6' }}>
                {designServices.map((service) => (
                  <li key={service.id}>
                    <button
                      onClick={() => handleServiceClick(service.id)}
                      className="text-white hover:!text-mango transition-colors text-left"
                    >
                      {service.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4 text-base md:text-lg font-sans text-gray-400">
                <a href="mailto:hello@gauge.io" className="flex items-center gap-2 text-mango hover:text-mango transition-colors">
                  <Mail className="w-5 h-5" />
                  <span>hello@gauge.io</span>
                </a>
                <span>|</span>
                <a href="tel:5105605472" className="flex items-center gap-2 hover:text-mango transition-colors">
                  <Phone className="w-5 h-5" />
                  <span>510 560 5472</span>
                </a>
                <span>|</span>
                <Link
                  to="/coffee"
                  className="flex items-center gap-2 hover:text-mango transition-colors"
                  title="Face to Face In Real Life"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <Users className="w-5 h-5" />
                  <span>F2F IRL?</span>
                </Link>
              </div>
              <div className="flex items-center gap-6">
                <a
                  href="https://www.linkedin.com/company/gauge-san-francisco-user-experience-agency-design-strategy-research-interaction-product-segmentation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-mango transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon className="w-6 h-6" />
                </a>
                <a
                  href="https://opensea.io/collection/gauge-io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-mango transition-colors"
                  aria-label="OpenSea"
                >
                  <OpenSeaIcon className="w-6 h-6" />
                </a>
                <a
                  href="https://join.slack.com/t/gauge-io/shared_invite/zt-8yoogemo-8H9LesU4PAog3~DDvIS7dw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-mango transition-colors"
                  aria-label="Slack"
                >
                  <SlackIcon className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Service Slider */}
      <ServiceSlider
        onClose={() => {
          setIsSliderOpen(false);
          setSelectedServiceId(undefined);
        }}
        initialServiceId={selectedServiceId}
      />
    </>
  );
}