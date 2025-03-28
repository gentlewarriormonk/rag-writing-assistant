"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Preparing your cosmic journey..." 
}) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState(0);

  // Simulate loading process with multiple phases
  useEffect(() => {
    const phases = [
      "Initializing space environment...",
      "Connecting to cosmic entities...",
      "Aligning star systems...",
      "Loading Kaku's consciousness..."
    ];

    // Increment progress smoothly
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + 0.5;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, 50);

    // Change loading messages
    const phaseInterval = setInterval(() => {
      setLoadingPhase(prev => {
        const newPhase = prev + 1;
        if (newPhase >= phases.length) {
          clearInterval(phaseInterval);
          return phases.length - 1;
        }
        return newPhase;
      });
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(phaseInterval);
    };
  }, []);

  const phases = [
    "Initializing space environment...",
    "Connecting to cosmic entities...",
    "Aligning star systems...",
    "Loading Kaku's consciousness..."
  ];

  return (
    <div className="fixed inset-0 bg-cosmic-black flex flex-col items-center justify-center z-[100]">
      {/* Background nebula effect */}
      <div 
        className="absolute inset-0 bg-gradient-radial from-cosmic-purple/10 via-cosmic-black to-cosmic-black opacity-70"
        style={{ 
          background: 'radial-gradient(circle at center, rgba(107, 70, 193, 0.15) 0%, rgba(10, 10, 20, 0) 70%)'
        }}
      ></div>
      
      {/* Animated stars */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-stellar-white"
          style={{
            width: Math.random() * 3 + 1 + 'px',
            height: Math.random() * 3 + 1 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
          }}
          animate={{ 
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{ 
            duration: 3 + Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 3
          }}
        />
      ))}
      
      {/* Kaku logo/shape placeholder */}
      <motion.div
        className="w-24 h-24 mb-8 relative"
        animate={{ 
          rotate: 360,
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        <motion.div 
          className="absolute inset-0 rounded-full bg-gradient-to-r from-nebula-blue to-cosmic-purple opacity-30"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute inset-4 rounded-full bg-cosmic-black"
        />
        <motion.div 
          className="absolute inset-8 rounded-full bg-gradient-to-r from-nebula-blue to-cosmic-teal"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
      
      {/* Loading text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={loadingPhase}
          className="text-stellar-white text-lg mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          {phases[loadingPhase]}
        </motion.p>
      </AnimatePresence>
      
      {/* Progress bar */}
      <div className="w-64 h-1 bg-stellar-white/20 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-nebula-blue to-cosmic-teal"
          initial={{ width: '0%' }}
          animate={{ width: `${loadingProgress}%` }}
          transition={{ ease: "easeInOut" }}
        />
      </div>
      
      <p className="text-sm text-stellar-white/50 mt-8 max-w-xs text-center">
        {message}
      </p>
    </div>
  );
};

export default LoadingScreen; 