import { Shield, DollarSign, Server } from 'lucide-react';
const industries = [{
  title: 'Information Security',
  description: 'Threat analysis and security research',
  icon: Shield
}, {
  title: 'Financial Services',
  description: 'Fintech and banking solutions',
  icon: DollarSign
}, {
  title: 'Developer Operations',
  description: 'DevOps and infrastructure research',
  icon: Server
}];
export function CTASection() {
  return <section className="py-8 px-6 lg:px-12 bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {industries.map((industry, index) => {
          const Icon = industry.icon;
          return <div key={index} className="border border-gray-700 rounded-sm p-8 hover:border-mango transition-colors cursor-pointer text-center">
                <div className="flex justify-center mb-4">
                  <Icon className="w-12 h-12 text-mango" />
                </div>
                <h3 className="text-xl md:text-2xl font-serif font-semibold text-white mb-2">
                  {industry.title}
                </h3>
                <p className="text-base font-sans text-gray-400 font-light">
                  {industry.description}
                </p>
              </div>;
        })}
        </div>
      </div>
    </section>;
}