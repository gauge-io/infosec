import logoAdobe from '../assets/logo-adobe.webp';
import logoNewRelic from '../assets/logo-new-relic.webp';
import logoNpm from '../assets/logo-npm.webp';
import logoAffirm from '../assets/logo-affirm.webp';
import logoSumoLogic from '../assets/logo-sumo-logic.webp';

const clientLogos = [
  { src: logoAdobe, alt: 'Adobe' },
  { src: logoNewRelic, alt: 'New Relic' },
  { src: logoNpm, alt: 'npm' },
  { src: logoAffirm, alt: 'Affirm' },
  { src: logoSumoLogic, alt: 'Sumo Logic' }
];

export function TrustSection() {
  return <section className="relative pt-12 pb-24 px-6 lg:px-12 bg-gauge-coral">
      {/* Black Oval Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
      background: 'radial-gradient(ellipse 80% 60% at center, transparent 30%, rgba(0,0,0,0.3) 100%)'
    }} />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-serif font-semibold text-white mb-12 opacity-90" style={{
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
      }}>
          Innovative Clients Choose Gauge
        </h2>
        <div className="flex flex-wrap lg:flex-nowrap gap-0 items-center justify-center">
          {clientLogos.map((logo, index) => (
            <div key={index} className="w-full lg:w-auto lg:flex-1 max-w-[300px] flex items-center justify-center p-6">
              <img src={logo.src} alt={logo.alt} className="w-full h-auto object-contain max-h-24 brightness-0 invert" />
            </div>
          ))}
        </div>
      </div>
    </section>;
}