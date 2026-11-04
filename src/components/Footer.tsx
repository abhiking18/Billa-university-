import { SITE_CONFIG } from '../data/config';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-auto border-t border-white/12 bg-black/90 backdrop-blur-md relative z-20 select-none">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3.5">
          <div className="w-7 h-7 rounded-full overflow-hidden border border-white/20 bg-black shrink-0">
            <img
              src={SITE_CONFIG.logoImg}
              alt="Billa Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="font-sub text-xs md:text-sm uppercase tracking-wider text-[#9A9A9A]">
            Made by Mriganka.001
          </p>
        </div>

        <div className="flex items-center space-x-8 text-xs font-sub uppercase tracking-widest text-[#9A9A9A]">
          <span className="hidden sm:inline">MONOCHROME ARCHIVE</span>
          <button
            onClick={scrollToTop}
            className="text-white hover:text-white/80 transition-colors flex items-center space-x-1.5 cursor-pointer uppercase tracking-widest"
          >
            <span>Back to top</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
