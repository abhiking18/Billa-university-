import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { MemeItem } from '../data/config';

interface MemesPageProps {
  memes: MemeItem[];
  onNavigate: (route: string) => void;
  onOpenLightbox: (id: number) => void;
  onLikeMeme: (id: number) => void;
  onUploadMeme: (meme: MemeItem) => void;
  likedMemes: Set<number>;
}

export default function MemesPage({
  memes,
  onNavigate,
  onOpenLightbox,
  onLikeMeme,
  onUploadMeme,
  likedMemes,
}: MemesPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const featuredSwiperRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['All', 'Classroom', 'Exams', 'Hostel', 'Friends'];

  // Initialize Featured Meme Slider
  useEffect(() => {
    let swiper: Swiper | null = null;
    if (featuredSwiperRef.current) {
      swiper = new Swiper(featuredSwiperRef.current, {
        modules: [Navigation, Pagination, Autoplay],
        slidesPerView: 1,
        spaceBetween: 0,
        autoplay: {
          delay: 4500,
          disableOnInteraction: false,
        },
        pagination: {
          el: '#featured-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '#featured-next',
          prevEl: '#featured-prev',
        },
      });
    }

    return () => {
      if (swiper) swiper.destroy();
    };
  }, []);

  const filteredMemes =
    selectedCategory === 'All'
      ? memes
      : memes.filter((m) => m.category === selectedCategory);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        const newMeme: MemeItem = {
          id: Date.now(),
          src: event.target.result,
          caption: 'User-submitted archive specimen from terminal upload.',
          category: 'Friends',
          likes: 1,
        };
        onUploadMeme(newMeme);
        setSelectedCategory('All');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <section className="max-w-[1600px] w-full mx-auto px-5 sm:px-6 md:px-12 py-8 md:py-16 select-none overflow-x-hidden">
      {/* Breadcrumb / Back Link */}
      <div className="flex items-center space-x-3 text-xs font-sub uppercase tracking-[0.2em] text-[#9A9A9A] mb-6 md:mb-8">
        <button
          onClick={() => onNavigate('#/')}
          className="hover:text-white transition-colors cursor-pointer"
        >
          ← Back to Index
        </button>
        <span>/</span>
        <span>Faculty of Internet Archives</span>
      </div>

      {/* Page Title & Upload Action */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/12 pb-6 md:pb-10 gap-6 w-full max-w-full">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-5xl sm:text-7xl md:text-9xl uppercase tracking-tight text-white break-words [overflow-wrap:break-word] max-w-full leading-none"
          >
            MEMES
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-sub text-[17px] md:text-2xl text-[#9A9A9A] font-semibold mt-2"
          >
            Certified productivity killers.
          </motion.p>
        </div>

        {/* Upload Meme Button (FileReader) */}
        <div className="w-full sm:w-auto">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            data-cursor="Upload"
            className="btn-luxury-primary w-full sm:w-auto min-h-[56px] md:h-16 px-8 rounded-full inline-flex items-center justify-center space-x-3 font-sub text-base font-semibold tracking-wider uppercase cursor-pointer"
          >
            <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span className="relative z-10">Upload Meme</span>
          </button>
        </div>
      </div>

      {/* Featured Meme Slider at top (Full Color Vibrant Imagery) */}
      <div className="my-14 relative">
        <div
          ref={featuredSwiperRef}
          className="swiper rounded-3xl border border-white/12 overflow-hidden bg-[#111111] shadow-[0_20px_45px_rgba(0,0,0,0.5)]"
        >
          <div className="swiper-wrapper">
            {memes.slice(0, 4).map((item, idx) => (
              <div key={item.id} className="swiper-slide p-6 md:p-14 flex flex-col md:flex-row items-center gap-8 md:gap-14">
                <div className="w-full md:w-1/2 aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 group cursor-pointer" onClick={() => onOpenLightbox(item.id)}>
                  <img
                    src={item.src}
                    alt={item.caption}
                    className="w-full h-full object-cover meme-media-vibrant"
                  />
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                  <span className="text-xs font-sub text-[#9A9A9A] uppercase tracking-[0.25em] block font-mono">
                    FEATURED SPECIMEN 0{idx + 1}
                  </span>
                  <h3 className="font-display text-3xl md:text-5xl uppercase text-white tracking-tight">
                    {item.category.toUpperCase()} ARCHIVE
                  </h3>
                  <p className="font-sub text-[#9A9A9A] text-base md:text-lg italic">
                    "{item.caption}"
                  </p>
                  <div className="pt-4 flex items-center space-x-4">
                    <button
                      onClick={() => onOpenLightbox(item.id)}
                      className="btn-luxury-secondary h-12 px-6 rounded-full text-xs font-sub uppercase tracking-wider"
                    >
                      Inspect Full Screen
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div id="featured-pagination" className="swiper-pagination pb-4" />
        </div>

        {/* Chevron buttons */}
        <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 w-full justify-between px-4 z-20 pointer-events-none">
          <button
            id="featured-prev"
            className="w-12 h-12 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors pointer-events-auto cursor-pointer"
            aria-label="Previous Featured"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            id="featured-next"
            className="w-12 h-12 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors pointer-events-auto cursor-pointer"
            aria-label="Next Featured"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Category Filter Tabs with Animated Active Indicator */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8 md:mb-12 w-full max-w-full">
        <div className="relative inline-flex flex-wrap p-1 md:p-1.5 bg-[#111111] border border-white/12 rounded-2xl md:rounded-full gap-1">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative z-10 px-4 sm:px-5 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-sub uppercase font-semibold transition-all duration-300 cursor-pointer ${
                  active ? 'bg-white text-black shadow-md' : 'text-[#9A9A9A] hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <span className="text-xs font-sub text-[#9A9A9A] uppercase tracking-widest font-mono">
          {filteredMemes.length} SPECIMENS
        </span>
      </div>

      {/* Grid of Meme Cards (Single-column on mobile, gap-4, full-width) */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full max-w-full"
      >
        <AnimatePresence mode="popLayout">
          {filteredMemes.map((meme) => {
            const isLiked = likedMemes.has(meme.id);
            return (
              <motion.div
                key={meme.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group bg-[#111111] hover:bg-[#1A1A1A] border border-white/12 hover:border-white/35 rounded-2xl md:rounded-3xl p-5 md:p-6 transition-all duration-300 flex flex-col justify-between shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(255,255,255,0.06)] w-full max-w-full"
              >
                <div>
                  <div
                    onClick={() => onOpenLightbox(meme.id)}
                    className="aspect-square rounded-2xl overflow-hidden mb-5 bg-black cursor-pointer relative"
                    data-cursor="Inspect"
                  >
                    <img
                      src={meme.src}
                      alt={meme.caption}
                      className="w-full h-full object-cover meme-media-vibrant"
                    />
                    <span className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-sub uppercase tracking-wider text-white border border-white/15">
                      {meme.category}
                    </span>
                  </div>
                  <p className="font-sub text-base text-white font-medium line-clamp-2">
                    {meme.caption}
                  </p>
                </div>

                {/* Action bar with Animated Like Button */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-sub text-[#9A9A9A]">
                  <motion.button
                    whileTap={{ scale: 1.25 }}
                    onClick={() => onLikeMeme(meme.id)}
                    className="inline-flex items-center space-x-2 hover:text-white transition-colors cursor-pointer"
                  >
                    <svg
                      className={`w-5 h-5 transition-transform duration-200 ${
                        isLiked ? 'fill-white stroke-white scale-110' : 'fill-none stroke-currentColor'
                      }`}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span className="font-mono tabular-nums text-sm font-semibold text-white">
                      {meme.likes}
                    </span>
                  </motion.button>

                  <button
                    onClick={() => onOpenLightbox(meme.id)}
                    className="hover:text-white uppercase tracking-wider cursor-pointer font-semibold"
                  >
                    Inspect
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
