import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { MEMES_DATA } from '../data/config';

interface HomePageProps {
  onNavigate: (route: string) => void;
  onOpenMemeLightbox: (id: number) => void;
}

export default function HomePage({ onNavigate, onOpenMemeLightbox }: HomePageProps) {
  const trendingSwiperRef = useRef<HTMLDivElement>(null);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Initialize Trending Swiper Carousel (compact mini-card tray style)
    let swiperInstance: Swiper | null = null;
    if (trendingSwiperRef.current) {
      swiperInstance = new Swiper(trendingSwiperRef.current, {
        modules: [Navigation, Pagination, Autoplay],
        slidesPerView: 3.1,
        spaceBetween: 8,
        centeredSlides: false,
        grabCursor: true,
        autoplay: {
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        navigation: {
          nextEl: '#trending-next-btn',
          prevEl: '#trending-prev-btn',
        },
        pagination: {
          el: '#trending-pagination',
          clickable: true,
        },
        breakpoints: {
          375: { slidesPerView: 3.3, spaceBetween: 8 },
          480: { slidesPerView: 4.2, spaceBetween: 10 },
          640: { slidesPerView: 5.0, spaceBetween: 12 },
          1024: { slidesPerView: 6.2, spaceBetween: 14 },
        },
      });
    }

    // 2. Scroll effect for the Marquee reversing direction
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (marqueeTrackRef.current) {
        marqueeTrackRef.current.style.transform = `translateX(-${(scrollY * 0.45) % 1200}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (swiperInstance) swiperInstance.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* ==================================================
          1. HERO SECTION (Full Viewport, Spacious, Awwwards Grade)
          ================================================== */}
      <section className="min-h-[88vh] md:min-h-[94vh] max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col justify-between py-12 md:py-20 select-none">
        {/* Top subtle sector badges */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-between items-start pt-4 text-xs md:text-sm font-sub tracking-[0.25em] text-[#9A9A9A] uppercase"
        >
          <span>SEMESTER 2026</span>
          <span>HIGH-CONSEQUENCE ARCHIVE</span>
        </motion.div>

        {/* Hero Headline and One-Line Lead */}
        <div className="my-auto py-10 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <h1 className="font-display text-[clamp(60px,13vw,210px)] leading-[0.86] tracking-tight text-white uppercase select-none">
              BILLA UNIVERSITY
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-sub text-lg md:text-2xl text-[#9A9A9A] mt-6 max-w-2xl font-semibold tracking-tight"
          >
            Memes. Brainrot. Ball knowledge.
          </motion.p>

          {/* Large Luxury Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex flex-wrap gap-5 items-center"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('#/memes')}
              data-cursor="Open"
              className="btn-luxury-primary h-16 md:h-20 px-10 md:px-12 rounded-full font-sub font-semibold text-lg md:text-xl tracking-wide space-x-3 group"
            >
              <span className="relative z-10">Memes</span>
              <svg
                className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('#/brainrot')}
              data-cursor="Explore"
              className="btn-luxury-secondary h-16 md:h-20 px-10 md:px-12 rounded-full font-sub font-semibold text-lg md:text-xl tracking-wide space-x-3 group"
            >
              <span className="relative z-10">Explore</span>
              <svg
                className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex items-center justify-between border-t border-white/12 pt-6"
        >
          <span className="text-xs font-sub uppercase tracking-[0.25em] text-[#9A9A9A]">
            Curated archive sectors
          </span>
          <div className="flex items-center space-x-2 text-xs font-sub uppercase tracking-widest text-[#9A9A9A]">
            <span>Scroll</span>
            <div className="w-4 h-8 border border-white/30 rounded-full flex justify-center p-1">
              <div className="w-1 h-2 bg-white rounded-full animate-bounce" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ==================================================
          2. HUGE OUTLINED MARQUEE (Direction reverses on scroll)
          ================================================== */}
      <section className="py-12 md:py-16 border-y border-white/12 bg-black/50 overflow-hidden select-none">
        <div
          ref={marqueeTrackRef}
          className="flex whitespace-nowrap will-change-transform font-display text-6xl md:text-8xl lg:text-9xl uppercase tracking-tighter"
        >
          <span className="marquee-outline-text mx-8">MEMES • BRAINROT • BALL KNOWLEDGE •</span>
          <span className="marquee-outline-text mx-8">MEMES • BRAINROT • BALL KNOWLEDGE •</span>
          <span className="marquee-outline-text mx-8">MEMES • BRAINROT • BALL KNOWLEDGE •</span>
          <span className="marquee-outline-text mx-8">MEMES • BRAINROT • BALL KNOWLEDGE •</span>
        </div>
      </section>

      {/* ==================================================
          3. THREE LARGE FEATURE PANELS (All images directly clickable)
          ================================================== */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-24 md:py-36 space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/12 pb-8 gap-4">
          <div>
            <span className="text-xs font-sub uppercase tracking-[0.25em] text-[#9A9A9A] block mb-2">
              ACADEMIC DIVISIONS
            </span>
            <h2 className="font-display text-5xl md:text-7xl uppercase text-white tracking-tight">
              CORE DOMAINS
            </h2>
          </div>
          <p className="font-sub text-[#9A9A9A] text-base md:text-lg max-w-md">
            Rigorous peer-reviewed internet phenomena.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel 1: Memes */}
          <motion.div
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group relative bg-[#111111] hover:bg-[#1A1A1A] border border-white/12 hover:border-white/35 rounded-3xl p-8 md:p-10 flex flex-col justify-between transition-all duration-500 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_25px_50px_rgba(255,255,255,0.08)]"
          >
            <div className="shimmer-line" />
            <div>
              <div className="flex justify-between items-center text-xs font-sub text-[#9A9A9A] tracking-widest uppercase mb-8">
                <span>SECTOR 01</span>
                <span>12+ SPECIMENS</span>
              </div>
              <div
                onClick={() => onOpenMemeLightbox(1)}
                data-cursor="Inspect"
                className="aspect-[4/3] rounded-2xl overflow-hidden mb-8 bg-black border border-white/5 relative cursor-pointer group/img"
              >
                <img
                  src="/assets/aistudio/IMG_20261104_150301_747_32ecd421.jpg"
                  alt="Memes Sector Preview"
                  className="w-full h-full object-cover meme-media-vibrant"
                />
                <span className="absolute bottom-3 right-3 bg-black/75 px-3 py-1 rounded-full text-[10px] font-sub uppercase tracking-wider text-white border border-white/10 opacity-0 group-hover/img:opacity-100 transition-opacity">
                  Click to Inspect
                </span>
              </div>
              <h3
                onClick={() => onNavigate('#/memes')}
                className="font-display text-4xl md:text-5xl uppercase tracking-tight text-white mb-3 hover:text-white/80 cursor-pointer"
              >
                MEMES
              </h3>
              <p className="font-sub text-base text-[#9A9A9A]">Certified productivity killers.</p>
            </div>
            <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => onNavigate('#/memes')}
                className="inline-flex items-center text-sm font-sub uppercase tracking-wider text-white group-hover:translate-x-1.5 transition-transform font-semibold cursor-pointer"
              >
                Enter Archive
              </button>
              <button
                onClick={() => onNavigate('#/memes')}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Panel 2: Brainrot */}
          <motion.div
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group relative bg-[#111111] hover:bg-[#1A1A1A] border border-white/12 hover:border-white/35 rounded-3xl p-8 md:p-10 flex flex-col justify-between transition-all duration-500 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_25px_50px_rgba(255,255,255,0.08)]"
          >
            <div className="shimmer-line" />
            <div>
              <div className="flex justify-between items-center text-xs font-sub text-[#9A9A9A] tracking-widest uppercase mb-8">
                <span>SECTOR 02</span>
                <span>SYNAPSE DECAY</span>
              </div>
              <div
                onClick={() => onOpenMemeLightbox(4)}
                data-cursor="Inspect"
                className="aspect-[4/3] rounded-2xl overflow-hidden mb-8 bg-black border border-white/5 relative cursor-pointer group/img"
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_WvyUao5uMWdATFFVwNK3EwrVpMSa_3gVzvOLc0N1Z9W04Lx5ah9m7sX0jE3PsBeL8SWBcJr5JrV20tlPOP6HDZhL21BqgrKRQw_cpBR_tBv3Cd3KpZDxEfIZoC1BSTsJIWfHnYJEU4A80cry-fFnBe9I8sY-l9NSnC0RWZSckIRQLZcpLcGlXYLVy2NSvdlffkLsD-KcmQnHchOwBSWF3cS9s4wn2U25dIxGxm2-CPl1cP4u-Fym"
                  alt="Brainrot Sector Preview"
                  className="w-full h-full object-cover meme-media-vibrant"
                />
                <span className="absolute bottom-3 right-3 bg-black/75 px-3 py-1 rounded-full text-[10px] font-sub uppercase tracking-wider text-white border border-white/10 opacity-0 group-hover/img:opacity-100 transition-opacity">
                  Click to Inspect
                </span>
              </div>
              <h3
                onClick={() => onNavigate('#/brainrot')}
                className="font-display text-4xl md:text-5xl uppercase tracking-tight text-white mb-3 hover:text-white/80 cursor-pointer"
              >
                BRAINROT
              </h3>
              <p className="font-sub text-base text-[#9A9A9A]">Your brain cells left the chat.</p>
            </div>
            <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => onNavigate('#/brainrot')}
                className="inline-flex items-center text-sm font-sub uppercase tracking-wider text-white group-hover:translate-x-1.5 transition-transform font-semibold cursor-pointer"
              >
                Enter Chamber
              </button>
              <button
                onClick={() => onNavigate('#/brainrot')}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Panel 3: Elite Ball Knowledge */}
          <motion.div
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group relative bg-[#111111] hover:bg-[#1A1A1A] border border-white/12 hover:border-white/35 rounded-3xl p-8 md:p-10 flex flex-col justify-between transition-all duration-500 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_25px_50px_rgba(255,255,255,0.08)]"
          >
            <div className="shimmer-line" />
            <div>
              <div className="flex justify-between items-center text-xs font-sub text-[#9A9A9A] tracking-widest uppercase mb-8">
                <span>SECTOR 03</span>
                <span>10 ROUND TEST</span>
              </div>
              <div
                onClick={() => onOpenMemeLightbox(3)}
                data-cursor="Inspect"
                className="aspect-[4/3] rounded-2xl overflow-hidden mb-8 bg-black border border-white/5 relative cursor-pointer group/img"
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuVj0GCktf2RjmAj-gLM56vyapIMbwBV6qA-6bfiiU-Z9res6i6PqHcOxmmWua97JXYz6pvpaVj2ROrzIToCs62YaNOzzYxCzYrgglN8b5P2_Jj-Z0e8xgVWNnLSfHTBatubaThSF7A-Z0laa560w2YNsucdL_gTS8VO7nT7NkZxqf_mu6ieIU4lrIbSaq7O0tF_2GaAxlrfHUjE4828O6wDpDCNmqUT26Vt6Bb6qXowv96VVi5skk"
                  alt="Elite Ball Knowledge Sector Preview"
                  className="w-full h-full object-cover meme-media-vibrant"
                />
                <span className="absolute bottom-3 right-3 bg-black/75 px-3 py-1 rounded-full text-[10px] font-sub uppercase tracking-wider text-white border border-white/10 opacity-0 group-hover/img:opacity-100 transition-opacity">
                  Click to Inspect
                </span>
              </div>
              <h3
                onClick={() => onNavigate('#/ballknowledge')}
                className="font-display text-4xl md:text-5xl uppercase tracking-tight text-white mb-3 hover:text-white/80 cursor-pointer"
              >
                ELITE BALL KNOWLEDGE
              </h3>
              <p className="font-sub text-base text-[#9A9A9A]">Only real ones know.</p>
            </div>
            <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => onNavigate('#/ballknowledge')}
                className="inline-flex items-center text-sm font-sub uppercase tracking-wider text-white group-hover:translate-x-1.5 transition-transform font-semibold cursor-pointer"
              >
                Start Examination
              </button>
              <button
                onClick={() => onNavigate('#/ballknowledge')}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================================================
          4. TRENDING SLIDER (Ultra Compact Mini-Card Tray)
          ================================================== */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-10 md:py-16 border-t border-white/12 select-none">
        <div className="flex items-center justify-between mb-3 md:mb-6">
          <div>
            <span className="text-[8px] md:text-[10px] font-sub uppercase tracking-[0.25em] text-[#9A9A9A] block mb-0.5">
              SYNDICATED INTEL
            </span>
            <h2 className="font-display text-xl sm:text-2xl md:text-4xl uppercase text-white tracking-tight">
              TRENDING SPECIMENS
            </h2>
          </div>

          {/* Slider Chevrons */}
          <div className="flex items-center space-x-1.5 md:space-x-2">
            <button
              id="trending-prev-btn"
              className="w-7 h-7 md:w-9 md:h-9 rounded-full border border-white/12 hover:border-white flex items-center justify-center text-white transition-colors cursor-pointer"
              aria-label="Previous Slide"
            >
              <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              id="trending-next-btn"
              className="w-7 h-7 md:w-9 md:h-9 rounded-full border border-white/12 hover:border-white flex items-center justify-center text-white transition-colors cursor-pointer"
              aria-label="Next Slide"
            >
              <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Swiper Container with Ultra Compact Mini Cards */}
        <div ref={trendingSwiperRef} className="swiper pb-5 md:pb-8" data-cursor="Drag">
          <div className="swiper-wrapper">
            {MEMES_DATA.map((meme) => (
              <div
                key={meme.id}
                onClick={() => onOpenMemeLightbox(meme.id)}
                className="swiper-slide bg-[#111111] hover:bg-[#1A1A1A] border border-white/12 hover:border-white/30 rounded-lg md:rounded-xl p-1.5 sm:p-2 transition-all duration-300 cursor-pointer group shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.08)]"
              >
                <div className="aspect-square rounded-md md:rounded-lg overflow-hidden mb-1 bg-black">
                  <img
                    src={meme.src}
                    alt={meme.caption}
                    className="w-full h-full object-cover meme-media-vibrant"
                  />
                </div>
                <p className="font-sub text-[10px] sm:text-[11px] md:text-xs font-semibold text-white truncate leading-tight">
                  {meme.caption}
                </p>
                <div className="mt-1 pt-1 border-t border-white/10 flex items-center justify-between text-[8px] sm:text-[9px] font-sub text-[#9A9A9A]">
                  <span className="font-mono tabular-nums">{meme.likes}</span>
                  <span className="uppercase text-white tracking-widest text-[8px] group-hover:underline">Inspect</span>
                </div>
              </div>
            ))}
          </div>
          <div id="trending-pagination" className="swiper-pagination mt-3 md:mt-5" />
        </div>
      </section>
    </div>
  );
}
