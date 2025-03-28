"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';

type Emotion = 'neutral' | 'happy' | 'curious' | 'excited' | 'thoughtful' | 'encouraging' | 'playful';

interface KakuCharacterProps {
  emotion?: Emotion;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const emotionColors = {
  neutral: '#83C3E6', // Soft blue (kaku-neutral)
  happy: '#83C3E6',
  curious: '#9F7AEA', // Purple (kaku-thoughtful)
  excited: '#FFD166', // Warm yellow (kaku-excited)
  thoughtful: '#9F7AEA',
  encouraging: '#48BB78', // Green (kaku-encouraging)
  playful: '#F687B3', // Pink (kaku-playful)
};

const KakuCharacter: React.FC<KakuCharacterProps> = ({
  emotion: propEmotion,
  size = 'medium',
  className = ''
}) => {
  const { kakuEmotion: contextEmotion, isReducedMotion } = useAppContext();
  const currentEmotion = propEmotion || contextEmotion;

  const sizeMap = {
    small: 'w-16 h-20 md:w-20 md:h-24',
    medium: 'w-24 h-30 md:w-32 md:h-40',
    large: 'w-40 h-48 md:w-48 md:h-56',
  };

  const floatVariants: Variants = {
    initial: { y: 0 },
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className={`${sizeMap[size]} relative ${className}`}
      variants={!isReducedMotion ? floatVariants : undefined}
      initial="initial"
      animate="animate"
    >
      {/* Simplified SVG Kaku - Replace with detailed SVG or 3D model */}
      <svg width="100%" height="100%" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Optional Glow Effect */}
        {!isReducedMotion && (
          <motion.ellipse
            cx="50" cy="40" rx="38" ry="43" // Slightly larger than head
            stroke={emotionColors[currentEmotion]}
            strokeWidth="3"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            filter="url(#glow)"
          />
        )}

        {/* Body */}
        <ellipse cx="50" cy="90" rx="25" ry="30" fill="#F0F0FF"/>
        {/* Head */}
        <ellipse cx="50" cy="40" rx="30" ry="35" fill="#0A0A14" stroke="#F0F0FF" strokeWidth="2"/>
        {/* Eyes */}
        <circle cx="40" cy="35" r="4" fill="#F0F0FF"/>
        <circle cx="60" cy="35" r="4" fill="#F0F0FF"/>
        {/* Mouth - Simple smile */}
        <path d="M45 50 Q 50 55 55 50" stroke="#F0F0FF" strokeWidth="2"/>

        {/* Glow Filter Definition */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>
    </motion.div>
  );
};

export default KakuCharacter; 