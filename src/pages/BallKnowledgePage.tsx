import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { QUIZ_DATA, BALLKNOWLEDGE_DATA } from '../data/config';

interface BallKnowledgePageProps {
  onNavigate: (route: string) => void;
  onOpenLightbox?: (id: number) => void;
}

export default function BallKnowledgePage({ onNavigate, onOpenLightbox }: BallKnowledgePageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = QUIZ_DATA[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQuestion.answer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (currentIndex + 1 < QUIZ_DATA.length) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        setQuizFinished(true);
        // Trigger white/grey confetti burst on high score (>= 8)
        const finalScore = isCorrect ? score + 1 : score;
        if (finalScore >= 8) {
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#FFFFFF', '#D4D4D4', '#9A9A9A', '#525252'],
          });
        }
      }
    }, 1100);
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizFinished(false);
  };

  const getRank = () => {
    if (score >= 8) return 'CERTIFIED BALL KNOWER';
    if (score >= 5) return 'CASUAL FAN';
    return 'BENCH WARMER';
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
        <span>Tactical Athletics Repository</span>
      </div>

      {/* Page Title */}
      <div className="border-b border-white/12 pb-6 md:pb-10 mb-10 md:mb-16 w-full max-w-full">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-5xl sm:text-7xl md:text-9xl uppercase tracking-tight text-white break-words [overflow-wrap:break-word] max-w-full leading-none"
        >
          ELITE BALL KNOWLEDGE
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-sub text-[17px] md:text-2xl text-[#9A9A9A] font-semibold mt-2"
        >
          Only real ones know.
        </motion.p>
      </div>

      {/* Centered Large Dark Quiz Card with Animated Question Transitions (Vertical only to prevent sideways movement) */}
      <div className="max-w-3xl w-full mx-auto my-10 md:my-14 bg-[#111111] border border-white/12 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!quizFinished ? (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Top Streak & Progress */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 md:pb-6 mb-6 md:mb-8 text-xs font-sub uppercase tracking-wider">
                <div className="flex items-center space-x-3">
                  <span className="text-white font-semibold">
                    QUESTION {currentIndex + 1} / {QUIZ_DATA.length}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <motion.span
                    key={streak}
                    initial={{ scale: 1.4 }}
                    animate={{ scale: 1 }}
                    className="text-white font-mono font-bold"
                  >
                    STREAK: {streak}
                  </motion.span>
                </div>
                <div className="w-36 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-300 ease-out"
                    style={{ width: `${((currentIndex + 1) / QUIZ_DATA.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <h2 className="font-sub text-xl md:text-2xl font-bold text-white mb-10 leading-snug">
                {currentQuestion.q}
              </h2>

              {/* 4 Big Option Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, idx) => {
                  let btnStyle = 'border-white/12 bg-white/5 hover:border-white text-white';
                  if (isAnswered) {
                    if (idx === currentQuestion.answer) {
                      // Correct answer
                      btnStyle = 'border-white bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.5)]';
                    } else if (selectedOption === idx) {
                      // Wrong selection
                      btnStyle = 'border-white/20 bg-white/5 text-[#9A9A9A] opacity-40 animate-[wiggle_0.3s_ease-in-out]';
                    } else {
                      btnStyle = 'border-white/10 bg-transparent text-[#9A9A9A] opacity-40';
                    }
                  }

                  return (
                    <motion.button
                      key={idx}
                      whileHover={!isAnswered ? { scale: 1.02 } : {}}
                      whileTap={!isAnswered ? { scale: 0.98 } : {}}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full text-left p-4 sm:p-5 md:p-6 min-h-[56px] rounded-xl md:rounded-2xl border font-sub text-base transition-all duration-200 flex items-center justify-between group cursor-pointer ${btnStyle}`}
                    >
                      <span className="font-medium pr-3 text-base">{option}</span>
                      <span
                        className={`w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-xs font-mono shrink-0 ${
                          isAnswered && idx === currentQuestion.answer
                            ? 'border-black bg-black text-white'
                            : 'group-hover:border-white'
                        }`}
                      >
                        {isAnswered && idx === currentQuestion.answer ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          String.fromCharCode(65 + idx)
                        )}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            /* Quiz Results View with Animation */
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-center py-6 sm:py-10 space-y-5 md:space-y-6"
            >
              <span className="text-xs font-sub uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#9A9A9A] block font-mono">
                EXAMINATION CONCLUDED
              </span>
              <h2 className="font-display text-4xl sm:text-5xl md:text-7xl uppercase text-white tracking-tight break-words [overflow-wrap:break-word] max-w-full">
                {getRank()}
              </h2>
              <p className="font-sub text-[#9A9A9A] text-lg md:text-xl">
                Score: {score} / {QUIZ_DATA.length} ({Math.round((score / QUIZ_DATA.length) * 100)}% Accuracy)
              </p>

              <div className="pt-6 md:pt-8 w-full flex justify-center">
                <button
                  onClick={restartQuiz}
                  className="btn-luxury-primary w-full sm:w-auto min-h-[56px] md:h-18 px-10 rounded-full font-sub font-semibold text-base md:text-lg uppercase tracking-wider cursor-pointer justify-center"
                >
                  <span className="relative z-10">Retake Examination</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ball Knowledge Showcase Reel (Full Color Vibrant Imagery) */}
      <div className="my-16 md:my-24 border-t border-white/12 pt-10 md:pt-16 w-full max-w-full overflow-hidden">
        <div className="flex items-center justify-between mb-6 md:mb-10">
          <div>
            <span className="text-xs font-sub uppercase tracking-[0.2em] md:tracking-[0.25em] text-[#9A9A9A] block mb-1">
              TACTICAL ARCHIVES
            </span>
            <h3 className="font-display text-3xl sm:text-4xl md:text-6xl uppercase text-white">
              BALL ARCHIVE REEL
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-full">
          {BALLKNOWLEDGE_DATA.map((item) => (
            <motion.div
              key={item.id}
              onClick={() => onOpenLightbox && onOpenLightbox(200 + item.id)}
              data-cursor="Inspect"
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="bg-[#111111] hover:bg-[#1A1A1A] border border-white/12 hover:border-white/35 rounded-2xl md:rounded-3xl p-5 group transition-all duration-300 shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(255,255,255,0.06)] cursor-pointer w-full max-w-full"
            >
              <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-black relative">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover meme-media-vibrant"
                />
                <span className="absolute bottom-2 right-2 bg-black/75 px-2.5 py-0.5 rounded-full text-[9px] font-sub uppercase tracking-wider text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  Inspect
                </span>
              </div>
              <h4 className="font-display text-xl uppercase text-white mb-1 tracking-tight">
                {item.title}
              </h4>
              <p className="font-sub text-xs text-[#9A9A9A] leading-relaxed line-clamp-2">
                {item.caption}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
