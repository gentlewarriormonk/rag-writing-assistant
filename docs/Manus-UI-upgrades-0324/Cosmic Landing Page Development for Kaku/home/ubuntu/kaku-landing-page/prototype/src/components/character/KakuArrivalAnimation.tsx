'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccessibility } from '@/context/AccessibilityContext';

interface KakuArrivalAnimationProps {
  onComplete?: () => void;
  speed?: 'slow' | 'normal' | 'fast';
  skipAnimation?: boolean;
}

const KakuArrivalAnimation: React.FC<KakuArrivalAnimationProps> = ({
  onComplete,
  speed = 'normal',
  skipAnimation = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationPhase, setAnimationPhase] = React.useState<'approach' | 'orbit' | 'zoom' | 'reveal' | 'complete'>('approach');
  const [progress, setProgress] = React.useState(0);
  
  const { reducedMotion } = useAccessibility();
  
  // Speed multiplier based on speed prop
  const speedMultiplier = {
    slow: 1.5,
    normal: 1,
    fast: 0.7
  }[speed];
  
  // Skip animation if reduced motion is enabled or skipAnimation is true
  useEffect(() => {
    if (reducedMotion || skipAnimation) {
      setAnimationPhase('complete');
      setProgress(1);
      if (onComplete) {
        onComplete();
      }
    }
  }, [reducedMotion, skipAnimation, onComplete]);
  
  // Handle animation phases
  useEffect(() => {
    if (reducedMotion || skipAnimation) return;
    
    const animationDurations = {
      approach: 2000 * speedMultiplier,
      orbit: 1500 * speedMultiplier,
      zoom: 1000 * speedMultiplier,
      reveal: 1500 * speedMultiplier
    };
    
    let timeoutId: NodeJS.Timeout;
    
    const advancePhase = () => {
      setAnimationPhase(current => {
        switch (current) {
          case 'approach':
            return 'orbit';
          case 'orbit':
            return 'zoom';
          case 'zoom':
            return 'reveal';
          case 'reveal':
            return 'complete';
          default:
            return current;
        }
      });
    };
    
    if (animationPhase !== 'complete') {
      const currentDuration = animationDurations[animationPhase];
      
      // Progress animation
      const startTime = Date.now();
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min(1, elapsed / currentDuration);
        setProgress(newProgress);
        
        if (newProgress < 1) {
          requestAnimationFrame(updateProgress);
        } else {
          advancePhase();
        }
      };
      
      requestAnimationFrame(updateProgress);
      
      // Set timeout as a fallback
      timeoutId = setTimeout(advancePhase, currentDuration + 100);
    } else if (onComplete) {
      onComplete();
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [animationPhase, speedMultiplier, reducedMotion, skipAnimation, onComplete]);
  
  // Animation variants for each phase
  const kakuVariants = {
    approach: {
      x: progress * 300 - 300,
      y: progress * 100 - 200,
      scale: 0.2 + progress * 0.3,
      opacity: 0.3 + progress * 0.7
    },
    orbit: {
      x: Math.sin(progress * Math.PI * 2) * 150,
      y: Math.cos(progress * Math.PI * 2) * 100 - 100,
      scale: 0.5,
      opacity: 1
    },
    zoom: {
      x: progress * 0,
      y: progress * -50 - 50,
      scale: 0.5 + progress * 0.5,
      opacity: 1
    },
    reveal: {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1
    },
    complete: {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1
    }
  };
  
  return (
    <div 
      ref={containerRef} 
      className="kaku-arrival-animation relative w-full h-full flex items-center justify-center"
      aria-label={
        animationPhase === 'complete' 
          ? "Kaku has arrived" 
          : `Kaku is arriving - ${animationPhase} phase, ${Math.round(progress * 100)}% complete`
      }
    >
      <motion.div
        className="kaku-container"
        animate={kakuVariants[animationPhase]}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20
        }}
      >
        {/* This would contain the KakuCharacter component in a real implementation */}
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
          <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center">
            <div className="text-white text-2xl">Kaku</div>
          </div>
        </div>
      </motion.div>
      
      {/* Particle effects would be added here in a real implementation */}
    </div>
  );
};

export default KakuArrivalAnimation;
