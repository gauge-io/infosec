import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CalendarEmbed } from '../components/CalendarEmbed';
import coffeeShack from '../assets/coffee-shack.jpg';

export function Coffee() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Full-bleed hero masthead */}
      <div className="w-full h-[60vh] min-h-[400px] overflow-hidden">
        <img 
          src={coffeeShack} 
          alt="Shack15 co-working space" 
          className="w-full h-full object-cover"
        />
      </div>

      <main>
        <section className="relative pt-8 pb-24 px-6 lg:px-12 bg-black">
          <div className="max-w-4xl mx-auto relative z-10">
            {/* Headlines together */}
            <div className="mb-12">
              <h1 className="text-base md:text-lg font-serif font-semibold text-white mb-4">
                OF WHICH SHIT TO SHOOT?
              </h1>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-white mb-6">
                Let's take time to make time.
              </h2>
              <p className="text-lg md:text-xl font-sans text-gray-300 font-light leading-relaxed mb-6">
                We'd love to meet you and show you what we're working on. Our spot in the Ferry Building is really special, as is the surrounding Embarcadero this time of year.
                <br /><br />
                Some potential topics we could discuss:
              </p>
              <ul className="space-y-3 text-lg md:text-xl font-sans text-gray-300 font-light leading-relaxed list-disc" style={{ paddingLeft: '3.5rem' }}>
                <li>Bridging the Gap Between Security and Usability</li>
                <li>Reducing Risk Through UX</li>
                <li>Behavioral Nudging in Security Interfaces</li>
                <li>Evolving from a CLI to a full-fledged UI</li>
                <li>Data Practices that are Understandable and Controllable</li>
              </ul>
            </div>

            {/* Google Calendar Appointment Scheduling Embed */}
            <CalendarEmbed calendarUrl="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3JYrtHwgATwHGJ9ykUla_TKt-tt3mfBGRUYIe4kNtQoOZMDl7mRmyzTaiyWOxvvGFdaqkCq3MB" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

