import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import {
  SITE_CONFIG,
  MEMES_DATA,
  BRAINROT_DATA,
  BALLKNOWLEDGE_DATA,
  MemeItem,
  CommentItem,
} from './data/config';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import Preloader from './components/Preloader';
import PageCurtain from './components/PageCurtain';
import Lightbox from './components/Lightbox';
import HomePage from './pages/HomePage';
import MemesPage from './pages/MemesPage';
import BrainrotPage from './pages/BrainrotPage';
import BallKnowledgePage from './pages/BallKnowledgePage';

const INITIAL_COMMENTS: Record<number, CommentItem[]> = {
  1: [
    {
      id: 'c-init-1',
      author: 'ChancellorOffice',
      text: 'Official zero-attendance degree dispensation granted.',
      timestamp: '2h ago',
    },
  ],
  2: [
    {
      id: 'c-init-2',
      author: 'SpeedMaster',
      text: 'Gadi peele rang di slowly in the campus zone.',
      timestamp: '4h ago',
    },
  ],
  3: [
    {
      id: 'c-init-3',
      author: 'CivilDeptHead',
      text: '10 meters of test asphalt cleared for high traffic.',
      timestamp: '1d ago',
    },
  ],
};

export default function App() {
  const [preloaderFinished, setPreloaderFinished] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<string>('#/');
  const [isWiping, setIsWiping] = useState(false);
  const [isGrayscaleBg, setIsGrayscaleBg] = useState<boolean>(
    SITE_CONFIG.defaultGrayscaleBackground
  );

  // Scroll Progress Percentage
  const [scrollProgress, setScrollProgress] = useState(0);

  // Memes State (Supports Local Upload and Likes)
  const [memesList, setMemesList] = useState<MemeItem[]>(MEMES_DATA);
  const [likedMemes, setLikedMemes] = useState<Set<number>>(new Set());

  // Real Comments State (Stored & Persisted locally)
  const [commentsMap, setCommentsMap] = useState<Record<number, CommentItem[]>>(() => {
    try {
      const stored = localStorage.getItem('billa_meme_comments');
      return stored ? JSON.parse(stored) : INITIAL_COMMENTS;
    } catch {
      return INITIAL_COMMENTS;
    }
  });

  // Lightbox State
  const [lightboxMemeId, setLightboxMemeId] = useState<number | null>(null);

  const lenisRef = useRef<Lenis | null>(null);

  // Synchronize master registry of all clickable specimens
  const allSpecimensList: MemeItem[] = [
    ...memesList,
    ...BRAINROT_DATA.map((b) => ({
      id: 100 + b.id,
      src: b.src,
      caption: `${b.title} — ${b.desc}`,
      category: 'Exams' as const,
      likes: 850 + b.id * 120,
    })),
    ...BALLKNOWLEDGE_DATA.map((k) => ({
      id: 200 + k.id,
      src: k.src,
      caption: `${k.title}: ${k.caption}`,
      category: 'Friends' as const,
      likes: 1200 + k.id * 140,
    })),
  ];

  // 1. Initialize Lenis Smooth Scrolling
  useEffect(() => {
    try {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
      });
      lenisRef.current = lenis;

      let rafId: number;
      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);

      return () => {
        cancelAnimationFrame(rafId);
        lenis.destroy();
      };
    } catch {
      // Fallback
    }
  }, []);

  // 2. Hash Routing & Browser Back/Forward Support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/';
      triggerRouteTransition(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    if (!window.location.hash) {
      window.location.hash = '#/';
    } else {
      setCurrentRoute(window.location.hash);
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 3. Scroll Progress Listener
  useEffect(() => {
    const onScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const pct = (window.scrollY / totalHeight) * 100;
        setScrollProgress(pct);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Smooth Page Transition (Black Panel Curtain Wipe)
  const triggerRouteTransition = (newRoute: string) => {
    setIsWiping(true);
    setTimeout(() => {
      setCurrentRoute(newRoute);
      window.scrollTo(0, 0);
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
      setTimeout(() => {
        setIsWiping(false);
      }, 250);
    }, 350);
  };

  const handleNavigate = (route: string) => {
    if (window.location.hash === route) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.location.hash = route;
  };

  // Like Meme Action
  const handleLikeMeme = (id: number) => {
    setLikedMemes((prev) => {
      const next = new Set(prev);
      const isAlreadyLiked = next.has(id);
      if (isAlreadyLiked) {
        next.delete(id);
      } else {
        next.add(id);
      }

      setMemesList((currentList) =>
        currentList.map((m) =>
          m.id === id ? { ...m, likes: m.likes + (isAlreadyLiked ? -1 : 1) } : m
        )
      );

      return next;
    });
  };

  // Upload Meme Action
  const handleUploadMeme = (newMeme: MemeItem) => {
    setMemesList((prev) => [newMeme, ...prev]);
  };

  // Real Comments Add & Delete Handlers
  const handleAddComment = (memeId: number, text: string, author?: string) => {
    const newComment: CommentItem = {
      id: `c-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      author: author || 'Student_Scholar',
      text,
      timestamp: 'Just now',
    };

    setCommentsMap((prev) => {
      const existing = prev[memeId] || [];
      const updated = { ...prev, [memeId]: [...existing, newComment] };
      try {
        localStorage.setItem('billa_meme_comments', JSON.stringify(updated));
      } catch {
        // storage fallback
      }
      return updated;
    });
  };

  const handleDeleteComment = (memeId: number, commentId: string) => {
    setCommentsMap((prev) => {
      const existing = prev[memeId] || [];
      const updated = {
        ...prev,
        [memeId]: existing.filter((c) => c.id !== commentId),
      };
      try {
        localStorage.setItem('billa_meme_comments', JSON.stringify(updated));
      } catch {
        // storage fallback
      }
      return updated;
    });
  };

  // Lightbox Navigation
  const activeLightboxMeme =
    lightboxMemeId !== null
      ? allSpecimensList.find((m) => m.id === lightboxMemeId) || null
      : null;
  const currentLightboxIndex = activeLightboxMeme
    ? allSpecimensList.findIndex((m) => m.id === activeLightboxMeme.id)
    : 0;

  const handleNextLightbox = () => {
    if (allSpecimensList.length === 0) return;
    const nextIdx = (currentLightboxIndex + 1) % allSpecimensList.length;
    setLightboxMemeId(allSpecimensList[nextIdx].id);
  };

  const handlePrevLightbox = () => {
    if (allSpecimensList.length === 0) return;
    const prevIdx =
      (currentLightboxIndex - 1 + allSpecimensList.length) % allSpecimensList.length;
    setLightboxMemeId(allSpecimensList[prevIdx].id);
  };

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* 1. Preloader */}
      {!preloaderFinished && (
        <Preloader onComplete={() => setPreloaderFinished(true)} />
      )}

      {/* 2. Top Scroll Progress Indicator */}
      <div
        className="scroll-progress-line"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* 3. Custom Desktop Cursor */}
      <CustomCursor />

      {/* 4. Page Wipe Transition Curtain */}
      <PageCurtain isWiping={isWiping} />

      {/* 5. Fixed Full-Screen Background Photo Layer */}
      <div
        className="bg-fixed-layer"
        style={{
          backgroundImage: `url('${SITE_CONFIG.backgroundImg}')`,
          filter: `blur(${SITE_CONFIG.backgroundBlur}) ${
            isGrayscaleBg ? 'grayscale(100%)' : 'grayscale(0%)'
          }`,
        }}
      />
      {/* Fixed Gradient Scrim (50% black at top fading to #000000 at bottom) */}
      <div className="bg-gradient-scrim" />

      {/* 6. Active Frame Viewport */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          currentRoute={currentRoute}
          isGrayscaleBg={isGrayscaleBg}
          onToggleGrayscaleBg={() => setIsGrayscaleBg(!isGrayscaleBg)}
          onNavigate={handleNavigate}
        />

        {/* Dynamic Route Content */}
        <main className="flex-grow pt-20 md:pt-24">
          {currentRoute === '#/' && (
            <HomePage
              onNavigate={handleNavigate}
              onOpenMemeLightbox={(id) => setLightboxMemeId(id)}
            />
          )}

          {currentRoute === '#/memes' && (
            <MemesPage
              memes={memesList}
              onNavigate={handleNavigate}
              onOpenLightbox={(id) => setLightboxMemeId(id)}
              onLikeMeme={handleLikeMeme}
              onUploadMeme={handleUploadMeme}
              likedMemes={likedMemes}
            />
          )}

          {currentRoute === '#/brainrot' && (
            <BrainrotPage
              onNavigate={handleNavigate}
              onOpenLightbox={(id) => setLightboxMemeId(id)}
            />
          )}

          {currentRoute === '#/ballknowledge' && (
            <BallKnowledgePage
              onNavigate={handleNavigate}
              onOpenLightbox={(id) => setLightboxMemeId(id)}
            />
          )}
        </main>

        <Footer />
      </div>

      {/* 7. Lightbox Modal with Real User Comments */}
      {activeLightboxMeme && (
        <Lightbox
          meme={activeLightboxMeme}
          currentIndex={currentLightboxIndex}
          totalCount={allSpecimensList.length}
          onClose={() => setLightboxMemeId(null)}
          onNext={handleNextLightbox}
          onPrev={handlePrevLightbox}
          onLike={handleLikeMeme}
          isLiked={likedMemes.has(activeLightboxMeme.id)}
          comments={commentsMap[activeLightboxMeme.id] || []}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
        />
      )}
    </div>
  );
}
