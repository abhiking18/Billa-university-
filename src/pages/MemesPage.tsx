import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { MemeItem } from '../data/config';
import {
  compressImage,
  uploadMemeToFirestore,
  deleteMemeFromFirestore,
  ADMIN_PIN,
} from '../services/firebase';

interface MemesPageProps {
  memes: MemeItem[];
  onNavigate: (route: string) => void;
  onOpenLightbox: (id: string | number) => void;
  onLikeMeme: (id: string | number) => void;
  likedMemes: Set<string>;
  isLoading?: boolean;
  loadError?: string | null;
}

export default function MemesPage({
  memes,
  onNavigate,
  onOpenLightbox,
  onLikeMeme,
  likedMemes,
  isLoading = false,
  loadError = null,
}: MemesPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const featuredSwiperRef = useRef<HTMLDivElement>(null);

  // Upload Panel Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [captionInput, setCaptionInput] = useState('');
  const [categoryInput, setCategoryInput] = useState<'Classroom' | 'Exams' | 'Hostel' | 'Friends'>('Classroom');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  // Delete In-Page Confirmation Modal State
  const [memePendingDelete, setMemePendingDelete] = useState<MemeItem | null>(null);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Temporary Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories = ['All', 'Classroom', 'Exams', 'Hostel', 'Friends'];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 4000);
  };

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
  }, [memes]);

  const filteredMemes =
    selectedCategory === 'All'
      ? memes
      : memes.filter((m) => m.category === selectedCategory);

  // Handle Image File Selection in Upload Panel
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Reject files over 10MB before compression
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File exceeds 10MB limit. Please select an image under 10MB.');
      e.target.value = '';
      return;
    }

    // Verify allowed types
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setUploadError('Invalid format. Please upload a JPG, PNG, WEBP, or GIF.');
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // Handle Post Meme Submit Action
  const handlePostMeme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Please select a meme image to upload.');
      return;
    }

    if (captionInput.length > 120) {
      setUploadError('Caption must be 120 characters or fewer.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadStatusText('Resizing & compressing image (max 1000px, 0.7 JPEG)...');

    try {
      // 1. Compress image in browser canvas (<700KB, max 1000px width)
      const compressedDataUrl = await compressImage(selectedFile);

      // 2. Upload to Firestore permanent shared collection
      setUploadStatusText('Saving to permanent Firestore archive...');
      await uploadMemeToFirestore({
        image: compressedDataUrl,
        caption: captionInput,
        category: categoryInput,
      });

      // 3. Reset form and close modal
      setIsUploading(false);
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setCaptionInput('');
      setSelectedCategory('All');
      triggerToast('Meme successfully published to archive for all devices!');
    } catch (err: any) {
      console.error('Meme post error:', err);
      setIsUploading(false);
      setUploadError(err.message || 'Upload failed. Check your internet connection and try again.');
    }
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = async () => {
    if (!memePendingDelete) return;

    // Check ADMIN_PIN if configured
    if (ADMIN_PIN && ADMIN_PIN.trim() !== '') {
      if (adminPinInput.trim() !== ADMIN_PIN.trim()) {
        setPinError('Incorrect Admin PIN. Deletion unauthorized.');
        return;
      }
    }

    setIsDeleting(true);
    setPinError(null);

    try {
      const deleteId = memePendingDelete.firestoreId || String(memePendingDelete.id);
      await deleteMemeFromFirestore(deleteId);
      setIsDeleting(false);
      setMemePendingDelete(null);
      setAdminPinInput('');
      triggerToast('Meme deleted from archive.');
    } catch (err: any) {
      console.error('Delete error:', err);
      setIsDeleting(false);
      setPinError(err.message || 'Deletion failed. Check your internet and try again.');
    }
  };

  return (
    <section className="max-w-[1600px] w-full mx-auto px-5 sm:px-6 md:px-12 py-8 md:py-16 select-none overflow-x-hidden relative">
      {/* Toast Notification Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[9990] bg-white text-black font-sub text-xs md:text-sm font-semibold tracking-wider uppercase px-6 py-3 rounded-full shadow-2xl flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

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

        {/* Upload Meme Button: Opens clean in-page Upload Panel */}
        <div className="w-full sm:w-auto">
          <button
            onClick={() => {
              setUploadError(null);
              setIsUploadModalOpen(true);
            }}
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

      {/* Load Error Alert if Firestore connection issues occur */}
      {loadError && (
        <div className="mt-6 p-4 rounded-2xl bg-[#111111] border border-white/20 text-xs font-sub text-[#9A9A9A] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>{loadError}</span>
          </div>
          <span className="font-mono text-[10px] uppercase">Using offline mirror</span>
        </div>
      )}

      {/* Featured Meme Slider at top (Full Color Vibrant Imagery) */}
      <div className="my-14 relative">
        <div
          ref={featuredSwiperRef}
          className="swiper rounded-3xl border border-white/12 overflow-hidden bg-[#111111] shadow-[0_20px_45px_rgba(0,0,0,0.5)]"
        >
          <div className="swiper-wrapper">
            {memes.slice(0, 4).map((item, idx) => (
              <div key={item.id} className="swiper-slide p-6 md:p-14 flex flex-col md:flex-row items-center gap-8 md:gap-14">
                <div
                  className="w-full md:w-1/2 aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 group cursor-pointer relative"
                  onClick={() => onOpenLightbox(item.id)}
                >
                  <img
                    src={item.src}
                    alt={item.caption}
                    className="w-full h-full object-cover meme-media-vibrant"
                  />
                  {item.isUploaded && (
                    <span className="absolute top-3 left-3 bg-white text-black font-sub uppercase text-[9px] font-bold px-2.5 py-1 rounded-full tracking-wider shadow-sm">
                      Community Archive
                    </span>
                  )}
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
                      className="btn-luxury-secondary h-12 px-6 rounded-full text-xs font-sub uppercase tracking-wider cursor-pointer"
                    >
                      Inspect Full Screen
                    </button>
                    {item.isUploaded && (
                      <button
                        onClick={() => setMemePendingDelete(item)}
                        className="h-12 px-4 rounded-full border border-white/20 hover:border-white text-xs font-sub uppercase tracking-wider text-[#9A9A9A] hover:text-white transition-colors cursor-pointer inline-flex items-center space-x-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Delete</span>
                      </button>
                    )}
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

        <div className="flex items-center space-x-3 text-xs font-sub text-[#9A9A9A] uppercase tracking-widest font-mono">
          {isLoading && (
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>Syncing Archive...</span>
            </span>
          )}
          <span>{filteredMemes.length} SPECIMENS</span>
        </div>
      </div>

      {/* Grid of Meme Cards (Single-column on mobile, gap-4, full-width) */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full max-w-full"
      >
        <AnimatePresence mode="popLayout">
          {filteredMemes.map((meme) => {
            const isLiked = likedMemes.has(String(meme.id));
            return (
              <motion.div
                key={meme.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group bg-[#111111] hover:bg-[#1A1A1A] border border-white/12 hover:border-white/35 rounded-2xl md:rounded-3xl p-5 md:p-6 transition-all duration-300 flex flex-col justify-between shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(255,255,255,0.06)] w-full max-w-full relative"
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

                    {/* Top Badges & Delete Button */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-sub uppercase tracking-wider text-white border border-white/15">
                        {meme.category}
                      </span>

                      {meme.isUploaded && (
                        <div className="flex items-center space-x-1.5 pointer-events-auto">
                          <span className="bg-white text-black font-sub uppercase text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider shadow-sm">
                            Shared
                          </span>
                          {/* Small thin-line trash icon delete button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMemePendingDelete(meme);
                            }}
                            className="w-7 h-7 rounded-full bg-black/80 hover:bg-white text-[#9A9A9A] hover:text-black border border-white/20 hover:border-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
                            title="Delete this meme"
                            aria-label="Delete this meme"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="font-sub text-base text-white font-medium line-clamp-2">
                    {meme.caption}
                  </p>
                </div>

                {/* Action bar with Real Likes Only (No fake counts, number only if > 0) */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-sub text-[#9A9A9A]">
                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileTap={{ scale: 1.25 }}
                      onClick={() => onLikeMeme(meme.id)}
                      className="inline-flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer"
                      title={isLiked ? 'Unlike meme' : 'Like meme'}
                    >
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
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
                      {/* REAL LIKES ONLY: number shows strictly when > 0 */}
                      {meme.likes > 0 && (
                        <span className="font-mono tabular-nums text-xs font-semibold text-white">
                          {meme.likes}
                        </span>
                      )}
                    </motion.button>
                  </div>

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

      {/* =========================================================================
          IN-PAGE UPLOAD PANEL MODAL
          ========================================================================= */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg bg-[#111111] border border-white/20 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative select-text"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/12 pb-4 mb-6">
                <div>
                  <span className="text-[10px] font-sub uppercase tracking-[0.25em] text-[#9A9A9A] block">
                    Permanent Archive
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-white">
                    Post Meme Specimen
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!isUploading) {
                      setIsUploadModalOpen(false);
                      setUploadError(null);
                    }
                  }}
                  className="w-9 h-9 rounded-full border border-white/20 hover:border-white flex items-center justify-center text-white transition-colors cursor-pointer"
                  disabled={isUploading}
                >
                  ✕
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handlePostMeme} className="space-y-5">
                {/* File picker / drop preview */}
                <div>
                  <input
                    type="file"
                    ref={modalFileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                  />
                  {previewUrl ? (
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/20 group">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => modalFileInputRef.current?.click()}
                        disabled={isUploading}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-sub uppercase tracking-wider text-white"
                      >
                        Change Photo
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => modalFileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/20 hover:border-white/50 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-colors bg-black/40"
                    >
                      <svg className="w-8 h-8 mx-auto mb-2 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="font-sub text-sm font-semibold text-white mb-1">
                        Select meme image
                      </p>
                      <p className="text-[11px] font-sub text-[#9A9A9A]">
                        JPG, PNG, WEBP, GIF (Max 10MB)
                      </p>
                    </div>
                  )}
                </div>

                {/* Category selector */}
                <div>
                  <label className="block text-[11px] font-sub uppercase tracking-wider text-[#9A9A9A] mb-2 font-semibold">
                    Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['Classroom', 'Exams', 'Hostel', 'Friends'] as const).map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setCategoryInput(cat)}
                        disabled={isUploading}
                        className={`py-2 px-3 rounded-xl text-xs font-sub uppercase font-semibold transition-all cursor-pointer border ${
                          categoryInput === cat
                            ? 'bg-white text-black border-white shadow-md'
                            : 'bg-black/40 text-[#9A9A9A] border-white/12 hover:border-white/30'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional short caption */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-sub uppercase tracking-wider text-[#9A9A9A] font-semibold">
                      Short Caption (Optional)
                    </label>
                    <span className="text-[10px] font-mono text-[#9A9A9A]">
                      {captionInput.length}/120
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={120}
                    placeholder="E.g. Chancellor Billa presiding over midnight exams..."
                    value={captionInput}
                    onChange={(e) => setCaptionInput(e.target.value)}
                    disabled={isUploading}
                    className="w-full bg-black/60 border border-white/15 focus:border-white rounded-xl px-4 py-3 text-sm text-white placeholder-[#9A9A9A]/50 focus:outline-none transition-colors"
                  />
                </div>

                {/* Error Banner */}
                {uploadError && (
                  <div className="p-3 bg-black border border-white/30 rounded-xl text-xs text-white flex items-center space-x-2">
                    <svg className="w-4 h-4 shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Upload Status / Progress Indicator */}
                {isUploading && (
                  <div className="p-3 bg-black/70 border border-white/15 rounded-xl flex items-center space-x-3 text-xs text-white font-sub">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                    <span className="animate-pulse">{uploadStatusText}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    disabled={isUploading}
                    className="px-5 py-3 rounded-full text-xs font-sub uppercase tracking-wider text-[#9A9A9A] hover:text-white border border-white/15 hover:border-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="btn-luxury-primary px-8 py-3 rounded-full text-xs font-sub uppercase font-bold tracking-wider cursor-pointer disabled:opacity-50"
                  >
                    {isUploading ? 'Compressing & Posting...' : 'Post Meme'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          IN-PAGE DELETE CONFIRMATION MODAL
          ========================================================================= */}
      <AnimatePresence>
        {memePendingDelete && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md bg-[#111111] border border-white/20 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative select-text"
            >
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mx-auto mb-4 bg-black">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>

              <h4 className="font-display text-2xl uppercase tracking-tight text-center text-white mb-2">
                Delete This Meme?
              </h4>
              <p className="font-sub text-xs text-[#9A9A9A] text-center mb-6 leading-relaxed">
                This will permanently remove this specimen from the shared database for all phones and viewers.
              </p>

              {/* ADMIN_PIN input if configured */}
              {ADMIN_PIN && ADMIN_PIN.trim() !== '' && (
                <div className="mb-5">
                  <label className="block text-[11px] font-sub uppercase tracking-wider text-[#9A9A9A] mb-1.5 font-semibold">
                    Enter Admin PIN to Confirm
                  </label>
                  <input
                    type="password"
                    maxLength={16}
                    placeholder="PIN Code"
                    value={adminPinInput}
                    onChange={(e) => {
                      setAdminPinInput(e.target.value);
                      setPinError(null);
                    }}
                    className="w-full bg-black/60 border border-white/15 focus:border-white rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#9A9A9A]/50 focus:outline-none transition-colors"
                  />
                </div>
              )}

              {pinError && (
                <div className="mb-4 p-2.5 bg-black border border-white/30 rounded-xl text-xs text-white text-center">
                  {pinError}
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMemePendingDelete(null);
                    setAdminPinInput('');
                    setPinError(null);
                  }}
                  disabled={isDeleting}
                  className="w-1/2 py-3 rounded-full text-xs font-sub uppercase tracking-wider text-[#9A9A9A] hover:text-white border border-white/15 hover:border-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="w-1/2 btn-luxury-primary py-3 rounded-full text-xs font-sub uppercase font-bold tracking-wider cursor-pointer"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
