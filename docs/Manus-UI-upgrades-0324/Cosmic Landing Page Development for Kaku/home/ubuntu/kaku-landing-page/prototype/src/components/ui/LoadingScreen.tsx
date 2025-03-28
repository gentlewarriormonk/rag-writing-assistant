'use client';

import React, { useEffect } from 'react';
import { useAccessibility } from '@/context/AccessibilityContext';

interface LoadingScreenProps {
  onLoadComplete?: () => void;
  minDuration?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onLoadComplete,
  minDuration = 2000
}) => {
  const [progress, setProgress] = React.useState(0);
  const [isComplete, setIsComplete] = React.useState(false);
  const { reducedMotion } = useAccessibility();

  useEffect(() => {
    const startTime = Date.now();
    let animationFrameId: number;

    // Skip animation if reduced motion is enabled
    if (reducedMotion) {
      setProgress(100);
      setIsComplete(true);
      if (onLoadComplete) {
        onLoadComplete();
      }
      return;
    }

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min(100, (elapsed / minDuration) * 100);
      
      setProgress(calculatedProgress);
      
      if (calculatedProgress < 100) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setIsComplete(true);
        if (onLoadComplete) {
          onLoadComplete();
        }
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [minDuration, onLoadComplete, reducedMotion]);

  return (
    <div className={`loading-screen fixed inset-0 bg-black z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="w-32 h-32 mb-8 relative">
        <div className="w-full h-full rounded-full border-4 border-gray-700 absolute"></div>
        <div 
          className="w-full h-full rounded-full border-4 border-blue-500 absolute"
          style={{ 
            clipPath: `polygon(0% 0%, ${progress}% 0%, ${progress}% 100%, 0% 100%)`,
            transition: 'clip-path 0.3s ease-out'
          }}
        ></div>
        <div className="w-24 h-24 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
            <span className="text-white text-xl">Kaku</span>
          </div>
        </div>
      </div>
      
      <p className="text-white text-xl mb-2">Loading Cosmic Experience</p>
      <p className="text-gray-400 text-sm">{Math.round(progress)}%</p>
    </div>
  );
};

export default LoadingScreen;
