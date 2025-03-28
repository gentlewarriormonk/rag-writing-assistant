'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAccessibility } from '@/context/AccessibilityContext';

interface IntroSectionProps {
  onComplete?: () => void;
  isActive: boolean;
}

const IntroSection: React.FC<IntroSectionProps> = ({
  onComplete,
  isActive
}) => {
  const [textRevealProgress, setTextRevealProgress] = React.useState(0);
  const [hasGreeted, setHasGreeted] = React.useState(false);
  const { reducedMotion } = useAccessibility();

  // Handle Kaku's animation completion
  const handleKakuAnimationComplete = () => {
    setHasGreeted(true);
    revealText();
  };

  // Animate text reveal
  const revealText = () => {
    if (reducedMotion) {
      setTextRevealProgress(1);
      return;
    }

    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(1, elapsed / duration);
      setTextRevealProgress(newProgress);
      
      if (newProgress < 1) {
        requestAnimationFrame(updateProgress);
      } else if (onComplete) {
        setTimeout(onComplete, 1000);
      }
    };
    
    requestAnimationFrame(updateProgress);
  };

  // Show scroll prompt after text reveal
  const promptScroll = () => {
    // In a real implementation, this would show a scroll indicator
    console.log('Scroll to continue');
  };

  // Effect to trigger scroll prompt after text reveal
  React.useEffect(() => {
    if (textRevealProgress === 1) {
      promptScroll();
    }
  }, [textRevealProgress]);

  return (
    <section 
      id="intro" 
      className={`intro-section min-h-screen flex flex-col items-center justify-center p-4 ${isActive ? 'active' : ''}`}
    >
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* This would use the KakuArrivalAnimation component in a real implementation */}
        <div className="kaku-placeholder mb-8">
          <motion.div 
            className="w-32 h-32 bg-white rounded-full mx-auto flex items-center justify-center"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center">
              <div className="text-white text-2xl">Kaku</div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="greeting-text mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: hasGreeted ? 1 : 0, 
            y: hasGreeted ? 0 : 20 
          }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Boop boop beep! I'm Kaku!
          </h1>
        </motion.div>

        <motion.div
          className="intro-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: textRevealProgress, 
            y: 20 - (textRevealProgress * 20) 
          }}
        >
          <p className="text-xl text-gray-200 mb-6">
            I've traveled from the Helix Nebula to help you discover your voice through writing.
          </p>
          <p className="text-lg text-gray-300">
            Let me guide you on a journey to find your ikigai - your reason for being.
          </p>
        </motion.div>

        <motion.div
          className="scroll-indicator mt-12"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: textRevealProgress === 1 ? [0.3, 1, 0.3] : 0 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2, 
            ease: "easeInOut" 
          }}
        >
          <div className="w-8 h-12 border-2 border-white rounded-full mx-auto flex justify-center">
            <motion.div 
              className="w-1 h-3 bg-white rounded-full mt-2"
              animate={{ y: [0, 6, 0] }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5, 
                ease: "easeInOut" 
              }}
            />
          </div>
          <p className="text-sm text-gray-300 mt-2">Scroll to continue</p>
        </motion.div>
      </div>
    </section>
  );
};

export default IntroSection;
