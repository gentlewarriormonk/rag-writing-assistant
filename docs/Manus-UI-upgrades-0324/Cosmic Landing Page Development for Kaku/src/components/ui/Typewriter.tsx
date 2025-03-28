"use client";

import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

interface TypewriterProps {
  text: string;
  speed?: number; // Milliseconds per character
  className?: string;
  onComplete?: () => void;
}

export const Typewriter: React.FC<TypewriterProps> = ({ 
  text, 
  speed = 50, 
  className, 
  onComplete 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const { isReducedMotion } = useAppContext();

  useEffect(() => {
    setDisplayedText(''); // Reset on text change
    
    if (isReducedMotion) {
      // Skip animation if reduced motion is enabled
      setDisplayedText(text);
      if (onComplete) {
        onComplete();
      }
      return;
    }
    
    if (text) {
      let i = 0;
      const intervalId = setInterval(() => {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
        if (i === text.length) {
          clearInterval(intervalId);
          if (onComplete) {
            onComplete();
          }
        }
      }, speed);
      return () => clearInterval(intervalId);
    }
  }, [text, speed, onComplete, isReducedMotion]);

  // Using span with min-height to prevent layout shifts
  return (
    <span className={className} style={{ minHeight: '1.2em', display: 'inline-block' }}>
      {displayedText}
    </span>
  );
}; 