import { Link } from 'react-router-dom';
import { caseStudies } from '../lib/case-studies';
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

const getLogoStyles = (title: string): { height: string; marginLeft?: string } => {
  const baseHeight = '48px'; // h-12 = 48px
  switch (title) {
    case "Behavior and Identity in Virtual Worlds":
      // Electronic Arts: reduce by 30%
      return { height: `${48 * 0.7}px` }; // 33.6px
    case "Visualizing Information Security Threat Vectors":
      // Zerowall: increase by 20% and indent 10px
      return { height: `${48 * 1.2}px`, marginLeft: '10px' }; // 57.6px
    default:
      return { height: baseHeight };
  }
};

export function CaseStudiesSection() {
  return (
    <section className="relative pt-12 pb-24 px-6 lg:px-12 bg-black border-t-[5px] border-mango border-b-[5px] border-blue">
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-4xl font-serif font-semibold text-white mb-16 text-center">
          Case Studies
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {caseStudies.map((study, index) => (
            <Link
              key={index}
              to={`/case-studies/${study.slug}`}
              className="group cursor-pointer p-6 border border-gray-700 hover:border-mango transition-all duration-300 flex flex-col h-full"
              style={{ backgroundColor: 'rgba(17, 17, 17, 0.9)', borderRadius: 'var(--radius)' }}
            >
              <div className="relative overflow-hidden mb-6 bg-gray-800" style={{
                height: '240px',
                borderRadius: 'var(--radius)'
              }}>
                <img
                  src={study.tileImage || study.image}
                  alt={study.title}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-mango opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </div>
              <div className="flex flex-col flex-1 text-center">
                {getCaseStudyLogo(study.title) && (
                  <div className="mb-4 flex justify-center">
                    <img
                      src={getCaseStudyLogo(study.title)!}
                      alt=""
                      className="w-auto"
                      style={{
                        filter: 'brightness(0) invert(1)',
                        height: getLogoStyles(study.title).height,
                        marginLeft: getLogoStyles(study.title).marginLeft || '0'
                      }}
                    />
                  </div>
                )}
                {study.category && (
                  <p className="text-sm font-sans text-gray-400 mb-2 uppercase tracking-wide">
                    {study.category}
                  </p>
                )}
                <h3 className="text-xl md:text-2xl font-serif font-semibold text-white mb-3 group-hover:text-mango transition-colors">
                  {study.title}
                </h3>
                <p className="text-base md:text-lg font-sans text-gray-400 font-light leading-relaxed flex-1">
                  {study.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}