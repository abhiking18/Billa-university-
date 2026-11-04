import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { BRAINROT_DATA } from '../data/config';

interface BrainrotPageProps {
  onNavigate: (route: string) => void;
  onOpenLightbox?: (id: number) => void;
}

export default function BrainrotPage({ onNavigate, onOpenLightbox }: BrainrotPageProps) {
  const [rotScore, setRotScore] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);

  const calculateRot = () => {
    if (isCalculating) return;
    setIsCalculating(true);
    setRotScore(0);

    const target = Math.floor(Math.random() * 36) + 65; // 65% to 100%
    let current = 0;

    const interval = setInterval(() => {
      current += 2;
      if (current >= target) {
        current = target;
        clearInterval(interval);
        setRotScore(target);
        setIsCalculating(false);
      } else {
        setRotScore(current);
      }
    }, 25);
  };

  const scrollGallery = (direction: 'left' | 'right') => {
    if (horizontalScrollRef.current) {
      const amount = direction === 'left' ? -420 : 420;
      horizontalScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Circular gauge mathematics
  const maxDash = 264;
  const currentDash =
    rotScore !== null ? maxDash - (maxDash * rotScore) / 100 : maxDash;

  return (
    <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-10 md:py-16 select-none">
      {/* Breadcrumb / Back Link */}
      <div className="flex items-center space-x-3 text-xs font-sub uppercase tracking-[0.2em] text-[#9A9A9A] mb-8">
        <button
          onClick={() => onNavigate('#/')}
          className="hover:text-white transition-colors cursor-pointer"
        >
          ← Back to Index
        </button>
        <span>/</span>
        <span>Cognitive Radiation Chamber</span>
      </div>

      {/* Tasteful Glitch Heading (Strictly White & Grey) */}
      <div className="border-b border-white/12 pb-10 mb-16">
        <h1
          className="glitch-mono font-display text-6xl md:text-9xl uppercase tracking-tight text-white inline-block cursor-default select-none"
          data-text="BRAINROT"
        >
          BRAINROT
        </h1>
        <p className="font-sub text-lg md:text-2xl text-[#9A9A9A] font-semibold mt-2">
          Your brain cells left the chat.
        </p>
      </div>

      {/* Continuous Marquee Strips in Opposite Directions */}
      <div className="space-y-4 my-16 border-y border-white/12 py-8 bg-black/40 overflow-hidden select-none">
        <div className="animate-marquee-flow font-display text-4xl md:text-6xl uppercase tracking-wider text-[#9A9A9A]">
          <span className="mx-8">SKIBIDI • SIGMA • RIZZ • AURA • NPC • SKIBIDI • SIGMA • RIZZ • AURA • NPC •</span>
          <span className="mx-8">SKIBIDI • SIGMA • RIZZ • AURA • NPC • SKIBIDI • SIGMA • RIZZ • AURA • NPC •</span>
        </div>
        <div className="animate-marquee-reverse font-display text-4xl md:text-6xl uppercase tracking-wider marquee-outline-text">
          <span className="mx-8">MOGGING • OHIO • MEWING • BABY GRONK • LIVVY DUNNE • FANUM TAX •</span>
          <span className="mx-8">MOGGING • OHIO • MEWING • BABY GRONK • LIVVY DUNNE • FANUM TAX •</span>
        </div>
      </div>

      {/* Rot Level Tool (Interactive SVG circular gauge with pulse animation) */}
      <div className="bg-[#111111] border border-white/12 rounded-3xl p-8 md:p-14 my-20 flex flex-col md:flex-row items-center justify-between gap-10 shadow-[0_20px_45px_rgba(0,0,0,0.5)]">
        <div className="max-w-xl space-y-5">
          <span className="text-xs font-sub uppercase tracking-[0.25em] text-[#9A9A9A] block font-mono">
            BIOMETRIC ROT CALCULATOR
          </span>
          <h2 className="font-display text-4xl md:text-6xl uppercase text-white tracking-tight">
            EVALUATE COGNITIVE ATROPHY
          </h2>
          <p className="font-sub text-[#9A9A9A] text-base md:text-lg">
            Measure synaptic degeneration caused by vertical video doom-scrolling loops.
          </p>

          <div className="pt-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={calculateRot}
              disabled={isCalculating}
              data-cursor="Calculate"
              className="btn-luxury-primary h-16 md:h-18 px-10 rounded-full inline-flex items-center space-x-3 font-sub text-base font-semibold uppercase tracking-wider disabled:opacity-50 cursor-pointer"
            >
              <span className="relative z-10">
                {isCalculating ? 'Computing Synapses...' : 'Check My Rot Level'}
              </span>
              <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Circular Gauge Visualization with animated pulse ring */}
        <div className="relative w-64 h-64 flex items-center justify-center shrink-0">
          <div className="absolute inset-0 rounded-full border border-white/10 animate-ping opacity-20 pointer-events-none" />
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeDasharray={maxDash}
              strokeDashoffset={currentDash}
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-300 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-display text-5xl md:text-6xl text-white font-mono tabular-nums">
              {rotScore !== null ? `${rotScore}%` : '0%'}
            </span>
            <span className="font-sub text-xs uppercase tracking-widest text-[#9A9A9A] mt-1 font-semibold font-mono">
              {isCalculating
                ? 'SCANNING...'
                : rotScore !== null
                ? `${rotScore}% ROTTED`
                : 'IDLE'}
            </span>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Gallery (Full Color Vivid Imagery) */}
      <div className="my-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-sub uppercase tracking-[0.25em] text-[#9A9A9A] block mb-1">
              CHRONOLOGICAL VAULT
            </span>
            <h3 className="font-display text-4xl md:text-5xl uppercase text-white">
              BRAINROT CHRONICLES
            </h3>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => scrollGallery('left')}
              className="w-12 h-12 rounded-full border border-white/12 hover:border-white text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Scroll Left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scrollGallery('right')}
              className="w-12 h-12 rounded-full border border-white/12 hover:border-white text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Scroll Right"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Horizontal scroll container with momentum and snap */}
        <div
          ref={horizontalScrollRef}
          className="flex space-x-6 overflow-x-auto pb-8 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {BRAINROT_DATA.map((item) => (
            <motion.div
              key={item.id}
              onClick={() => onOpenLightbox && onOpenLightbox(100 + item.id)}
              data-cursor="Inspect"
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="min-w-[320px] md:min-w-[420px] max-w-[440px] bg-[#111111] hover:bg-[#1A1A1A] border border-white/12 hover:border-white/35 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between snap-start shrink-0 group shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(255,255,255,0.06)] cursor-pointer"
            >
              <div>
                <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-black border border-white/5 relative">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover meme-media-vibrant"
                  />
                  <span className="absolute bottom-2 right-2 bg-black/75 px-2.5 py-0.5 rounded-full text-[9px] font-sub uppercase tracking-wider text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    Inspect
                  </span>
                </div>
                <span className="text-xs font-sub text-[#9A9A9A] tracking-widest uppercase block mb-2 font-mono">
                  {item.tag}
                </span>
                <h4 className="font-display text-2xl md:text-3xl uppercase text-white mb-2 tracking-tight">
                  {item.title}
                </h4>
                <p className="font-sub text-sm md:text-base text-[#9A9A9A] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center text-xs font-sub text-[#9A9A9A]">
                <span>SYNAPSE VERIFIED</span>
                <span className="text-white hover:underline uppercase tracking-wider text-[11px]">Inspect</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
