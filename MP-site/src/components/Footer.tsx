import React from 'react';
export function Footer() {
  return <footer className="py-16 px-6 lg:px-12 bg-black border-t-[5px] border-gauge-coral-2">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div>
            <h3 className="text-xl md:text-2xl font-serif font-semibold text-white mb-6">
              Gauge.io
            </h3>
            <p className="text-base md:text-lg font-sans text-gray-400">
              © 2023 Gauge.io. All rights reserved.
            </p>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-serif font-semibold text-white mb-6">
              Research
            </h3>
            <ul className="space-y-3 text-base md:text-lg font-sans text-gray-400">
              <li>
                <a href="#" className="hover:text-gauge-coral-2 transition-colors">
                  Specialty Recruitment
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gauge-coral-2 transition-colors">
                  Applied Ethnography
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gauge-coral-2 transition-colors">
                  Mixed Methods Studies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gauge-coral-2 transition-colors">
                  Survey Design and Programming
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-serif font-semibold text-white mb-6">
              Strategy
            </h3>
            <ul className="space-y-3 text-base md:text-lg font-sans text-gray-400">
              <li>
                <a href="#" className="hover:text-gauge-coral-2 transition-colors">
                  Experience Mapping
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gauge-coral-2 transition-colors">
                  Audience Segmentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gauge-coral-2 transition-colors">
                  Persona Development
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gauge-coral-2 transition-colors">
                  Community Growth and Advocacy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-serif font-semibold text-white mb-6">
              Design
            </h3>
            <ul className="space-y-3 text-base md:text-lg font-sans text-gray-400">
              <li>
                <a href="#" className="hover:text-gauge-coral-2 transition-colors">
                  Heuristic UX Assessment
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gauge-coral-2 transition-colors">
                  Information Architecture
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gauge-coral-2 transition-colors">
                  Interaction Design and Prototyping
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gauge-coral-2 transition-colors">
                  Data Visualization
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-base md:text-lg font-sans text-gray-400">
              <a href="mailto:hello@gauge.io" className="text-gauge-coral-2 hover:underline">
                hello@gauge.io
              </a>
              <span>|</span>
              <a href="tel:5105605472" className="hover:text-white transition-colors">
                510 560 5472
              </a>
            </div>
            <div className="flex gap-6 text-base md:text-lg font-sans text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>;
}