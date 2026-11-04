import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MemeItem, CommentItem } from '../data/config';
import { ADMIN_PIN } from '../services/firebase';

interface LightboxProps {
  meme: MemeItem | null;
  currentIndex: number;
  totalCount: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLike: (id: string | number) => void;
  isLiked: boolean;
  comments: CommentItem[];
  onAddComment: (memeId: string | number, text: string, author?: string) => void;
  onDeleteComment?: (memeId: string | number, commentId: string) => void;
  onDeleteMeme?: (id: string | number) => void;
}

export default function Lightbox({
  meme,
  currentIndex,
  totalCount,
  onClose,
  onPrev,
  onNext,
  onLike,
  isLiked,
  comments,
  onAddComment,
  onDeleteComment,
  onDeleteMeme,
}: LightboxProps) {
  const touchStartX = useRef<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!meme) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        if (e.key === 'Escape') {
          (document.activeElement as HTMLElement).blur();
        }
        return;
      }

      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'c' || e.key === 'C') setShowComments((prev) => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [meme, onClose, onPrev, onNext]);

  if (!meme) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX.current;
    if (diff > 50) {
      onPrev();
    } else if (diff < -50) {
      onNext();
    }
    touchStartX.current = null;
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;

    onAddComment(meme.id, trimmed, authorName.trim() || undefined);
    setCommentText('');

    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div
      className="fixed inset-0 bg-black/95 z-[9995] flex flex-col justify-between p-4 sm:p-6 md:p-10 transition-opacity duration-300 backdrop-blur-md select-none overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between text-xs font-sub uppercase tracking-wider text-[#9A9A9A] border-b border-white/12 pb-3 shrink-0">
        <div className="flex items-center space-x-3">
          <span className="font-mono text-white font-semibold">
            SPECIMEN {currentIndex + 1} OF {totalCount}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
          <span className="hidden sm:inline text-[#9A9A9A]">{meme.category}</span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Delete Uploaded Meme Option with In-Page Confirmation */}
          {meme.isUploaded && onDeleteMeme && (
            <button
              onClick={() => {
                setPinError(null);
                setAdminPinInput('');
                setShowDeleteConfirm(true);
              }}
              className="px-3 py-1.5 rounded-full border text-xs font-sub uppercase tracking-wider flex items-center space-x-1.5 transition-colors cursor-pointer bg-black/60 text-[#9A9A9A] hover:text-white border-white/20 hover:border-white"
              title="Delete this uploaded meme"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete</span>
            </button>
          )}

          {/* Toggle Comments Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className={`px-3 py-1.5 rounded-full border text-xs font-sub uppercase tracking-wider flex items-center space-x-2 transition-colors cursor-pointer ${
              showComments
                ? 'bg-white text-black border-white'
                : 'bg-black/60 text-white border-white/20 hover:border-white'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span>Comments ({comments.length})</span>
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="text-white hover:text-white/70 flex items-center space-x-1.5 text-xs font-sub cursor-pointer border border-white/20 px-3 py-1.5 rounded-full hover:border-white transition-colors"
          >
            <span>CLOSE</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Center Area: Split between Image & Comments Drawer */}
      <div className="relative flex-grow flex flex-col lg:flex-row items-center justify-center my-3 sm:my-4 gap-6 overflow-hidden">
        {/* Left/Main Image Stage */}
        <div className="relative flex-grow h-full w-full flex items-center justify-center overflow-hidden">
          <img
            src={meme.src}
            alt={meme.caption}
            className="max-h-[62vh] sm:max-h-[68vh] lg:max-h-[72vh] max-w-full object-contain rounded-xl border border-white/12 bg-black shadow-2xl"
          />

          {/* Previous Button */}
          <button
            onClick={onPrev}
            className="absolute left-1 sm:left-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 bg-black/70 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer z-10"
            aria-label="Previous meme"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={onNext}
            className="absolute right-1 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 bg-black/70 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer z-10"
            aria-label="Next meme"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Real Interactive Comments Panel (Desktop Sidebar / Mobile Drawer) */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full lg:w-[380px] xl:w-[420px] max-w-full h-[50vh] lg:h-full bg-[#111111] border border-white/15 rounded-2xl flex flex-col p-4 sm:p-5 shrink-0 shadow-2xl select-text"
            >
              {/* Comments Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-display text-xl uppercase tracking-tight text-white">
                    MEME DISCOURSE
                  </span>
                  <span className="text-xs font-mono text-[#9A9A9A]">({comments.length})</span>
                </div>
                <button
                  onClick={() => setShowComments(false)}
                  className="text-xs font-sub text-[#9A9A9A] hover:text-white uppercase tracking-wider"
                >
                  Hide
                </button>
              </div>

              {/* Scrollable Comments Stream */}
              <div className="flex-grow overflow-y-auto space-y-3 pr-1 text-xs">
                {comments.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#9A9A9A]">
                    <svg className="w-8 h-8 mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="font-sub font-medium text-white mb-1">No comments yet</p>
                    <p className="text-[11px] text-[#9A9A9A]">Be the first to leave authentic peer-reviewed feedback.</p>
                  </div>
                ) : (
                  comments.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 bg-black/50 border border-white/8 rounded-xl flex flex-col space-y-1 hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-sub font-semibold text-white tracking-wide text-[11px]">
                          {c.author}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono text-[#9A9A9A]">{c.timestamp}</span>
                          {onDeleteComment && (
                            <button
                              onClick={() => onDeleteComment(meme.id, c.id)}
                              className="text-[10px] text-[#9A9A9A] hover:text-white"
                              title="Delete comment"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-white/90 text-xs font-sans leading-relaxed break-words">
                        {c.text}
                      </p>
                    </div>
                  ))
                )}
                <div ref={commentsEndRef} />
              </div>

              {/* Real User Comment Input Form */}
              <form onSubmit={handleSubmitComment} className="pt-3 border-t border-white/10 mt-2 space-y-2">
                <input
                  type="text"
                  placeholder="Your Name / Handle (optional)"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  maxLength={30}
                  className="w-full bg-black/60 border border-white/12 rounded-lg px-3 py-1.5 text-xs text-white placeholder-[#9A9A9A]/60 focus:outline-none focus:border-white transition-colors"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Write a real comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    maxLength={200}
                    className="flex-grow bg-black/60 border border-white/12 rounded-lg px-3 py-2 text-xs text-white placeholder-[#9A9A9A]/60 focus:outline-none focus:border-white transition-colors"
                  />
                  <button
                    type="submit"
                    className="btn-luxury-primary px-4 py-2 rounded-lg text-xs font-sub uppercase font-bold tracking-wider shrink-0 cursor-pointer"
                  >
                    Post
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Bar: Caption, Likes, and Comment Trigger */}
      <div className="border-t border-white/12 pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sub text-[#9A9A9A] shrink-0">
        <p className="text-white text-xs sm:text-sm font-medium line-clamp-2 max-w-2xl text-center sm:text-left">
          {meme.caption}
        </p>

        <div className="flex items-center space-x-5">
          {/* Like button */}
          <button
            onClick={() => onLike(meme.id)}
            className="flex items-center space-x-1.5 text-xs sm:text-sm text-white hover:text-white/80 transition-colors cursor-pointer"
            title={isLiked ? 'Unlike meme' : 'Like meme'}
          >
            <svg
              className={`w-4 h-4 transition-transform ${isLiked ? 'fill-white stroke-white scale-110' : 'fill-none stroke-currentColor'}`}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {meme.likes > 0 && <span className="font-mono tabular-nums">{meme.likes}</span>}
          </button>

          {/* Comment Counter Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-1.5 text-xs sm:text-sm text-white hover:text-white/80 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="font-mono tabular-nums">{comments.length}</span>
          </button>

          <span className="hidden md:inline font-mono text-[10px]">Press 'C' for comments</span>
        </div>
      </div>

      {/* In-Page Delete Confirmation Dialog */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
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
                    setShowDeleteConfirm(false);
                    setPinError(null);
                  }}
                  className="w-1/2 py-3 rounded-full text-xs font-sub uppercase tracking-wider text-[#9A9A9A] hover:text-white border border-white/15 hover:border-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (ADMIN_PIN && ADMIN_PIN.trim() !== '') {
                      if (adminPinInput.trim() !== ADMIN_PIN.trim()) {
                        setPinError('Incorrect Admin PIN.');
                        return;
                      }
                    }
                    if (onDeleteMeme) {
                      onDeleteMeme(meme.id);
                    }
                    setShowDeleteConfirm(false);
                    onClose();
                  }}
                  className="w-1/2 btn-luxury-primary py-3 rounded-full text-xs font-sub uppercase font-bold tracking-wider cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
