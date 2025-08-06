import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';

interface SplashPageProps {
  onComplete: () => void;
}

export function SplashPage({ onComplete }: SplashPageProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // 3-4초 자동 전환
    const timer = setTimeout(() => {
      handleComplete();
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 500); // 페이드아웃 애니메이션 시간
  };

  const handleSkip = () => {
    if (!isExiting) {
      handleComplete();
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center relative cursor-pointer bg-gradient-primary"
      onClick={handleSkip}
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Content */}
      <motion.div
        className="flex flex-col items-center text-center px-8 max-w-lg relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Brand Logo */}
        <motion.div
          className="relative mb-12"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.3,
            type: "spring",
            bounce: 0.3
          }}
        >
          <div className="w-24 h-24 bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-6 mx-auto border border-white/20">
            <span className="text-5xl">🏛️</span>
          </div>
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-white mb-8 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          PolyFit
        </motion.h1>

        {/* Main Tagline */}
        <motion.p
          className="text-xl text-white/90 mb-4 font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          내 상황에 딱 맞는 정책 찾기
        </motion.p>

        {/* Sub Message */}
        <motion.p
          className="text-base text-white/75 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          PolyFit과 함께 시작하세요
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <Button
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300 px-8 py-3 rounded-xl backdrop-blur-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              handleSkip();
            }}
          >
            시작하기
          </Button>
        </motion.div>
      </motion.div>

      {/* Skip Instructions */}
      <motion.div
        className="absolute bottom-8 left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.3 }}
      >
        <p className="text-sm text-white/60">
          화면을 터치하여 건너뛰기
        </p>
      </motion.div>

      {/* Trust Badge */}
      <motion.div
        className="absolute top-8 right-8 hidden md:block"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <div className="bg-gray-900/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 text-xs text-white/80 font-medium">
          정부 공인 서비스
        </div>
      </motion.div>
    </motion.div>
  );
}