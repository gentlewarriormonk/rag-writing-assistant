"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '@/components/layout/SectionWrapper';
import { useAppContext } from '@/context/AppContext';
import { useSound } from '@/hooks/useSound';
import { SOUNDS } from '@/lib/sounds';
import { Typewriter } from '@/components/ui/Typewriter';
import KakuCharacter from '@/components/character/KakuCharacter';

interface IntroSectionProps {
  id: string;
}

const IntroSection: React.FC<IntroSectionProps> = ({ id }) => {
  const [arrivalComplete, setArrivalComplete] = useState(false);
  const [showText, setShowText] = useState(false);
  const { setKakuEmotion } = useAppContext();
  const { playSound } = useSound();

  useEffect(() => {
    // Simplified arrival - in a real implementation, this would use KakuArrivalAnimation
    const timer = setTimeout(() => {
      setArrivalComplete(true);
      playSound(SOUNDS.BOOP);
      setKakuEmotion('happy');
      
      // Delay showing text slightly after arrival
      setTimeout(() => setShowText(true), 500);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [playSound, setKakuEmotion]);

  return (
    <SectionWrapper id={id} className="h-[150vh]">
      {arrivalComplete && (
        <div className="flex flex-col items-center justify-center h-full pt-40">
          {/* Position Kaku after arrival */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <KakuCharacter size="medium" emotion="happy" />
          </motion.div>

          {showText && (
            <div className="text-center max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold font-display mb-4 bg-gradient-to-r from-nebula-blue to-cosmic-teal text-transparent bg-clip-text">
                <Typewriter 
                  text="Boop boop beep! I'm Kaku!" 
                  speed={50} 
                  onComplete={() => playSound(SOUNDS.CHIME)} 
                />
              </h1>
              <motion.p
                className="text-xl md:text-2xl text-stellar-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.0 }}
              >
                I've traveled across the cosmos to help you discover your creative voice!
              </motion.p>
              
              {/* Add scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 3.0 }}
                className="mt-12 animate-bounce"
              >
                <svg 
                  className="w-8 h-8 mx-auto text-cosmic-teal" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
                <p className="text-sm text-stellar-white/60 mt-1">Scroll Down</p>
              </motion.div>
            </div>
          )}
        </div>
      )}
    </SectionWrapper>
  );
};

export default IntroSection; 