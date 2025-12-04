import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Coffee } from './pages/Coffee';
import { Podcast } from './pages/Podcast';
import { Principles } from './pages/Principles';
import { Insights } from './pages/Insights';
import { CaseStudies } from './pages/CaseStudies';
import { CaseStudyDetail } from './pages/CaseStudyDetail';
import { BlogPostDetail } from './pages/BlogPostDetail';
import { BlogTagPage } from './pages/BlogTagPage';
import { DesignSystem } from './pages/DesignSystem';
import { About } from './pages/About';
import { ServiceSliderProvider } from './contexts/ServiceSliderContext';
import { ChatSliderProvider } from './contexts/ChatSliderContext';
import { ChatSlider } from './components/ChatSlider';

function App() {
  return (
    <ChatSliderProvider>
      <ServiceSliderProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/coffee" element={<Coffee />} />
            <Route path="/podcast" element={<Podcast />} />
            <Route path="/principles" element={<Principles />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
            <Route path="/blog/:slug" element={<BlogPostDetail />} />
            <Route path="/blog/tag/:tag" element={<BlogTagPage />} />
            <Route path="/design-system" element={<DesignSystem />} />
            <Route path="/about" element={<About />} />
          </Routes>
          <ChatSlider />
        </BrowserRouter>
      </ServiceSliderProvider>
    </ChatSliderProvider>
  );
}

export default App
