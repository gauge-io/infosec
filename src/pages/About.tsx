import { useEffect, useRef, useState, useCallback } from 'react';
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

// Color palette for transitions
const colors = ['#C83264', '#D99A3D', '#66ccff']; // Fuscia, Mango, Blue

// Generate arc coordinates for great circle path
function generateArcCoordinates(start: [number, number], end: [number, number], numPoints: number = 50): [number, number][] {
  const points: [number, number][] = [];
  
  // Convert to radians
  const lat1 = start[1] * Math.PI / 180;
  const lon1 = start[0] * Math.PI / 180;
  const lat2 = end[1] * Math.PI / 180;
  const lon2 = end[0] * Math.PI / 180;
  
  // Calculate great circle distance
  const d = 2 * Math.asin(Math.sqrt(
    Math.pow(Math.sin((lat2 - lat1) / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lon2 - lon1) / 2), 2)
  ));
  
  for (let i = 0; i <= numPoints; i++) {
    const f = i / numPoints;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    
    const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
    const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
    const z = A * Math.sin(lat1) + B * Math.sin(lat2);
    
    const lat = Math.atan2(z, Math.sqrt(x * x + y * y)) * 180 / Math.PI;
    const lon = Math.atan2(y, x) * 180 / Math.PI;
    
    points.push([lon, lat]);
  }
  
  return points;
}

export function About() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const packetAnimationRef = useRef<number | null>(null);
  const nodeColorAnimationRef = useRef<number | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isNightMode, setIsNightMode] = useState(true);
  const nodeElementsRef = useRef<HTMLDivElement[]>([]);
  const nodeColorIndicesRef = useRef<number[]>([]);
  const packetDataRef = useRef<Array<{ progress: number; direction: number; speed: number; arcCoords: [number, number][] }>>([]);
  const arcColorIndicesRef = useRef<number[]>([]);
  const arcColorAnimationRef = useRef<number | null>(null);
  const arcColorFrameCounterRef = useRef<number>(0);

  // Function to create markers
  const createMarkers = useCallback((isNight: boolean) => {
    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    nodeElementsRef.current = [];
    nodeColorIndicesRef.current = [];

    // Create markers for each team member
    teamMembers.forEach((member, index) => {
      // Create custom marker element with solid color that transitions
      const el = document.createElement('div');
      el.className = 'team-marker-node';
      
      // Initialize with random color from palette
      const initialColorIndex = Math.floor(Math.random() * colors.length);
      nodeColorIndicesRef.current[index] = initialColorIndex;
      
      // Minimal styling - let Mapbox handle positioning
      el.style.width = '12px';
      el.style.height = '12px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = colors[initialColorIndex];
      el.style.border = `2px solid ${isNight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)'}`;
      el.style.boxShadow = `0 0 12px ${colors[initialColorIndex]}80`;
      el.style.cursor = 'pointer';
      el.style.transition = 'background-color 2s ease, box-shadow 2s ease';
      // Don't set position, left, top, margin - let Mapbox handle it

      nodeElementsRef.current[index] = el;

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 15,
        closeButton: false,
        className: 'team-popup'
      }).setHTML(`
        <div style="padding: 8px; font-family: 'IBM Plex Sans', sans-serif;">
          <div style="font-weight: 600; color: #D99A3D; font-size: 14px; margin-bottom: 4px;">${member.role}</div>
          <div style="color: #9ca3af; font-size: 12px;">${member.location}</div>
        </div>
      `);

      // Use center anchor to ensure marker center aligns with coordinates
      const marker = new mapboxgl.Marker({ 
        element: el,
        anchor: 'center'
      })
        .setLngLat(member.coordinates as [number, number])
        .setPopup(popup)
        .addTo(map.current!);
        
      markersRef.current.push(marker);
    });

    // Animate node colors independently
    const animateNodeColors = () => {
      nodeElementsRef.current.forEach((el, index) => {
        if (!el) return;
        
        const currentIndex = nodeColorIndicesRef.current[index];
        const nextIndex = (currentIndex + 1) % colors.length;
        const nextColor = colors[nextIndex];
        
        el.style.backgroundColor = nextColor;
        el.style.boxShadow = `0 0 12px ${nextColor}80`;
        nodeColorIndicesRef.current[index] = nextIndex;
      });
      
      nodeColorAnimationRef.current = setTimeout(animateNodeColors, 2000);
    };
    
    // Start color animation
    animateNodeColors();
  }, []);

  // Function to create arcs and packets between all nodes
  const createArcsAndPackets = useCallback(() => {
    if (!map.current) return;

    // Stop existing animation
    if (packetAnimationRef.current) {
      cancelAnimationFrame(packetAnimationRef.current);
    }

    // Reset frame counter
    arcColorFrameCounterRef.current = 0;

    // Clean up existing sources and layers
    const totalArcs = (teamMembers.length * (teamMembers.length - 1)) / 2;
    for (let i = 0; i < totalArcs; i++) {
      try {
        if (map.current.getLayer(`arc-line-${i}`)) map.current.removeLayer(`arc-line-${i}`);
        if (map.current.getLayer(`packet-glow-${i}`)) map.current.removeLayer(`packet-glow-${i}`);
        if (map.current.getLayer(`packet-core-${i}`)) map.current.removeLayer(`packet-core-${i}`);
        if (map.current.getSource(`arc-${i}`)) map.current.removeSource(`arc-${i}`);
        if (map.current.getSource(`packet-${i}`)) map.current.removeSource(`packet-${i}`);
      } catch (e) {
        // Ignore errors if source/layer doesn't exist
      }
    }

    // Create arcs between nodes - reduce by half (every other connection)
    let arcIndex = 0;
    packetDataRef.current = [];
    arcColorIndicesRef.current = [];

    for (let i = 0; i < teamMembers.length; i++) {
      for (let j = i + 1; j < teamMembers.length; j++) {
        // Skip 75% of connections (only show 25% of original)
        if ((i + j) % 4 !== 0) continue;
        const start = teamMembers[i].coordinates as [number, number];
        const end = teamMembers[j].coordinates as [number, number];
        
        const arcCoords = generateArcCoordinates(start, end, 50);
        
        // Add source for arc
        const arcSourceId = `arc-${arcIndex}`;
        map.current.addSource(arcSourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: arcCoords
            }
          }
        });
        
        // Initialize arc color index
        const initialArcColorIndex = Math.floor(Math.random() * colors.length);
        arcColorIndicesRef.current[arcIndex] = initialArcColorIndex;
        
        // Add arc line layer - will be animated via color updates
        map.current.addLayer({
          id: `arc-line-${arcIndex}`,
          type: 'line',
          source: arcSourceId,
          paint: {
            'line-color': colors[initialArcColorIndex],
            'line-width': 1.5,
            'line-opacity': 0.5
          },
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          }
        });
        
        // Add source for animated packet
        const packetSourceId = `packet-${arcIndex}`;
        map.current.addSource(packetSourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: arcCoords[0]
            }
          }
        });
        
        // Add glowing packet layer
        map.current.addLayer({
          id: `packet-glow-${arcIndex}`,
          type: 'circle',
          source: packetSourceId,
          paint: {
            'circle-radius': 6,
            'circle-color': '#D99A3D',
            'circle-opacity': 0.4,
            'circle-blur': 1
          }
        });
        
        map.current.addLayer({
          id: `packet-core-${arcIndex}`,
          type: 'circle',
          source: packetSourceId,
          paint: {
            'circle-radius': 2.5,
            'circle-color': '#ffffff',
            'circle-opacity': 0.9
          }
        });

        // Store packet animation data - doubled speed
        packetDataRef.current.push({
          progress: Math.random(),
          direction: Math.random() > 0.5 ? 1 : -1,
          speed: 0.004 + Math.random() * 0.006, // Doubled from 0.002-0.005 to 0.004-0.010
          arcCoords
        });
        
        arcIndex++;
      }
    }

    // Animate packets and arc colors
    const animatePackets = () => {
      if (!map.current) return;
      
      let currentArcIndex = 0;
      
      for (let i = 0; i < teamMembers.length; i++) {
        for (let j = i + 1; j < teamMembers.length; j++) {
          // Skip 75% of connections (same logic as creation)
          if ((i + j) % 4 !== 0) continue;
          
          if (currentArcIndex >= packetDataRef.current.length) break;
          
          const packet = packetDataRef.current[currentArcIndex];
          packet.progress += packet.speed * packet.direction;
          
          // Reverse direction at ends
          if (packet.progress >= 1) {
            packet.progress = 1;
            packet.direction = -1;
          } else if (packet.progress <= 0) {
            packet.progress = 0;
            packet.direction = 1;
          }
          
          const coordIndex = Math.floor(packet.progress * (packet.arcCoords.length - 1));
          const coord = packet.arcCoords[Math.min(coordIndex, packet.arcCoords.length - 1)];
          
          const source = map.current?.getSource(`packet-${currentArcIndex}`) as mapboxgl.GeoJSONSource;
          if (source) {
            source.setData({
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: coord
              }
            });
          }
          
          currentArcIndex++;
        }
      }
      
      // Update arc colors every 120 frames (approximately every 2 seconds at 60fps)
      arcColorFrameCounterRef.current++;
      if (arcColorFrameCounterRef.current >= 120) {
        arcColorFrameCounterRef.current = 0;
        
        let colorArcIndex = 0;
        for (let i = 0; i < teamMembers.length; i++) {
          for (let j = i + 1; j < teamMembers.length; j++) {
            if ((i + j) % 2 === 0) continue;
            
            if (colorArcIndex < arcColorIndicesRef.current.length) {
              const currentColorIndex = arcColorIndicesRef.current[colorArcIndex];
              const nextColorIndex = (currentColorIndex + 1) % colors.length;
              const nextColor = colors[nextColorIndex];
              
              map.current.setPaintProperty(`arc-line-${colorArcIndex}`, 'line-color', nextColor);
              arcColorIndicesRef.current[colorArcIndex] = nextColorIndex;
            }
            
            colorArcIndex++;
          }
        }
      }
      
      packetAnimationRef.current = requestAnimationFrame(animatePackets);
    };
    
    animatePackets();
  }, []);

  // Toggle day/night mode - change entire style
  const toggleDayNight = useCallback(() => {
    if (!map.current) return;
    
    const newMode = !isNightMode;
    setIsNightMode(newMode);
    
    // Change entire map style
    const newStyle = newMode 
      ? 'mapbox://styles/mapbox/dark-v11'  // Night mode
      : 'mapbox://styles/mapbox/light-v11'; // Day mode
    
    map.current.setStyle(newStyle);
    
    // Wait for style to load, then recreate markers and arcs
    map.current.once('style.load', () => {
      if (!map.current) return;
      
      map.current.resize();
      
      // Set fog for night mode
      if (newMode) {
        map.current.setFog({
          color: 'rgb(11, 11, 25)',
          'high-color': 'rgb(20, 40, 80)',
          'horizon-blend': 0.03,
          'space-color': 'rgb(11, 11, 25)',
          'star-intensity': 0.6
        });
      }
      
      // Recreate markers with appropriate styling
      createMarkers(newMode);
      
      // Recreate arcs and packets
      createArcsAndPackets();
    });
  }, [isNightMode, createMarkers, createArcsAndPackets]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    if (!MAPBOX_TOKEN) {
      setMapError('Map requires configuration');
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Initialize map centered on US - ensure dragRotate is enabled
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-98, 39], // Center of US
      zoom: 3.5,
      projection: 'globe',
      dragRotate: true, // Enable drag to rotate
      touchZoomRotate: true,
      touchPitch: true,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');

    map.current.on('style.load', () => {
      if (!map.current) return;
      
      // Force resize to ensure proper tiling
      setTimeout(() => {
        if (map.current) {
          map.current.resize();
        }
      }, 0);
      
      // Night mode fog (default)
      map.current.setFog({
        color: 'rgb(11, 11, 25)',
        'high-color': 'rgb(20, 40, 80)',
        'horizon-blend': 0.03,
        'space-color': 'rgb(11, 11, 25)',
        'star-intensity': 0.6
      });

      // Create markers
      createMarkers(true);
      
      // Create arcs and packets
      createArcsAndPackets();
    });

    // Handle window resize
    const handleResize = () => {
      if (map.current) {
        map.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);
    
    // Multiple resize attempts to ensure proper tiling
    setTimeout(() => {
      if (map.current) {
        map.current.resize();
      }
    }, 100);
    
    setTimeout(() => {
      if (map.current) {
        map.current.resize();
      }
    }, 500);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (packetAnimationRef.current) {
        cancelAnimationFrame(packetAnimationRef.current);
      }
      if (nodeColorAnimationRef.current) {
        clearTimeout(nodeColorAnimationRef.current);
      }
      if (arcColorAnimationRef.current) {
        clearTimeout(arcColorAnimationRef.current);
      }
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      nodeElementsRef.current = [];
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [createMarkers, createArcsAndPackets]);

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
          {/* Global Team Map Section */}
          <section className="relative border-b-[5px] border-b-purple overflow-hidden" style={{ backgroundColor: 'rgb(11, 11, 25)' }}>
            {/* Map Container */}
            <div 
              ref={mapContainer}
              style={{ width: '100%', height: '600px', position: 'relative' }}
            />
            
            {/* Day/Night Toggle Button */}
            <button
              onClick={toggleDayNight}
              className="absolute top-[10px] right-[50px] z-10 flex items-center justify-center"
              style={{
                width: '29px',
                height: '29px',
                backgroundColor: '#000000',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
              title={isNightMode ? 'Switch to Day' : 'Switch to Night'}
            >
              {isNightMode ? (
                // Sun icon for switching to day
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                // Moon icon for switching to night
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
            
            {mapError && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgb(11, 11, 25)' }}>
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
