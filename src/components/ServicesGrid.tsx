import { useEffect, useRef } from 'react';
import homeEarBuild from '../assets/home-ear-build.mp4';
import homeBrainBuild from '../assets/home-brain-build.mp4';
import homeHeartBuild from '../assets/home-heart-build.mp4';
import gaugeBgInvTop from '../assets/gauge-bg-inv-top-1.png';
import gaugeBgInvBottom from '../assets/gauge-bg-inv-bottom-6.png';
import { useServiceSlider } from '@/contexts/ServiceSliderContext';

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
  borderColor: 'border-fuscia',
  bulletColor: 'text-fuscia',
  image: homeEarBuild,
  isVideo: true
}, {
  title: 'Strategy and Data Analytics',
  description: 'We transform user behavior data into actionable insights that guide confident product decisions and strategic direction.',
  items: ['Experience Mapping', 'Audience Segmentation', 'Persona Development', 'Community Growth and Advocacy'],
  align: 'right',
  borderColor: 'border-mango',
  bulletColor: 'text-mango',
  image: homeBrainBuild,
  isVideo: true
}, {
  title: 'Product and Service Design',
  description: 'We translate research insights into intuitive interfaces and interactive prototypes that validate your product vision with real users.',
  items: ['Heuristics and UX Assessments', 'Information Architecture', 'Interaction Design and Prototyping', 'Data Visualization'],
  align: 'left',
  borderColor: 'border-blue',
  bulletColor: 'text-blue',
  image: homeHeartBuild,
  isVideo: true
}];

export function ServicesGrid() {
  const { setIsSliderOpen } = useServiceSlider();
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const hasPlayedRef = useRef<Set<number>>(new Set()); // Track which videos have played

  const handleServiceClick = (serviceName: string) => {
    const serviceId = serviceNameToId[serviceName];
    if (serviceId) {
      // Store the service ID in sessionStorage so ServiceSlider can read it
      sessionStorage.setItem('selectedServiceId', serviceId);
      setIsSliderOpen(true);
    }
  };

  // Intersection Observer for video playback - handles multiple videos
  useEffect(() => {
    const videos = videoRefs.current.filter(Boolean) as HTMLVideoElement[];
    if (videos.length === 0) return;

    // Handle video end events - pause at last frame
    const handleVideoEnd = (video: HTMLVideoElement, index: number) => {
      video.pause();
      // Seek to last frame to ensure it's frozen
      video.currentTime = video.duration;
      hasPlayedRef.current.add(index);
    };

    // Set playback rate to 2x and handle end of video
    const endHandlers: Array<{ video: HTMLVideoElement; handler: () => void; index: number }> = [];
    videos.forEach((video, index) => {
      if (video) {
        video.playbackRate = 2.0;
        
        // When video ends, pause at last frame
        const handler = () => handleVideoEnd(video, index);
        video.addEventListener('ended', handler);
        endHandlers.push({ video, handler, index });
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          const videoIndex = videoRefs.current.indexOf(video);
          
          if (entry.isIntersecting) {
            // Only reset and play if video hasn't been played yet
            if (!hasPlayedRef.current.has(videoIndex)) {
              video.currentTime = 0;
              video.playbackRate = 2.0;
              video.play().catch((err) => {
                console.error('Error playing video:', err);
              });
            } else {
              // If already played, just resume from current position
              if (video.paused) {
                video.play().catch((err) => {
                  console.error('Error playing video:', err);
                });
              }
            }
          } else {
            video.pause();
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of video is visible
      }
    );

    videos.forEach((video) => {
      if (video) {
        observer.observe(video);
      }
    });

    return () => {
      videos.forEach((video) => {
        if (video) {
          observer.unobserve(video);
        }
      });
      endHandlers.forEach(({ video, handler }) => {
        video.removeEventListener('ended', handler);
      });
      observer.disconnect();
    };
  }, []);
  return <section className="relative py-24 px-6 lg:px-12 border-b-[5px] border-purple-600 min-h-screen flex items-center overflow-hidden">
      {/* Animated Gradient Background */}
      <div 
        className="absolute inset-0 animated-gradient z-0"
        style={{
          background: 'linear-gradient(135deg, #FF6B6B 0%, #FF6B8A 25%, #D99A3D 50%, #6B5B95 75%, #66ccff 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite'
        }}
      />
      {/* Black Fill Layer - 87.5% opacity between gradient and PNGs */}
      <div 
        className="absolute inset-0 z-[1]"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.875)'
        }}
      />
      {/* Top Image with Screen Blend - white lines show colors through */}
      <div 
        className="absolute z-[2]"
        style={{
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          width: '100%'
        }}
      >
        <img 
          src={gaugeBgInvTop} 
          alt=""
          className="w-full h-full object-cover"
          style={{
            mixBlendMode: 'screen',
            objectPosition: 'top center',
            display: 'block'
          }}
        />
      </div>
      {/* Bottom Image with Screen Blend - white lines show colors through, bottom justified */}
      <div 
        className="absolute z-[2]"
        style={{
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          width: '100%'
        }}
      >
        <img 
          src={gaugeBgInvBottom} 
          alt=""
          className="w-full h-full object-cover"
          style={{
            mixBlendMode: 'screen',
            objectPosition: 'bottom center',
            display: 'block'
          }}
        />
      </div>

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
                          className="hover:text-mango transition-colors text-left"
                        >
                          {item}
                        </button>
                      </li>)}
                  </ul>
                </div>
              </div>

              {/* Image/Video Column - 40% width (2/5) */}
              <div className={`lg:col-span-2 ${service.align === 'right' ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                <div 
                  className="w-full bg-transparent rounded-sm overflow-hidden" 
                  style={{
                    height: '400px',
                    ...(service.isVideo ? { marginTop: '-2rem' } : {}),
                    ...(index === 2 && service.isVideo ? { height: '420px', marginBottom: '-1rem' } : {}) // Fix clipping on third video
                  }}
                >
                  {service.isVideo ? (
                    <div
                      style={{
                        mixBlendMode: 'screen',
                        width: '100%',
                        height: '100%',
                        position: 'relative'
                      }}
                    >
                      <video
                        ref={(el) => {
                          if (el) videoRefs.current[index] = el;
                        }}
                        src={service.image}
                        className="w-full h-full object-contain opacity-100"
                        muted
                        playsInline
                        style={{
                          filter: 'brightness(1.2) contrast(1.1)'
                        }}
                      />
                    </div>
                  ) : (
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover opacity-100" />
                  )}
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
}