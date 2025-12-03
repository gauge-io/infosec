import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { DataToolsSection } from '../components/DataToolsSection';
import { getCaseStudyBySlug, caseStudies } from '../lib/case-studies';
import gaugeBgInvTop from '../assets/gauge-bg-inv-top-1.png';
import gaugeBgInvBottom from '../assets/gauge-bg-inv-bottom-6.png';
import logoAffirm from '../assets/logo-affirm.webp';
import logoZerowall from '../assets/logo-zerowall.webp';
import logoAirbnb from '../assets/logo-airbnb.webp';
import logoEa from '../assets/logo-ea.webp';

export function CaseStudyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const study = slug ? getCaseStudyBySlug(slug) : undefined;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get logo for case study
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

  const getLogoStylesForTiles = (): { height: string; marginLeft?: string } => {
    // Standardized height for all logos in tiles
    return { height: '40px' };
  };

  const caseStudyLogo = study ? getCaseStudyLogo(study.title) : null;

  // Collect all images for the carousel
  const allImages = study ? [
    ...(study.modalImages?.map(img => ({
      src: img.src,
      caption: img.caption || study.title
    })) || []),
    // Only include content section images for specific case studies, and exclude certain sections
    ...(study.contentSections?.filter(s => {
      if (!s.image) return false;
      // Exclude content section images for Internal Tools (Discreet and Direct, Mapping a Shared Journey)
      if (study.title === "Making the Case for Internal Tools") {
        return false;
      }
      // For Threat Vectors, only include Humanising Risk but with custom caption
      if (study.title === "Visualizing Information Security Threat Vectors") {
        return s.title === "Humanising Risk";
      }
      return true;
    }).map(s => ({
      src: s.image!,
      caption: s.title === "Humanising Risk" && study.title === "Visualizing Information Security Threat Vectors"
        ? "These were all based on a custom designed and programmed CISO survey, collecting over a hundred variables for analysis."
        : (s.title || '')
    })) || [])
  ] : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // Scroll to top when component mounts or slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  // ESC key to close modal
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevImage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, nextImage, prevImage]);

  if (!study) {
    return (
      <div className="min-h-screen bg-black text-white font-sans">
        <Header />
        <main className="pt-24 pb-24 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-serif mb-6">Case Study Not Found</h1>
            <Link
              to="/case-studies"
              className="text-mango hover:text-mango/80 transition-colors"
            >
              ← Back to Case Studies
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const textColorClass = study.color === 'fuscia' ? 'text-fuscia' :
    study.color === 'mango' ? 'text-mango' :
      study.color === 'purple' ? 'text-purple' :
        'text-blue';
  const bgColorClass = study.color === 'fuscia' ? 'bg-fuscia' :
    study.color === 'mango' ? 'bg-mango' :
      study.color === 'purple' ? 'bg-purple' :
        'bg-blue';

  const openModal = (imageSrc: string) => {
    const index = allImages.findIndex(img => img.src === imageSrc);
    if (index !== -1) {
      setCurrentImageIndex(index);
      setIsModalOpen(true);
    } else if (allImages.length > 0) {
      // If image not found, use first image in carousel
      setCurrentImageIndex(0);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-fuscia selection:text-white">
      <Header />



      <main className="relative">
        {/* Simple Hero Section */}
        <section className={`relative pt-32 pb-12 px-6 lg:px-12 border-b-[5px] overflow-hidden ${study.title === "Making the Case for Internal Tools" ? 'border-purple' : study.color === 'purple' ? 'border-purple' : study.color === 'fuscia' ? 'border-fuscia' : study.color === 'mango' ? 'border-mango' : 'border-blue'}`}>
          {/* Case Study Background Image */}
          {study.backgroundImage && (
            <div 
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url(${study.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'grayscale(100%) opacity(0.3)',
                width: '100%',
                height: '100%'
              }}
            />
          )}
          {/* Black Fill Layer */}
          <div 
            className="absolute inset-0 z-[1]"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)'
            }}
          />
          <div className="relative z-10 max-w-7xl mx-auto">


            {/* Category Label */}
            {study.category && (
              <div className="mb-6">
                <span className="text-sm font-sans font-semibold uppercase tracking-wider text-gray-400">
                  Case Study : {study.category}
                </span>
              </div>
            )}

            {/* Title */}
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold text-white leading-tight mb-16 max-w-5xl">
                {study.title}
              </h1>
            </div>

            {/* Stats - Hide for Visualizing Threat Vectors, Internal Tools, Validating, and Behavior as they move to content */}
            {study.stats && study.stats.length > 0 && study.title !== "Visualizing Information Security Threat Vectors" && study.title !== "Making the Case for Internal Tools" && study.title !== "Validating Research Hypotheses at Scale" && study.title !== "Behavior and Identity in Virtual Worlds" && (
              <div className="flex flex-wrap gap-12 md:gap-16 mb-12">
                {study.stats.map((stat, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span 
                      className={`bigNumber bigNumber-value !font-serif ${textColorClass}`}
                      style={{ 
                        fontSize: '6em !important',
                        lineHeight: '1 !important',
                        display: 'block !important',
                        fontWeight: 'normal !important'
                      } as React.CSSProperties}
                    >
                      {stat.value}
                    </span>
                    <span 
                      className="bigNumber bigNumber-label !text-sm !md:text-base !font-sans !text-gray-300 !mt-1"
                      style={{ 
                        fontWeight: '800 !important',
                        display: 'block !important'
                      } as React.CSSProperties}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Intro Description */}
            <div className="max-w-4xl">
              {study.title === "Behavior and Identity in Virtual Worlds" && study.intro ? (
                <>
                  <p className="text-2xl md:text-3xl font-sans text-gray-300 leading-relaxed mb-6">
                    Despite a global pandemic where logistics were near impossible, mere conversations and simple interactions fraught with fear – Gauge forged ahead and executed a wide-ranging mixed methods research project focused around appearance and creativity in the metaverse of a virtual world.
                  </p>
                  <p className="text-2xl md:text-3xl font-sans text-gray-300 leading-relaxed mb-12">
                    This research spanned across seven different countries, was authored in five languages with over six thousand participants in the corresponding quantitative survey. With dozens of stakeholders and vendors in play at any given time, juggling these kinds of logistics and operations on a global basis took a deft sense of tact.
                  </p>
                </>
              ) : study.title === "Validating Research Hypotheses at Scale" && study.intro ? (
                <>
                  <p className="text-2xl md:text-3xl font-sans text-gray-300 leading-relaxed mb-6">
                    One of the most joyous aspects of living and working in the San Francisco Bay Area is being surrounded by innovative companies that have innovation baked into their DNA. This goes from the top, all the way down to the trenches of these organizations. Airbnb was no exception.
                  </p>
                  <p className="text-2xl md:text-3xl font-sans text-gray-300 leading-relaxed mb-12">
                    Airbnb was seeing stagnation on one of their product lines and their internal research team was tasked with uncovering what some of the focus areas for quantitate research should have been. Using public reviews, as well as their provided rating-scales, Gauge was able to help Airbnb uncover what made for a positive stay in this product line.
                  </p>
                </>
              ) : (
                <p className="text-2xl md:text-3xl font-sans text-gray-300 leading-relaxed mb-12">
                  {study.intro || study.description}
                </p>
              )}
              
              {/* Additional paragraph for Internal Tools */}
              {study.title === "Making the Case for Internal Tools" && (
                <p className="text-2xl md:text-3xl font-sans text-gray-300 leading-relaxed mb-12">
                  Your employees are your most valuable asset, protecting their sanctity by investing in them is the most important priority your organization faces. Too often, keeping employees materially satisfied by offering trivial perks is how organizations define their culture. Investing in the research and development of improving internal software tools and processes often falls way down the list.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="relative pt-20 pb-24 overflow-hidden">
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
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
            {/* Advisory Services Section - Hide for Visualizing Threat Vectors, Internal Tools, Validating, and Behavior */}
            {study.advisoryServices && study.advisoryServices.length > 0 && study.title !== "Visualizing Information Security Threat Vectors" && study.title !== "Making the Case for Internal Tools" && study.title !== "Validating Research Hypotheses at Scale" && study.title !== "Behavior and Identity in Virtual Worlds" && (
              <section className="mb-32">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-12">
                  Advisory Services
                </h2>
                <div className="space-y-16">
                  {study.advisoryServices.map((service, idx) => (
                    <div key={idx} className="max-w-4xl">
                      <h3 className={`text-2xl md:text-3xl font-serif font-semibold ${textColorClass} mb-4`}>
                        {service.title}
                      </h3>
                      <p className="text-lg md:text-xl font-sans text-gray-300 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Content Sections with Alternating Layout */}
            {study.contentSections && study.contentSections.map((section, idx) => {
              // Check for specific sections to apply special layout
              const specialSections = [
                "Platform for Collaboration",
                "Built to Fail, Fast",
                "Staying Agnostic",
                "Confidence in Communication",
                "Being Behind the Lines",
                "Understanding of Complex Workflows",
                "Empathy for Difficult Roles",
                "Discreet and Direct",
                "Unique to B2B Environments",
                "Mapping a Shared Journey",
                "Segmentation and Sentiment",
                "The Case for Puppies",
                "Generative Topic Modeling",
                "Democratizing Research",
                "Sowing Seeds of Creativity",
                "Different Sides of the Mirror",
                "Ethical Ethnography",
                "Adopting an Agile Medium",
                "Finding the Flow",
                "Detecting Fraud",
                "Delineating Differences"
              ];
              const isSpecial = section.title && specialSections.includes(section.title);

              // Determine image position: Alternating Left, Right, Left, Right for special sections
              // "Left" means Image on Left.
              let isImageLeft = section.imagePosition === 'left';
              let hasImage = !!section.image;

              // Special handling for Internal Tools: from "Empathy for Difficult Roles" onward, alternate (reversed)
              if (study.title === "Making the Case for Internal Tools") {
                const empathyIndex = study.contentSections?.findIndex(s => s.title === "Empathy for Difficult Roles") ?? -1;
                if (empathyIndex >= 0 && idx >= empathyIndex) {
                  // Start alternating from "Empathy for Difficult Roles": right (idx 2), left (idx 3), right (idx 4)...
                  isImageLeft = (idx - empathyIndex) % 2 === 1;
                  hasImage = true;
                } else if (isSpecial) {
                  const specialIndex = specialSections.indexOf(section.title!);
                  isImageLeft = specialIndex % 2 === 0;
                  hasImage = true; // Force image for special sections
                }
              } else if (study.title === "Validating Research Hypotheses at Scale" || study.title === "Behavior and Identity in Virtual Worlds") {
                // For Validating and Behavior: first section has Big Numbers on right, rest alternate with accent lines
                if (idx === 0) {
                  // First section: Big Numbers on right (content on left)
                  isImageLeft = false;
                  hasImage = true;
                } else if (isSpecial) {
                  // Rest of sections: alternate with accent lines
                  const specialIndex = specialSections.indexOf(section.title!);
                  isImageLeft = specialIndex % 2 === 0;
                  hasImage = true; // Force image for special sections
                }
              } else if (isSpecial) {
                const specialIndex = specialSections.indexOf(section.title!);
                isImageLeft = specialIndex % 2 === 0;
                hasImage = true; // Force image for special sections
              }

              // Handle pullQuote type
              if (section.type === 'pullQuote') {
                const content = section.content;
                const openingEllipsisIndex = content.indexOf('...');
                const closingEllipsisIndex = content.lastIndexOf('...');
                
                // Split content to insert quotes at ellipses
                const parts = [];
                if (openingEllipsisIndex >= 0) {
                  parts.push(content.substring(0, openingEllipsisIndex));
                  parts.push('...OPEN_QUOTE...');
                  if (closingEllipsisIndex >= 0 && closingEllipsisIndex !== openingEllipsisIndex) {
                    parts.push(content.substring(openingEllipsisIndex + 3, closingEllipsisIndex));
                    parts.push('...CLOSE_QUOTE...');
                    parts.push(content.substring(closingEllipsisIndex + 3));
                  } else {
                    parts.push(content.substring(openingEllipsisIndex + 3));
                  }
                } else {
                  parts.push(content);
                }
                
                return (
                  <section key={idx} className="mb-24 md:mb-32">
                    <div className="max-w-7xl mx-auto text-center relative">
                      <blockquote className="relative py-12">
                        <p 
                          className="font-serif italic text-white relative"
                          style={{
                            fontSize: '3.5rem',
                            fontWeight: '300',
                            lineHeight: '1.5',
                            margin: '0',
                            padding: '0',
                            position: 'relative',
                            zIndex: 1
                          }}
                        >
                          {parts.map((part, partIdx) => {
                            if (part === '...OPEN_QUOTE...') {
                              return (
                                <span key={partIdx} className="relative inline-block">
                                  <span 
                                    className={`${textColorClass} font-serif absolute`}
                                    style={{
                                      fontSize: '6rem',
                                      fontWeight: '700',
                                      lineHeight: '1',
                                      zIndex: 10,
                                      left: '-0.8em',
                                      top: '0',
                                      pointerEvents: 'none'
                                    }}
                                  >
                                    {"\u201C"}
                                  </span>
                                  ...
                                </span>
                              );
                            } else if (part === '...CLOSE_QUOTE...') {
                              return (
                                <span key={partIdx} className="relative inline-block">
                                  ...
                                  <span 
                                    className={`${textColorClass} font-serif absolute`}
                                    style={{
                                      fontSize: '6rem',
                                      fontWeight: '700',
                                      lineHeight: '1',
                                      zIndex: 10,
                                      right: '-0.8em',
                                      top: '0',
                                      pointerEvents: 'none'
                                    }}
                                  >
                                    {"\u201D"}
                                  </span>
                                </span>
                              );
                            }
                            return <span key={partIdx}>{part}</span>;
                          })}
                        </p>
                      </blockquote>
                    </div>
                  </section>
                );
              }

              // Use thumbnail from modalImages if available, otherwise use section.image or study.image
              // First try to find modal image by index, then try to match by thumbnail
              let modalImage = study.modalImages?.[idx];
              if (!modalImage && section.image) {
                // Try to find modal image that matches the section's thumbnail
                modalImage = study.modalImages?.find(img => img.thumbnail === section.image);
              }
              const displayImage = modalImage?.thumbnail || section.image || study.image;
              const fullImageForModal = modalImage?.src || section.image || study.image;

              // Get the first section title for each case study to place logo
              // Logo placement logic
              const logoPlacements: { [key: string]: string } = {
                "Making the Case for Internal Tools": "Understanding of Complex Workflows",
                "Visualizing Information Security Threat Vectors": "Humanising Risk",
                "Validating Research Hypotheses at Scale": "Segmentation and Sentiment",
                "Behavior and Identity in Virtual Worlds": "Sowing Seeds of Creativity"
              };
              const shouldShowLogo = section.title === logoPlacements[study.title];
              
              // Logo sizing and styling
              const getLogoStyles = (title: string) => {
                const baseStyles: React.CSSProperties = { filter: 'brightness(0) invert(1)' }; // 100% white
                let marginLeft = '-10px';
                let height = 'h-24'; // 96px base
                
                switch (title) {
                  case "Making the Case for Internal Tools":
                    marginLeft = '-50px'; // -30px - 20px = -50px
                    height = 'h-[115px]'; // 96px * 1.2 = 115.2px
                    break;
                  case "Visualizing Information Security Threat Vectors":
                    height = 'h-48'; // 96px * 2 = 192px (twice as big)
                    break;
                  case "Validating Research Hypotheses at Scale":
                    height = 'h-[115px]'; // 96px * 1.2 = 115.2px
                    break;
                  case "Behavior and Identity in Virtual Worlds":
                    height = 'h-[62px]'; // 77px * 0.8 = 61.6px (20% smaller width)
                    break;
                }
                return { marginLeft, height, ...baseStyles };
              };

              const logoStyles = shouldShowLogo && caseStudyLogo ? getLogoStyles(study.title) : null;

              return (
                <section key={idx} className="mb-24 md:mb-32">
                  {/* Logo for specified section of each case study */}
                  {shouldShowLogo && caseStudyLogo && logoStyles && (
                    <div className="mb-8" style={{ marginLeft: logoStyles.marginLeft }}>
                      <img 
                        src={caseStudyLogo} 
                        alt="" 
                        className={`${logoStyles.height} w-auto`} 
                        style={{ filter: logoStyles.filter as string }} 
                      />
                    </div>
                  )}
                  <div className={`flex flex-col ${hasImage ? 'lg:flex-row' : ''} gap-8 lg:gap-16 items-start`}>
                    {/* Image on Left */}
                    {hasImage && isImageLeft && (
                      <div className={`w-full ${(study.title === "Visualizing Information Security Threat Vectors" || study.title === "Making the Case for Internal Tools" || study.title === "Validating Research Hypotheses at Scale" || study.title === "Behavior and Identity in Virtual Worlds") ? 'lg:w-1/3' : 'lg:w-1/2'} flex-shrink-0 order-1 flex`}>
                        {/* Accent Line for Special Sections */}
                        {isSpecial && (
                          <>
                            <div className={`border-l-4 ${bgColorClass.replace('bg-', 'border-')} flex-shrink-0 mr-8`} />
                          </>
                        )}
                        {/* Special handling for Understanding of Complex Workflows to show stats */}
                        {study.title === "Making the Case for Internal Tools" && section.title === "Understanding of Complex Workflows" && study.stats ? (
                          <div className="flex flex-col gap-6 h-full justify-start items-start w-full">
                            {study.stats.map((stat, sIdx) => (
                              <div
                                key={sIdx}
                                className={`${bgColorClass} rounded-md flex flex-col justify-center items-center text-center`}
                                style={{
                                  padding: '1.5rem 2rem !important',
                                  width: 'fit-content',
                                  minWidth: '200px',
                                  aspectRatio: '1'
                                } as React.CSSProperties}
                              >
                                <span
                                  className="bigNumber bigNumber-value !text-white !font-serif !leading-none"
                                  style={{
                                    fontSize: '6em !important',
                                    marginBottom: '0.75rem !important',
                                    lineHeight: '1 !important',
                                    display: 'block !important',
                                    color: 'white !important',
                                    fontFamily: 'var(--font-serif) !important',
                                    fontWeight: '600 !important'
                                  } as React.CSSProperties}
                                >
                                  {stat.value}
                                </span>
                                <span
                                  className="bigNumber bigNumber-label !text-white/90 !font-sans !whitespace-normal !leading-tight !text-center"
                                  style={{
                                    fontSize: '1rem !important',
                                    fontWeight: '800 !important',
                                    maxWidth: '20ch',
                                    fontFamily: 'inherit !important',
                                    display: 'block !important',
                                    color: 'rgba(255, 255, 255, 0.9) !important'
                                  } as React.CSSProperties}
                                >
                                  {stat.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className={`relative w-full ${(study.title === "Visualizing Information Security Threat Vectors" || study.title === "Making the Case for Internal Tools" || study.title === "Validating Research Hypotheses at Scale" || study.title === "Behavior and Identity in Virtual Worlds") ? 'aspect-square' : 'aspect-[4/3] lg:aspect-[3/4]'} rounded-sm group cursor-pointer p-4`}
                            onClick={() => fullImageForModal && openModal(fullImageForModal)}>
                            {(study.title === "Visualizing Information Security Threat Vectors" || study.title === "Making the Case for Internal Tools" || study.title === "Validating Research Hypotheses at Scale" || study.title === "Behavior and Identity in Virtual Worlds") && idx > 0 && !isSpecial ? (
                              <div className="w-full h-full bg-gray-800 flex items-center justify-center rounded-sm">
                                <span className="text-gray-500">Placeholder</span>
                              </div>
                            ) : (
                              <div className="relative w-full h-full overflow-hidden rounded-sm">
                                <img
                                  src={displayImage}
                                  alt={section.title || ''}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content */}
                    <div className={`flex-1 ${hasImage && !isImageLeft ? `${(study.title === "Visualizing Information Security Threat Vectors" || study.title === "Making the Case for Internal Tools" || study.title === "Validating Research Hypotheses at Scale" || study.title === "Behavior and Identity in Virtual Worlds") ? 'lg:w-2/3' : 'lg:w-1/2'} order-1` : ''} ${hasImage && isImageLeft ? 'order-2' : ''}`}>
                      {section.title && (
                        <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                          {section.title}
                        </h3>
                      )}
                      {/* Special content for Understanding of Complex Workflows - header and paragraph in same row as Big Numbers */}
                      {study.title === "Making the Case for Internal Tools" && section.title === "Understanding of Complex Workflows" ? (
                        <>
                          <div className="prose prose-invert max-w-none">
                            <p className="text-lg md:text-xl lg:text-2xl font-sans text-gray-300 leading-relaxed mb-6">
                              An organization oftentimes remains complacent in the technology stack which was relied upon during their initial period of growth. Despite the oft-repeated overtures of digital transformation, it tends to be a singular effort, not a continual one. The phrase 'embrace the grind' for an organization typically translates into resigning yourself to the friction of cumbersome repetitive tasks – ones that are often due to archaic internal tools.
                            </p>
                            <p className="text-lg md:text-xl lg:text-2xl font-sans text-gray-300 leading-relaxed mb-6">
                              Gauge advocates for the employees who bear these inefficient burdens that build up workday after workday. Gauge helps keep alive the question of 'why isn't there a better way', making sure it does not become forgotten, despite the burnout and turnover that has wreaked havoc before it. We want your employees to be your organization's best advocates, not the biggest detractors.
                            </p>
                            <h4 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4 mt-8">
                              Preventing Employee Attrition
                            </h4>
                            <p className="text-lg md:text-xl lg:text-2xl font-sans text-gray-300 leading-relaxed mb-6">
                              Gauge has researched, strategized and designed different systematic workflows around role-based access, auditing and permissions for organizations within Financial Services, Developer Operations and Cybersecurity organizations. We have helped ensure that these organizations remain in compliance, take forward-thinking practices, and enable an environment with transparency and accountability at its core.
                            </p>
                            <p className="text-lg md:text-xl lg:text-2xl font-sans text-gray-300 leading-relaxed mb-6">
                              Errant actions can impact many, with a mistaken approval or deletion taking down a system or service – wiping weeks of employee productivity off the books. Through a thorough understanding of how to improve a team's workflow, Gauge can help them stay productive.
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="prose prose-invert max-w-none">
                          {section.content.split('\n\n').map((paragraph, pIdx) => (
                            <p key={pIdx} className="text-lg md:text-xl lg:text-2xl font-sans text-gray-300 leading-relaxed mb-6">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Image on Right */}
                    {hasImage && !isImageLeft && (
                      <div className={`w-full ${(study.title === "Visualizing Information Security Threat Vectors" || study.title === "Making the Case for Internal Tools" || study.title === "Validating Research Hypotheses at Scale" || study.title === "Behavior and Identity in Virtual Worlds") ? 'lg:w-1/3' : 'lg:w-1/2'} flex-shrink-0 order-2 flex`}>
                        {/* Special handling for Visualizing Threat Vectors, Internal Tools, Validating, and Behavior first section to show stats */}
                        {(study.title === "Visualizing Information Security Threat Vectors" || study.title === "Making the Case for Internal Tools" || study.title === "Validating Research Hypotheses at Scale" || study.title === "Behavior and Identity in Virtual Worlds") && idx === 0 && study.stats ? (
                          <div className="flex flex-col gap-6 h-full justify-start items-end w-full">
                            {study.stats.map((stat, sIdx) => (
                              <div
                                key={sIdx}
                                className={`${bgColorClass} rounded-md flex flex-col justify-center items-center text-center`}
                                style={{
                                  padding: '1.5rem 2rem !important',
                                  width: 'fit-content',
                                  minWidth: '200px',
                                  aspectRatio: '1'
                                } as React.CSSProperties}
                              >
                                <span
                                  className="bigNumber bigNumber-value !text-white !font-serif !leading-none"
                                  style={{
                                    fontSize: '6em !important',
                                    marginBottom: '0.75rem !important',
                                    lineHeight: '1 !important',
                                    display: 'block !important',
                                    color: 'white !important',
                                    fontFamily: 'var(--font-serif) !important',
                                    fontWeight: '600 !important'
                                  } as React.CSSProperties}
                                >
                                  {stat.value}
                                </span>
                                <span
                                  className="bigNumber bigNumber-label !text-white/90 !font-sans !whitespace-normal !leading-tight !text-center"
                                  style={{
                                    fontSize: '1rem !important',
                                    fontWeight: '800 !important',
                                    maxWidth: '20ch',
                                    fontFamily: 'inherit !important',
                                    display: 'block !important',
                                    color: 'rgba(255, 255, 255, 0.9) !important'
                                  } as React.CSSProperties}
                                >
                                  {stat.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex w-full">
                            <div className={`relative w-full ${(study.title === "Visualizing Information Security Threat Vectors" || study.title === "Making the Case for Internal Tools" || study.title === "Validating Research Hypotheses at Scale" || study.title === "Behavior and Identity in Virtual Worlds") ? 'aspect-square' : 'aspect-[4/3] lg:aspect-[3/4]'} rounded-sm group cursor-pointer p-4`}
                              onClick={() => displayImage && openModal(displayImage)}>
                              {(study.title === "Visualizing Information Security Threat Vectors" || study.title === "Making the Case for Internal Tools" || study.title === "Validating Research Hypotheses at Scale" || study.title === "Behavior and Identity in Virtual Worlds") && !isSpecial ? (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center rounded-sm">
                                  <span className="text-gray-500">Placeholder</span>
                                </div>
                              ) : (
                                <div className="relative w-full h-full overflow-hidden rounded-sm">
                                  <img
                                    src={displayImage}
                                    alt={section.title || ''}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </div>
                              )}
                            </div>
                            {/* Accent Line for Special Sections */}
                            {isSpecial && (
                              <div className={`border-r-4 ${bgColorClass.replace('bg-', 'border-')} flex-shrink-0 ml-8`} />
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              );
            })}

            {/* Fallback: Show basic info if no content sections */}
            {(!study.contentSections || study.contentSections.length === 0) && (
              <section className="mb-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div>
                    <img
                      src={study.image}
                      alt={study.title}
                      className="w-full h-auto rounded-sm"
                    />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                      {study.title}
                    </h2>
                    <p className="text-lg md:text-xl font-sans text-gray-300 leading-relaxed mb-8">
                      {study.description}
                    </p>

                    <div>
                      <h3 className="text-xl font-serif font-semibold text-white mb-4">Applied Services</h3>
                      <div className="space-y-3">
                        {study.services.map((service, idx) => (
                          <div key={idx} className="text-lg font-sans text-gray-300 flex items-start gap-3">
                            <span className={`${textColorClass} flex-shrink-0`}>»</span>
                            <span>{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>

      </main>

      {/* Image Modal - Center Aligned */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
          <div className="relative max-w-6xl w-full bg-black border border-gray-800 rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center gap-4 flex-1">
                {caseStudyLogo && (
                  <img 
                    src={caseStudyLogo} 
                    alt="" 
                    className={
                      study.title === "Visualizing Information Security Threat Vectors" ? "h-[58px] w-auto" : 
                      study.title === "Validating Research Hypotheses at Scale" ? "h-[60px] w-auto" : 
                      "h-12 w-auto"
                    } 
                    style={{ marginLeft: '-10px', filter: 'brightness(0) invert(1)' }} 
                  />
                )}
                <div className="flex items-center gap-3">
                  <span className="text-lg md:text-xl font-serif text-white">
                    {study.title}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm font-sans text-gray-400">
                    {currentImageIndex + 1} of {allImages.length}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="flex items-center justify-center p-8 bg-black">
              <div className="max-w-full flex flex-col items-center">
                <img
                  src={allImages[currentImageIndex].src}
                  alt={allImages[currentImageIndex].caption}
                  className="max-w-full max-h-[60vh] object-contain mb-6"
                />
                {allImages[currentImageIndex].caption && (
                  <p className="text-white text-xl md:text-2xl font-serif text-center">
                    {allImages[currentImageIndex].caption}
                  </p>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between p-6 border-t border-gray-800">
              <button
                onClick={prevImage}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-sans">Previous</span>
              </button>

              {/* Dots indicator */}
              <div className="flex gap-2">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex
                      ? 'bg-mango w-8'
                      : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextImage}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                aria-label="Next image"
              >
                <span className="font-sans">Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Additional Case Studies Section */}
      <section className="pt-12 pb-12 px-6 lg:px-12 border-t-[5px] border-purple" style={{ backgroundColor: '#0d1520' }}>
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-white mb-12">
            Additional Case Studies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {caseStudies
              .filter(s => s.slug !== study.slug)
              .slice(0, 3)
              .map((otherStudy, idx) => (
                <Link
                  key={idx}
                  to={`/case-studies/${otherStudy.slug}`}
                  className="group block border border-gray-700 rounded-lg overflow-hidden hover:border-mango transition-colors h-full flex flex-col"
                  style={{ backgroundColor: 'rgba(17, 17, 17, 0.9)' }}
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'instant' });
                    setTimeout(() => {
                      window.location.href = `/case-studies/${otherStudy.slug}`;
                    }, 0);
                  }}
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-gray-900 p-[10px]">
                    <img
                      src={otherStudy.tileImage || otherStudy.image}
                      alt={otherStudy.title}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:brightness-110 rounded-sm"
                    />
                  </div>
                  <div className="p-8 flex flex-col flex-1 items-center">
                    {getCaseStudyLogo(otherStudy.title) && (
                      <div className="mb-4 flex justify-center">
                        <img 
                          src={getCaseStudyLogo(otherStudy.title)!} 
                          alt="" 
                          className="w-auto"
                          style={{ 
                            filter: 'brightness(0) invert(1)',
                            height: getLogoStylesForTiles().height,
                            marginLeft: getLogoStylesForTiles().marginLeft || '0'
                          }}
                        />
                      </div>
                    )}
                    {otherStudy.category && (
                      <p className="text-sm font-sans text-gray-500 uppercase tracking-wide mb-2 w-full text-center">
                        {otherStudy.category}
                      </p>
                    )}
                    <h3 className="text-xl font-serif font-semibold text-white group-hover:text-mango transition-colors mb-4">
                      {otherStudy.title}
                    </h3>
                    <p className="text-base font-sans text-gray-400 font-light leading-relaxed mb-4 flex-grow">
                      {otherStudy.description}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Gauge Does More with Data Section */}
      <DataToolsSection showTopBorder={true} />

      <Footer />
    </div >
  );
}
