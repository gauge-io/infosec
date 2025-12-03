import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { PodcastCalendarEmbed } from '../components/PodcastCalendarEmbed';
import { BlogSection } from '../components/BlogSection';
import talksVideo from '../assets/Nick Cawthon _ Talks Supercut.mp4';
import podcastThumbnail from '../assets/podcast-thumbnail.png';

export function Podcast() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Full-bleed video masthead */}
      <div className="w-full h-[60vh] min-h-[400px] overflow-hidden bg-black">
        <video 
          src={talksVideo}
          poster={podcastThumbnail}
          controls
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      <main>
        <section className="relative pt-8 pb-24 px-6 lg:px-12 bg-black">
          <div className="max-w-4xl mx-auto relative z-10">
            {/* Headlines together */}
            <div className="mb-12">
              <h1 className="text-base md:text-lg font-serif font-semibold text-white mb-4">
                PODCAST INTRO MEETING
              </h1>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-white mb-6">
                Let's talk about talking.
              </h2>
              <p className="text-lg md:text-xl font-sans text-gray-300 font-light leading-relaxed mb-6">
                We would love to meet you, and work together on a discussion outline that your followers will find engaging and relevant. Some potential topics we could discuss:
              </p>
              <ul className="space-y-3 text-lg md:text-xl font-sans text-gray-300 font-light leading-relaxed list-disc" style={{ paddingLeft: '3.5rem' }}>
                <li>Bridging the Gap Between Security and Usability</li>
                <li>Reducing Risk Through UX</li>
                <li>Behavioral Nudging in Security Interface</li>
                <li>UX for Developer-Focused Security Tools</li>
                <li>Data Practices that are Understandable and Controllable</li>
              </ul>
            </div>

            {/* Podcast Calendar Appointment Scheduling */}
            <PodcastCalendarEmbed calendarUrl="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3JYrtHwgATwHGJ9ykUla_TKt-tt3mfBGRUYIe4kNtQoOZMDl7mRmyzTaiyWOxvvGFdaqkCq3MB" />
          </div>
        </section>

        {/* Articles & Insights Section */}
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
}
