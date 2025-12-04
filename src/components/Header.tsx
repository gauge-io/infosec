import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const getLink = (hash: string) => isHome ? hash : `/${hash}`;

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black shadow-sm shadow-black/20">
      <div className="border-b-[5px] border-mango">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <div className="flex justify-between items-center">
            <a
              href="/"
              onClick={handleLogoClick}
              className="font-mono text-white text-lg md:text-xl font-semibold hover:!text-mango transition-colors cursor-pointer"
            >
              [ gauge ]
            </a>
            <nav className="hidden md:flex gap-8 text-lg md:text-xl font-sans">
              <Link
                to="/principles"
                className="text-white hover:!text-mango transition-colors"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                principles
              </Link>
              <Link
                to="/insights"
                className="text-white hover:!text-mango transition-colors"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                insights
              </Link>
              <Link
                to="/case-studies"
                className="text-white hover:!text-mango transition-colors"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                case studies
              </Link>
              <Link
                to="/about"
                className="text-white hover:!text-mango transition-colors"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                about
              </Link>
              <a
                href={getLink("#contact")}
                className="text-white hover:!text-mango transition-colors"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                contact
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
