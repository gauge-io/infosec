import { useEffect, useRef, useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox access token
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_KEY;

// Team member data with coordinates
const teamMembers = [
  // US Team
  { role: 'Research Director', location: 'San Francisco, California', coordinates: [-122.4194, 37.7749], country: 'US' },
  { role: 'Product Designer', location: 'Pleasantville, Iowa', coordinates: [-93.2774, 41.3867], country: 'US' },
  { role: 'Product Designer', location: 'Oklahoma City, Oklahoma', coordinates: [-97.5164, 35.4676], country: 'US' },
  { role: 'Research Operations', location: 'Arcata, California', coordinates: [-124.0828, 40.8665], country: 'US' },
  { role: 'Project Management', location: 'Fayetteville, North Carolina', coordinates: [-78.8784, 35.0527], country: 'US' },
  { role: 'Ethnographer', location: 'New York, New York', coordinates: [-74.0060, 40.7128], country: 'US' },
  { role: 'Brand Strategist', location: 'Cape Cod, Massachusetts', coordinates: [-70.2962, 41.6688], country: 'US' },
  { role: 'Data Scientist', location: 'Redwood City, California', coordinates: [-122.2363, 37.4852], country: 'US' },
  { role: 'Data Scientist', location: 'Berkeley, California', coordinates: [-122.2727, 37.8716], country: 'US' },
  { role: 'Qualitative Researcher', location: 'Rochester, New York', coordinates: [-77.6109, 43.1566], country: 'US' },
  { role: 'Mixed Methods Researcher', location: 'Ann Arbor, Michigan', coordinates: [-83.7430, 42.2808], country: 'US' },
  // Global Team
  { role: 'Qualitative Researcher', location: 'Vancouver, British Columbia', coordinates: [-123.1207, 49.2827], country: 'CA' },
  { role: 'Front-End Developer', location: 'Kyiv, Ukraine', coordinates: [30.5234, 50.4501], country: 'UA' },
  { role: 'Integration Engineer', location: 'Hanoi, Vietnam', coordinates: [105.8342, 21.0278], country: 'VN' },
  { role: 'Qualtrics Developer', location: 'Galway, Ireland', coordinates: [-9.0568, 53.2707], country: 'IE' },
  { role: 'Visualization Engineer', location: 'Gujarat, India', coordinates: [71.1924, 22.2587], country: 'IN' },
  { role: 'Marketing Operations', location: 'Skopje, Macedonia', coordinates: [21.4314, 41.9973], country: 'MK' },
  { role: 'Illustrator', location: 'London, England', coordinates: [-0.1276, 51.5074], country: 'GB' },
];

export function About() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    if (!MAPBOX_TOKEN) {
      setMapError('Map requires configuration');
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-40, 35],
      zoom: 1.8,
      projection: 'globe',
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('style.load', () => {
      if (!map.current) return;
      
      // Ensure map fills container
      map.current.resize();
      
      // Set fog for globe effect - space-color matches container background
      map.current.setFog({
        color: 'rgb(11, 11, 25)',
        'high-color': 'rgb(20, 40, 80)',
        'horizon-blend': 0.03,
        'space-color': 'rgb(11, 11, 25)',
        'star-intensity': 0.5
      });

      // Add markers for each team member - simple markers first
      teamMembers.forEach((member) => {
        const markerColor = member.country === 'US' ? '#D99A3D' : '#66ccff';
        
        // Create simple marker dot
        const el = document.createElement('div');
        el.style.width = '14px';
        el.style.height = '14px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = markerColor;
        el.style.border = '2px solid white';
        el.style.boxShadow = `0 0 8px ${markerColor}`;
        el.style.cursor = 'pointer';

        // Create popup
        const popup = new mapboxgl.Popup({
          offset: 15,
          closeButton: false,
          className: 'team-popup'
        }).setHTML(`
          <div style="padding: 8px; font-family: 'IBM Plex Sans', sans-serif;">
            <div style="font-weight: 600; color: ${markerColor}; font-size: 14px; margin-bottom: 4px;">${member.role}</div>
            <div style="color: #9ca3af; font-size: 12px;">${member.location}</div>
          </div>
        `);

        // Add simple marker - default anchor is center
        new mapboxgl.Marker({ element: el })
          .setLngLat(member.coordinates as [number, number])
          .setPopup(popup)
          .addTo(map.current!);
      });
    });

    // Handle window resize
    const handleResize = () => {
      if (map.current) {
        map.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);
    
    // Delayed resize to ensure container is fully rendered
    setTimeout(() => {
      if (map.current) {
        map.current.resize();
      }
    }, 100);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-fuscia selection:text-white">
      <Header />
      
      <main className="relative">
        {/* Hero Section - Standardized */}
        <section className="relative pt-48 pb-32 px-6 lg:px-12 text-center" style={{ backgroundColor: '#0d1520' }}>
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-semibold tracking-tight mb-10 text-white">
              About Us
            </h1>
            <p className="text-2xl md:text-3xl text-white/80 font-light leading-relaxed max-w-4xl mx-auto">
              Gauge is a consultancy of designers, engineers, ethnographers and data scientists; dedicated as a group to help you find clear causality from within the wisdom of crowds.
            </p>
          </div>
          {/* Fuscia Bottom Border */}
          <div className="absolute bottom-0 left-0 right-0 h-[5px] bg-fuscia" />
        </section>

        {/* Main Content */}
        <div className="bg-black">
          {/* Global Team Map Section - Now first */}
          <section className="border-b-[5px] border-b-purple" style={{ backgroundColor: 'rgb(11, 11, 25)' }}>
            {/* Map Container */}
            <div 
              ref={mapContainer}
              style={{ width: '100%', height: '600px' }}
            />
            {mapError && (
              <div className="flex items-center justify-center" style={{ height: '600px', backgroundColor: 'rgb(11, 11, 25)', marginTop: '-600px' }}>
                <div className="text-center">
                  <div className="text-6xl mb-4">🌍</div>
                  <p className="text-gray-400 text-lg">{mapError}</p>
                  <p className="text-gray-500 text-sm mt-2">Team members across {teamMembers.length} locations worldwide</p>
                </div>
              </div>
            )}
          </section>

          {/* The Advantage of Small - Left Aligned */}
          <section className="py-24 px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="w-full flex justify-start">
                <div className="w-full lg:w-[75%]">
                  <div className="border-l-4 border-mango pl-8">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8">
                      The Advantage of Small
                    </h2>
                    <div className="space-y-6">
                      <p className="text-2xl md:text-3xl font-sans text-gray-300 leading-relaxed">
                        Gauge is able to draw on years of comprehensive international user and consumer research resources across several different industries. We rarely take on more than two or three clients simultaneously, as each project requires personal attention and oftentimes – a unique set deliverables for each. Our priority is making sure you succeed.
                      </p>
                      <p className="text-2xl md:text-3xl font-sans text-gray-300 leading-relaxed">
                        Our assembled international teams have hands-on experience running complex mixed methods research projects all around the world. We rarely have more than two or three projects running simultaneously. Small but mighty. Young but hungry. Smart enough to know better, but still stupid enough to do it anyways. Let's innovate together.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Company History - Right Aligned */}
          <section className="py-24 px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="w-full flex justify-end">
                <div className="w-full lg:w-[75%]">
                  <div className="border-l-4 border-blue pl-8">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8">
                      Our Company Story
                    </h2>
                    <div className="space-y-6">
                      <p className="text-2xl md:text-3xl font-sans text-gray-300 leading-relaxed">
                        Since 2016, each and every project have challenged us in different ways; unique to the client and contextual to the questions we are trying to answer. There are no standard approaches nor deliverables. We tailor our process and deliverables to specifically address the problems we're trying to solve. Gauge is certified both as a Small Business and a Disability-Owned Business Enterprise.
                      </p>
                      <p className="text-2xl md:text-3xl font-sans text-gray-300 leading-relaxed">
                        Gauge typically works with the Product, Research and/or Design Leads at data-centric companies. We help them better understand their product positioning through large-scale research, design and strategy efforts. We maintain a lively, trusting culture of individuals from all over the world, each of whom dedicate themselves to a shared notion of craft.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
