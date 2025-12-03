import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { ServicesGrid } from '../components/ServicesGrid';
import { TrustSection } from '../components/TrustSection';
import { CaseStudiesSection } from '../components/CaseStudiesSection';
import { DataToolsSection } from '../components/DataToolsSection';
import { BlogSection } from '../components/BlogSection';
import { Footer } from '../components/Footer';

export function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <HeroSection />
        <ServicesGrid />
        <TrustSection />
        <CaseStudiesSection />
        <DataToolsSection />
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
}