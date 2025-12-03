import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SERVICES } from '@/lib/services';
import { useServiceSlider } from '@/contexts/ServiceSliderContext';

// Import service images
import pic1Recruitment from '../assets/pic-1-recruitment.png';
import pic2Ethnography from '../assets/pic-2-ethnography.png';
import pic3MixedMethods from '../assets/pic-3-mixed-methods.png';
import pic4Survey from '../assets/pic-4-survey.png';
import pic5ExperienceMapping from '../assets/pic-5-experience-mapping.png';
import pic6AudienceSegmentation from '../assets/pic-6-audience-segmentation.png';
import pic7PersonaDevelopment from '../assets/pic-7-persona-development.png';
import pic8CommunityGrowth from '../assets/pic-8-community-growth.png';
import pic9HeuristicUx from '../assets/pic-9-heuristic-ux.png';
import pic10InformationArchitecture from '../assets/pic-10-information-architecture.png';
import pic11InteractionDesign from '../assets/pic-11-interaction-design-prototyping.png';
import pic12DataVisualization from '../assets/pic-12-data-visualization.png';

const serviceImages: Record<string, string> = {
  'specialty-recruitment': pic1Recruitment,
  'applied-ethnography': pic2Ethnography,
  'mixed-methods-studies': pic3MixedMethods,
  'survey-design': pic4Survey,
  'experience-mapping': pic5ExperienceMapping,
  'audience-segmentation': pic6AudienceSegmentation,
  'persona-development': pic7PersonaDevelopment,
  'community-growth': pic8CommunityGrowth,
  'heuristic-assessment': pic9HeuristicUx,
  'information-architecture': pic10InformationArchitecture,
  'interaction-design': pic11InteractionDesign,
  'data-visualization': pic12DataVisualization,
};

interface ServiceSliderProps {
  onClose: () => void;
  initialServiceId?: string;
}

export function ServiceSlider({ onClose, initialServiceId }: ServiceSliderProps) {
  const { isSliderOpen: isOpen } = useServiceSlider();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  // Set initial service index if provided
  useEffect(() => {
    // Check both prop and sessionStorage for service ID
    const serviceId = initialServiceId || sessionStorage.getItem('selectedServiceId');
    if (serviceId && isOpen) {
      const index = SERVICES.findIndex(s => s.id === serviceId);
      if (index !== -1) {
        setCurrentIndex(index);
      }
      // Clear sessionStorage after use
      if (sessionStorage.getItem('selectedServiceId')) {
        sessionStorage.removeItem('selectedServiceId');
      }
    }
  }, [initialServiceId, isOpen]);

  // Prevent body scroll when slider is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsClosing(true);
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex(prev => (prev > 0 ? prev - 1 : SERVICES.length - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex(prev => (prev < SERVICES.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, onClose]);

  const currentService = SERVICES[currentIndex];
  const currentCategory = currentService.category;

  const nextService = () => {
    setCurrentIndex(prev => (prev < SERVICES.length - 1 ? prev + 1 : 0));
  };

  const prevService = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : SERVICES.length - 1));
  };

  const handleClose = () => {
    setIsClosing(true);
    onClose();
  };

  // Reset closing state when opening - use a timeout to ensure transition classes are reapplied
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure DOM has updated and transition classes can be applied
      const timer = setTimeout(() => {
        setIsClosing(false);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      // Reset immediately when closed
      setIsClosing(false);
    }
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/80 z-50 ${
          isClosing ? '' : 'transition-opacity duration-300 ease-in-out'
        } ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
      />

      {/* Slider Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[600px] lg:w-[700px] bg-card border-l border-border z-50 transform overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isOpen && !isClosing ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          willChange: 'transform',
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: isClosing ? 'none' : 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="text-sm font-sans text-muted-foreground uppercase tracking-wide">
                {currentCategory}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm font-sans text-muted-foreground">
                {currentIndex + 1} of {SERVICES.length}
              </span>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-8">
              <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-6">
                {currentService.name}
              </h2>
              
              {/* Service Image */}
              {serviceImages[currentService.id] && (
                <div className="mb-6 rounded-lg overflow-hidden">
                  <img
                    src={serviceImages[currentService.id]}
                    alt={currentService.name}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
              
              {/* Service Content */}
              {currentService.details ? (
                <div className="prose prose-invert max-w-none text-foreground">
                  <p className="text-lg md:text-xl font-sans text-foreground leading-relaxed whitespace-pre-line">
                    {currentService.details}
                  </p>
                </div>
              ) : (
                <p className="text-lg md:text-xl font-sans text-muted-foreground leading-relaxed mb-8">
                  {currentService.description}
                </p>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between p-6 border-t border-border">
            <button
              onClick={prevService}
              className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors"
              aria-label="Previous service"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-sans">Previous</span>
            </button>

            {/* Dots indicator */}
            <div className="flex gap-2">
              {SERVICES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-primary w-8'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to service ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextService}
              className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors"
              aria-label="Next service"
            >
              <span className="font-sans">Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

