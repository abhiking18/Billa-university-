import { useState, useEffect } from 'react';
import { SITE_CONFIG } from '../data/config';

interface NavbarProps {
  currentRoute: string;
  isGrayscaleBg: boolean;
  onToggleGrayscaleBg: () => void;
  onNavigate: (route: string) => void;
}

export default function Navbar({
  currentRoute,
  isGrayscaleBg,
  onToggleGrayscaleBg,
  onNavigate,
}: NavbarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { label: 'Memes', route: '#/memes' },
    { label: 'Brainrot', route: '#/brainrot' },
    { label: 'Elite Ball Knowledge', route: '#/ballknowledge' },
  ];

  const handleLinkClick = (route: string) => {
    setMobileMenuOpen(false);
    onNavigate(route);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-black/70 backdrop-blur-md border-b border-white/12 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-20 md:h-24 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark with Logo Emblem */}
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#/');
            }}
            className="group flex items-center space-x-3.5 whitespace-nowrap shrink-0 text-decoration-none"
          >
            {/* Logo Avatar Badge */}
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-white/30 group-hover:border-white transition-all shrink-0 bg-black shadow-md group-hover:scale-105">
              <img
                src={SITE_CONFIG.logoImg}
                alt="Billa University Emblem"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-display text-2xl md:text-3xl tracking-tight text-white uppercase group-hover:text-white/90 transition-colors">
              BILLA UNIVERSITY
            </span>
          </a>

          {/* Zone 2: Navigation Links with Animated Underline */}
          <nav className="hidden md:flex items-center space-x-10 text-sm font-sub tracking-wider uppercase">
            {navLinks.map((item) => {
              const active = currentRoute === item.route;
              return (
                <a
                  key={item.route}
                  href={item.route}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(item.route);
                  }}
                  className={`relative py-2 font-medium transition-colors duration-200 group ${
                    active ? 'text-white' : 'text-[#9A9A9A] hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`absolute bottom-0 left-0 h-[1.5px] bg-white transition-all duration-300 ${
                      active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Zone 3: B&W Toggle & Mobile Trigger */}
          <div className="flex items-center space-x-4 shrink-0">
            {/* Grayscale Background Toggle */}
            <button
              onClick={onToggleGrayscaleBg}
              title="Toggle Background Monochromatic Filter"
              className="flex items-center space-x-2 text-xs font-sub text-[#9A9A9A] hover:text-white px-3.5 py-1.5 border border-white/12 rounded-full transition-colors cursor-pointer"
            >
              <span className={`w-2 h-2 rounded-full ${isGrayscaleBg ? 'bg-white' : 'bg-[#9A9A9A]'}`} />
              <span className="whitespace-nowrap font-mono">{isGrayscaleBg ? 'B&W 100%' : 'B&W OFF'}</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Animated Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-all duration-500 flex flex-col justify-between p-8 pt-24 md:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col space-y-6">
          {/* Logo in Mobile Menu */}
          <div className="flex items-center space-x-3.5 pb-6 border-b border-white/12">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-white/30 shrink-0 bg-black">
              <img
                src={SITE_CONFIG.logoImg}
                alt="Billa Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-display text-2xl uppercase tracking-tight text-white block">
                BILLA UNIVERSITY
              </span>
              <span className="text-[10px] font-sub text-[#9A9A9A] tracking-widest uppercase">
                ACCREDITED ARCHIVE
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-6 font-display text-3xl uppercase tracking-wider pt-2">
            <a
              href="#/"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('#/');
              }}
              className={`transition-colors ${currentRoute === '#/' ? 'text-white' : 'text-[#9A9A9A]'}`}
            >
              Home
            </a>
            {navLinks.map((item) => (
              <a
                key={item.route}
                href={item.route}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.route);
                }}
                className={`transition-colors ${currentRoute === item.route ? 'text-white' : 'text-[#9A9A9A]'}`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-white/12 pt-6 flex justify-between items-center text-xs text-[#9A9A9A] font-sub">
          <span>BILLA UNIVERSITY ARCHIVE</span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-white uppercase tracking-wider underline cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
