import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { caseStudies } from '../lib/case-studies';
import gaugeBgInvTop from '../assets/gauge-bg-inv-top-1.png';
import gaugeBgInvBottom from '../assets/gauge-bg-inv-bottom-6.png';
import logoAffirm from '../assets/logo-affirm.webp';
import logoZerowall from '../assets/logo-zerowall.webp';
import logoAirbnb from '../assets/logo-airbnb.webp';
import logoEa from '../assets/logo-ea.webp';

const getCaseStudyLogo = (title: string) => {
  switch (title) {
    case "Making the Case for Internal Tools":
      return logoAffirm;
    case "Visualizing Information Security Threat Vectors":
      return logoZerowall;
    case "Validating Research Hypotheses at Scale":
      return logoAirbnb;
    case "Behavior and Identity in Virtual Worlds":
      return logoEa;
    default:
      return null;
  }
};

const getLogoStyles = (): { height: string; marginLeft?: string } => {
  // Standardized height for all logos in tiles
  return { height: '40px' };
};

export function CaseStudies() {

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-fuscia selection:text-white">
      <Header />

      <main className="relative">
        {/* Hero Section with Animated Gradient Background */}
        <section className="relative min-h-[30vh] flex items-center overflow-hidden pt-[10px]">
          {/* Animated Background with Brand Colors */}
          <div
            className="absolute inset-0 animated-gradient z-0"
            style={{
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF6B8A 25%, #D99A3D 50%, #6B5B95 75%, #66ccff 100%)',
              backgroundSize: '400% 400%',
              animation: 'gradientShift 15s ease infinite'
            }}
          />
          {/* Vignette overlay */}
          <div
            className="absolute inset-0 z-[2]"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.6) 100%)'
            }}
          />

          {/* Content */}
          <div className="relative z-[3] w-full px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-semibold text-white leading-tight !pt-3 !lg:pt-6 mb-2" style={{
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
              }}>
                Case Studies
              </h1>
              <p className="text-xl md:text-2xl font-sans text-white font-medium max-w-3xl ml-2 md:ml-4" style={{
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
              }}>
                Gauge serves as your Humans in the Loop, helping you craft a new commmon sense.
              </p>
            </div>
          </div>

          {/* Bottom Border - 5px Blue */}
          <div className="absolute bottom-0 left-0 right-0 h-[5px] bg-blue" />
        </section>

        {/* Main Content Sections */}
        <div className="relative pt-24 pb-24 overflow-hidden">
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
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 space-y-32">
            {caseStudies.map((study, index) => {
              const borderColorClass = study.color === 'fuscia' ? 'border-fuscia' :
                study.color === 'mango' ? 'border-mango' :
                  study.color === 'purple' ? 'border-purple' :
                    'border-blue';
              const textColorClass = study.color === 'fuscia' ? 'text-fuscia' :
                study.color === 'mango' ? 'text-mango' :
                  study.color === 'purple' ? 'text-purple' :
                    'text-blue';

              const bgColorRgba = study.color === 'fuscia' ? 'rgba(255, 107, 138, 0.1)' :
                study.color === 'mango' ? 'rgba(217, 154, 61, 0.1)' :
                  study.color === 'purple' ? 'rgba(107, 91, 149, 0.1)' :
                    'rgba(102, 204, 255, 0.1)';

              return (
                <section key={index} className="p-8 lg:p-12 rounded-sm group cursor-pointer" style={{
                  backgroundColor: bgColorRgba
                }}>
                  <Link
                    to={`/case-studies/${study.slug}`}
                    className="block w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'instant' });
                      setTimeout(() => {
                        window.location.href = `/case-studies/${study.slug}`;
                      }, 0);
                    }}
                  >
                    <div className="w-full">
                      {/* Image and Text on Same Row - Alternating Layout */}
                      {/* Check if this is "Making the Case for Internal Tools" (index 1) or "Behavior and Identity in Virtual Worlds" (index 3) */}
                      {/* Last two tiles (index 2 and 3) should alternate */}
                      {(() => {
                        const isRightLayout = study.title === "Making the Case for Internal Tools" || study.title === "Behavior and Identity in Virtual Worlds";
                        let flexClass = '';
                        if (isRightLayout) {
                          flexClass = '';
                        } else {
                          // For last two tiles (index 2 and 3), alternate: index 2 = normal, index 3 = reverse
                          if (index === 2 || index === 3) {
                            flexClass = index === 2 ? '' : 'flex-row-reverse';
                          } else {
                            flexClass = index % 2 === 0 ? '' : 'flex-row-reverse';
                          }
                        }

                        return (
                          <div className={`flex ${flexClass}`}>
                            {isRightLayout ? (
                              /* Right layout for specific tiles: text | image | accent */
                              <>
                                {/* Text Content - Expands to fill */}
                                <div className="flex-1 flex flex-col">
                                  {/* Header Section */}
                                  <div className="mb-0" style={{ marginTop: '0', paddingTop: '0' }}>
                                    {getCaseStudyLogo(study.title) && (
                                      <div className="mb-4 flex justify-start">
                                        <img 
                                          src={getCaseStudyLogo(study.title)!} 
                                          alt="" 
                                          className="w-auto"
                                          style={{ 
                                            filter: 'brightness(0) invert(1)',
                                            height: getLogoStyles().height,
                                            marginLeft: getLogoStyles().marginLeft || '0'
                                          }}
                                        />
                                      </div>
                                    )}
                                    {study.category && (
                                      <p className="text-sm font-sans text-gray-500 uppercase tracking-wide mb-3">
                                        {study.category}
                                      </p>
                                    )}
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-3 group-hover:text-mango transition-colors" style={{
                                      lineHeight: '1.3'
                                    }}>
                                      {study.title}
                                    </h2>
                                  </div>
                                  <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed mb-8 flex-1">
                                    {study.description}
                                  </p>

                                  {/* Applied Services */}
                                  <h3 className="text-xl font-serif font-semibold text-white mb-4">Applied Services</h3>
                                  <div className="grid grid-cols-2 gap-4">
                                    {study.services.map((service, idx) => (
                                      <div key={idx} className="text-lg md:text-xl font-sans text-gray-300 font-light flex items-start gap-3">
                                        <span className={`${textColorClass} flex-shrink-0`}>»</span>
                                        <span>{service}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Gutter between text and image - matches section padding */}
                                <div className="w-8 lg:w-12 flex-shrink-0" />

                                {/* Image */}
                                <div className="flex-shrink-0 w-56 h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 overflow-hidden rounded-sm relative"
                                  style={{ borderRadius: 'var(--radius)' }}
                                >
                                  <img
                                    src={study.tileImage || study.image}
                                    alt={study.title}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-mango opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                                </div>

                                {/* Gutter between image and accent - matches section padding */}
                                <div className="w-8 lg:w-12 flex-shrink-0" />

                                {/* Vertical Accent Line - Right side of image */}
                                <div className={`border-r-4 ${borderColorClass} flex-shrink-0`} />
                              </>
                            ) : index % 2 === 0 ? (
                              /* Left side layout (even indices): accent | image | text */
                              <>
                                {/* Vertical Accent Line - Left side */}
                                <div className={`border-l-4 ${borderColorClass} flex-shrink-0`} />

                                {/* Gutter between accent and image - matches section padding */}
                                <div className="w-8 lg:w-12 flex-shrink-0" />

                                {/* Image */}
                                <div className="flex-shrink-0 w-56 h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 overflow-hidden rounded-sm relative"
                                  style={{ borderRadius: 'var(--radius)' }}
                                >
                                  <img
                                    src={study.tileImage || study.image}
                                    alt={study.title}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-mango opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                                </div>

                                {/* Gutter between image and text - matches section padding */}
                                <div className="w-8 lg:w-12 flex-shrink-0" />

                                {/* Text Content - Expands to fill */}
                                <div className="flex-1 flex flex-col">
                                  {/* Header Section */}
                                  <div className="mb-0" style={{ marginTop: '0', paddingTop: '0' }}>
                                    {getCaseStudyLogo(study.title) && (
                                      <div className="mb-4 flex justify-start">
                                        <img 
                                          src={getCaseStudyLogo(study.title)!} 
                                          alt="" 
                                          className="w-auto"
                                          style={{ 
                                            filter: 'brightness(0) invert(1)',
                                            height: getLogoStyles().height,
                                            marginLeft: getLogoStyles().marginLeft || '0'
                                          }}
                                        />
                                      </div>
                                    )}
                                    {study.category && (
                                      <p className="text-sm font-sans text-gray-500 uppercase tracking-wide mb-3">
                                        {study.category}
                                      </p>
                                    )}
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-3 group-hover:text-mango transition-colors" style={{
                                      lineHeight: '1.3'
                                    }}>
                                      {study.title}
                                    </h2>
                                  </div>
                                  <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed mb-8 flex-1">
                                    {study.description}
                                  </p>

                                  {/* Applied Services */}
                                  <h3 className="text-xl font-serif font-semibold text-white mb-4">Applied Services</h3>
                                  <div className="grid grid-cols-2 gap-4">
                                    {study.services.map((service, idx) => (
                                      <div key={idx} className="text-lg md:text-xl font-sans text-gray-300 font-light flex items-start gap-3">
                                        <span className={`${textColorClass} flex-shrink-0`}>»</span>
                                        <span>{service}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </>
                            ) : (
                              /* Right side layout (odd indices with flex-row-reverse): accent | image | text (visual) */
                              <>
                                {/* Text Content - Expands to fill */}
                                <div className="flex-1 flex flex-col">
                                  {/* Header Section */}
                                  <div className="mb-0" style={{ marginTop: '0', paddingTop: '0' }}>
                                    {getCaseStudyLogo(study.title) && (
                                      <div className="mb-4 flex justify-start">
                                        <img 
                                          src={getCaseStudyLogo(study.title)!} 
                                          alt="" 
                                          className="w-auto"
                                          style={{ 
                                            filter: 'brightness(0) invert(1)',
                                            height: getLogoStyles().height,
                                            marginLeft: getLogoStyles().marginLeft || '0'
                                          }}
                                        />
                                      </div>
                                    )}
                                    {study.category && (
                                      <p className="text-sm font-sans text-gray-500 uppercase tracking-wide mb-3">
                                        {study.category}
                                      </p>
                                    )}
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-3 group-hover:text-mango transition-colors" style={{
                                      lineHeight: '1.3'
                                    }}>
                                      {study.title}
                                    </h2>
                                  </div>
                                  <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed mb-8 flex-1">
                                    {study.description}
                                  </p>

                                  {/* Applied Services */}
                                  <h3 className="text-xl font-serif font-semibold text-white mb-4">Applied Services</h3>
                                  <div className="grid grid-cols-2 gap-4">
                                    {study.services.map((service, idx) => (
                                      <div key={idx} className="text-lg md:text-xl font-sans text-gray-300 font-light flex items-start gap-3">
                                        <span className={`${textColorClass} flex-shrink-0`}>»</span>
                                        <span>{service}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Gutter between text and image - matches section padding */}
                                <div className="w-8 lg:w-12 flex-shrink-0" />

                                {/* Image */}
                                <div className="flex-shrink-0 w-56 h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 overflow-hidden rounded-sm relative"
                                  style={{ borderRadius: 'var(--radius)' }}
                                >
                                  <img
                                    src={study.tileImage || study.image}
                                    alt={study.title}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-mango opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                                </div>

                                {/* Gutter between image and accent - matches section padding */}
                                <div className="w-8 lg:w-12 flex-shrink-0" />

                                {/* Vertical Accent Line - Right side of image */}
                                <div className={`border-r-4 ${borderColorClass} flex-shrink-0`} />
                              </>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </Link>
                </section>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

