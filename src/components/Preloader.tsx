import { useEffect, useState } from 'react';
import { SITE_CONFIG } from '../data/config';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 20) + 10;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => {
              onComplete();
            }, 850);
          }, 250);
          return 100;
        }
        return next;
      });
    }, 60);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 bg-black z-[9999] flex flex-col justify-between p-8 md:p-16 transition-transform duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
        isExiting ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      {/* Top Header metadata with logo */}
      <div className="flex justify-between items-center text-xs uppercase tracking-[0.25em] text-[#9A9A9A] font-sub">
        <div className="flex items-center space-x-2.5">
          <div className="w-5 h-5 rounded-full overflow-hidden border border-white/30 shrink-0">
            <img src={SITE_CONFIG.logoImg} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span>BILLA INSTITUTE OF DIGITAL DISCOURSE</span>
        </div>
        <span>ARCHIVE EST. 2026</span>
      </div>

      {/* Center Wordmark with Logo Insignia */}
      <div className="space-y-6 my-auto">
        <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-white/40 shadow-2xl bg-black">
          <img
            src={SITE_CONFIG.logoImg}
            alt="Billa University Emblem"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="font-display text-5xl md:text-8xl lg:text-9xl tracking-tight text-white uppercase">
            BILLA UNIVERSITY
          </h1>
          <p className="font-sub text-xs md:text-sm text-[#9A9A9A] tracking-wider uppercase font-medium mt-2">
            Memes. Brainrot. Ball knowledge.
          </p>
        </div>
      </div>

      {/* Bottom Loading Progress Meter */}
      <div className="w-full">
        <div className="flex justify-between items-center text-xs md:text-sm font-sub text-white mb-3">
          <span className="tracking-widest uppercase text-[#9A9A9A]">AUTHENTICATING CURRICULUM</span>
          <span className="font-mono tabular-nums text-white font-bold">{progress}%</span>
        </div>
        <div className="w-full h-[2px] bg-white/10 overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
