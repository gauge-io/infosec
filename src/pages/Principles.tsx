import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import doubleDiamonds from '../assets/double-diamonds.svg';
import gaugeBgInvTop from '../assets/gauge-bg-inv-top-1.png';
import gaugeBgInvBottom from '../assets/gauge-bg-inv-bottom-6.png';
import outcome1 from '../assets/outcome-1.png';
import outcome2 from '../assets/outcome-2.png';
import outcome3 from '../assets/outcome-3.png';
import outcome4 from '../assets/outcome-4.png';
import outcome5 from '../assets/outcome5.png';
import outcome6 from '../assets/outcome-6.png';
import outcome7 from '../assets/outcome-7.png';
import outcome8 from '../assets/outcome-8.png';
import outcome9 from '../assets/outcome-9.png';
import outcome10 from '../assets/outcome-10.png';

export function Principles() {
  const userExperienceOutcomes = [
    {
      title: "Reduced Abandonment",
      description: "Complicated checkout processes with unexpected steps increase cart abandonment rates, directly affecting sales.",
      icon: outcome1
    },
    {
      title: "Higher User Engagement",
      description: "Engaging content may be overlooked if users struggle to navigate. Poor UX leads to fewer clicks and interactions.",
      icon: outcome2
    },
    {
      title: "Increased Conversions",
      description: "When users face confusing interfaces or encounter errors, they're less likely to complete their intended actions.",
      icon: outcome3
    },
    {
      title: "Lower Bounce Rates",
      description: "Poorly designed experiences cause users to leave immediately after arriving, resulting in higher bounce rates.",
      icon: outcome4
    }
  ];

  const developmentOutcomes = [
    {
      title: "Faster Engineering Velocity",
      description: "Don't keep development teams waiting for clarity. Design reusable components to minimize code and improve legibility.",
      icon: outcome5
    },
    {
      title: "More Accurate Costing",
      description: "Apply validated design and information architecture to illustrate prioritization and function in product requirements.",
      icon: outcome6
    },
    {
      title: "Improved Time-to-Market",
      description: "Clearly define product requirements and avoid costly redesigns. Design enables efficient development cycles.",
      icon: outcome7
    },
    {
      title: "Clearer Planning Stages",
      description: "Plan for development impact by quickly iterating concepts. Put prototypes in front of users to validate needs.",
      icon: outcome8
    }
  ];

  const organizationalOutcomes = [
    {
      title: "Minimized Support Calls",
      description: "When users have difficulty accomplishing goals, support requests increase, indicating usability or clarity issues.",
      icon: outcome9
    },
    {
      title: "Greater Team Alignment",
      description: "Involve stakeholders across functions in research, reducing misunderstandings and streamlining decision-making.",
      icon: outcome10
    },
    {
      title: "Better Stakeholder Buy-in",
      description: "Present clear, validated design concepts to stakeholders, making it easier to secure approval and move forward.",
      icon: outcome1
    },
    {
      title: "Reduced Rework Costs",
      description: "Identify usability issues early in design, avoiding expensive post-launch fixes that drain resources and delay timelines.",
      icon: outcome2
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-fuscia selection:text-white">
      <Header />
      
      <main className="relative">
        {/* Hero Section with Animated Gradient Background */}
        <section className="relative min-h-[60vh] flex items-center overflow-hidden">
          {/* Animated Background with Brand Colors */}
          <div 
            className="absolute inset-0 animated-gradient z-0"
            style={{
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF6B8A 25%, #D99A3D 50%, #6B5B95 75%, #66ccff 100%)',
              backgroundSize: '400% 400%',
              animation: 'gradientShift 15s ease infinite'
            }}
          />
          {/* Black Oval Vignette - between gradient and diagram */}
          <div 
            className="absolute inset-0 z-[1] pointer-events-none" 
            style={{
              background: 'radial-gradient(ellipse 80% 60% at center, transparent 30%, rgba(0,0,0,0.3) 100%)'
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
              <h1 className="text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-semibold text-white leading-tight pt-20 lg:pt-28" style={{
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
              }}>
                Our Principles
              </h1>
              
              {/* SVG - Center Aligned */}
              <div className="flex justify-center">
                <img 
                  src={doubleDiamonds} 
                  alt="Double Diamond Design Process"
                  className="w-full h-auto"
                />
              </div>

              {/* Attribution Text */}
              <div className="text-center pb-8">
                <p className="text-xs text-gray-400">
                  Double Diamond User Centric Design process, courtesy of the{' '}
                  <a 
                    href="https://www.designcouncil.org.uk/our-resources/the-double-diamond/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white underline"
                  >
                    British Design Council
                  </a>
                  {' '}– 2005
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Border - 5px Salmon */}
          <div className="absolute bottom-0 left-0 right-0 h-[5px] bg-salmon" />
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
              {/* Section 1: User Experience - Left Aligned */}
              <section>
                  <div className="w-full flex justify-start">
                      <div className="w-full lg:w-[75%]">
                          <div className="border-l-4 border-fuscia pl-8 mb-12">
                              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                                  User Experience
                              </h2>
                              <p className="text-xl text-gray-300 font-light max-w-3xl">
                                De-risk your application launch by focusing on user-centered design principles that drive engagement and conversion.
                              </p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {userExperienceOutcomes.map((item, idx) => (
                                  <div key={idx} className="bg-white/5 p-8 rounded-sm border-t-2 border-white/10">
                                      <div className="mb-6">
                                          <img 
                                              src={item.icon} 
                                              alt={item.title}
                                              className="w-16 h-16 object-contain"
                                          />
                                      </div>
                                      <h3 className="text-2xl font-serif font-semibold text-white mb-4">{item.title}</h3>
                                      <p className="text-gray-300 leading-relaxed font-medium text-xl">{item.description}</p>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </section>

              {/* Section 2: Development & Engineering - Right Aligned */}
              <section>
                  <div className="w-full flex justify-end">
                      <div className="w-full lg:w-[75%]">
                          <div className="border-l-4 border-mango pl-8 mb-12">
                              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                                  Development & Engineering
                              </h2>
                              <p className="text-xl text-gray-300 font-light max-w-3xl">
                                Streamline your development lifecycle and align your team with clear, validated design requirements.
                              </p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {developmentOutcomes.map((item, idx) => (
                                  <div key={idx} className="bg-white/5 p-8 rounded-sm border-t-2 border-white/10">
                                      <div className="mb-6">
                                          <img 
                                              src={item.icon} 
                                              alt={item.title}
                                              className="w-16 h-16 object-contain"
                                          />
                                      </div>
                                      <h3 className="text-2xl font-serif font-semibold text-white mb-4">{item.title}</h3>
                                      <p className="text-gray-300 leading-relaxed font-medium text-xl">{item.description}</p>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </section>

              {/* Section 3: Organizational & Business - Left Aligned */}
              <section>
                  <div className="w-full flex justify-start">
                      <div className="w-full lg:w-[75%]">
                          <div className="border-l-4 border-blue pl-8 mb-12">
                              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                                  Organizational & Business
                              </h2>
                              <p className="text-xl text-gray-300 font-light max-w-3xl">
                                Build stronger teams and reduce operational overhead through better alignment and clearer communication.
                              </p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {organizationalOutcomes.map((item, idx) => (
                                  <div key={idx} className="bg-white/5 p-8 rounded-sm border-t-2 border-white/10">
                                      <div className="mb-6">
                                          <img 
                                              src={item.icon} 
                                              alt={item.title}
                                              className="w-16 h-16 object-contain"
                                          />
                                      </div>
                                      <h3 className="text-2xl font-serif font-semibold text-white mb-4">{item.title}</h3>
                                      <p className="text-gray-300 leading-relaxed font-medium text-xl">{item.description}</p>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

