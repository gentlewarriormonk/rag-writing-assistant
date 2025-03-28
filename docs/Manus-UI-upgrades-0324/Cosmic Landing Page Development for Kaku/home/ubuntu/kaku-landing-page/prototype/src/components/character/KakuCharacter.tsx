'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccessibility } from '@/context/AccessibilityContext';

interface KakuCharacterProps {
  emotion?: 'neutral' | 'happy' | 'curious' | 'excited' | 'thoughtful';
  size?: 'small' | 'medium' | 'large';
  animation?: 'idle' | 'arrival' | 'greeting' | 'pointing' | 'celebration';
  position?: { x: number; y: number };
  onAnimationComplete?: () => void;
}

const KakuCharacter: React.FC<KakuCharacterProps> = ({
  emotion = 'happy',
  size = 'medium',
  animation = 'idle',
  position,
  onAnimationComplete
}) => {
  const kakuRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [glowIntensity, setGlowIntensity] = useState(0.5);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const { reducedMotion } = useAccessibility();
  
  // Emotion variants
  const emotionVariants = {
    neutral: {
      eyes: { d: "M5,10 A2,2 0 0,0 9,10", fill: "#FFFFFF" },
      mouth: { d: "M4,15 Q7,16 10,15", stroke: "#FFFFFF", fill: "none" }
    },
    happy: {
      eyes: { d: "M5,10 A2,2 0 0,0 9,10", fill: "#FFFFFF" },
      mouth: { d: "M4,15 Q7,18 10,15", stroke: "#FFFFFF", fill: "none" }
    },
    curious: {
      eyes: { d: "M5,10 A2,2 0 0,0 9,10", fill: "#FFFFFF" },
      mouth: { d: "M4,15 Q7,16 10,15", stroke: "#FFFFFF", fill: "none" }
    },
    excited: {
      eyes: { d: "M5,9 A2,2 0 0,0 9,9", fill: "#FFFFFF" },
      mouth: { d: "M4,15 Q7,19 10,15", stroke: "#FFFFFF", fill: "none" }
    },
    thoughtful: {
      eyes: { d: "M5,10 A2,2 0 0,0 9,10", fill: "#FFFFFF" },
      mouth: { d: "M4,15 Q7,15 10,15", stroke: "#FFFFFF", fill: "none" }
    }
  };
  
  // Size variants
  const sizeVariants = {
    small: { scale: 0.6 },
    medium: { scale: 1 },
    large: { scale: 1.4 }
  };
  
  // Animation for arrival sequence
  useEffect(() => {
    if (animation === 'arrival') {
      setIsAnimating(true);
      
      // Skip animation if reduced motion is enabled
      if (reducedMotion) {
        setIsAnimating(false);
        if (onAnimationComplete) {
          onAnimationComplete();
        }
        return;
      }
      
      const arrivalAnimation = async () => {
        // Animation implementation would be more sophisticated in a real project
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setIsAnimating(false);
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      };
      
      arrivalAnimation();
    }
  }, [animation, reducedMotion, onAnimationComplete]);
  
  // Glow pulse effect
  useEffect(() => {
    if (reducedMotion) return;
    
    const pulseInterval = setInterval(() => {
      setGlowIntensity(prev => {
        const newValue = prev + (Math.random() * 0.1 - 0.05);
        return Math.max(0.3, Math.min(0.7, newValue));
      });
    }, 500);
    
    return () => clearInterval(pulseInterval);
  }, [reducedMotion]);
  
  // Floating animation variants
  const floatingAnimation = reducedMotion
    ? {}
    : {
        y: [0, -10, 0],
        transition: {
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut"
        }
      };
  
  // Position styles
  const positionStyles = position
    ? { position: 'absolute', left: `${position.x}px`, top: `${position.y}px` }
    : {};
  
  return (
    <motion.div 
      ref={kakuRef}
      className="kaku-character relative"
      style={positionStyles}
      animate={{
        ...sizeVariants[size],
        ...floatingAnimation
      }}
      initial={animation === 'arrival' ? { scale: 0.1, opacity: 0 } : sizeVariants[size]}
    >
      <svg width="100" height="120" viewBox="0 0 100 120">
        {/* Cosmic Glow */}
        <motion.ellipse 
          cx="50" cy="40" rx="33" ry="38" 
          fill="none" 
          stroke="rgba(131, 195, 230, 0.5)" 
          strokeWidth="2"
          animate={{ 
            opacity: reducedMotion ? 0.5 : [0.3, 0.7, 0.3],
            stroke: [
              "rgba(131, 195, 230, 0.5)",
              `rgba(131, 195, 230, ${glowIntensity})`,
              "rgba(131, 195, 230, 0.5)"
            ]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3, 
            ease: "easeInOut" 
          }}
        />
        
        {/* Helmet/Head */}
        <ellipse cx="50" cy="40" rx="30" ry="35" fill="#000000" stroke="#FFFFFF" strokeWidth="3" />
        
        {/* Eyes */}
        <motion.circle 
          cx="40" cy="35" r="5" 
          fill="#FFFFFF"
          initial={emotionVariants[emotion].eyes}
          animate={emotionVariants[emotion].eyes}
          transition={{ duration: 0.5 }}
        />
        <motion.circle 
          cx="60" cy="35" r="5" 
          fill="#FFFFFF"
          initial={emotionVariants[emotion].eyes}
          animate={emotionVariants[emotion].eyes}
          transition={{ duration: 0.5 }}
        />
        
        {/* Mouth */}
        <motion.path
          initial={emotionVariants[emotion].mouth}
          animate={emotionVariants[emotion].mouth}
          transition={{ duration: 0.5 }}
          stroke="#FFFFFF"
          strokeWidth="2"
          fill="none"
        />
        
        {/* Body */}
        <ellipse cx="50" cy="90" rx="25" ry="30" fill="#FFFFFF" />
        
        {/* Arms */}
        <ellipse cx="25" cy="80" rx="8" ry="20" fill="#FFFFFF" transform="rotate(-20 25 80)" />
        <ellipse cx="75" cy="80" rx="8" ry="20" fill="#FFFFFF" transform="rotate(20 75 80)" />
      </svg>
      
      {/* Accessibility label */}
      <span className="sr-only">
        Kaku, a friendly cosmic AI assistant with a {emotion} expression
      </span>
    </motion.div>
  );
};

export default KakuCharacter;
