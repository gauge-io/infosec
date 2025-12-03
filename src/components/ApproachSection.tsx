export function ApproachSection() {
  return <section className="py-24 px-6 lg:px-12 bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8">
              Our Approach
            </h2>
            <div className="space-y-6 text-base md:text-lg font-sans text-gray-300 font-light leading-relaxed">
              <p>
                Great user experiences don't happen by accident. They emerge
                from deep understanding of user needs, rigorous research
                methodologies, and thoughtful design decisions that balance
                business goals with human behavior.
              </p>
              <p>
                We combine qualitative and quantitative research methods to
                build a comprehensive picture of your users. From ethnographic
                studies to data analytics, we uncover insights that drive
                meaningful product decisions.
              </p>
              <p>
                Our work spans the entire product lifecycle—from early discovery
                and strategy through design, prototyping, and validation. We
                help you build products that users genuinely want to use.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="border-l-2 border-salmon pl-6">
              <h3 className="text-xl font-serif font-semibold text-white mb-3">
                Research-Driven Insights
              </h3>
              <p className="text-base font-sans text-gray-400 font-light">
                We go beyond surface-level feedback to understand the deeper
                motivations, contexts, and behaviors that shape how people
                interact with your product.
              </p>
            </div>

            <div className="border-l-2 border-salmon pl-6">
              <h3 className="text-xl font-serif font-semibold text-white mb-3">
                Strategic Design Thinking
              </h3>
              <p className="text-base font-sans text-gray-400 font-light">
                Every design decision is grounded in user needs and business
                objectives. We create experiences that are both delightful and
                effective.
              </p>
            </div>

            <div className="border-l-2 border-salmon pl-6">
              <h3 className="text-xl font-serif font-semibold text-white mb-3">
                Collaborative Partnership
              </h3>
              <p className="text-base font-sans text-gray-400 font-light">
                We work closely with your team to build internal UX capability
                and ensure insights translate into actionable improvements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>;
}