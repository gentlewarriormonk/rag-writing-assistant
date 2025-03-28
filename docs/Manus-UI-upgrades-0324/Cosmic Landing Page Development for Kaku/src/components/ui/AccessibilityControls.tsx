"use client";

import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { motion } from 'framer-motion';

const AccessibilityControls: React.FC = () => {
  const { isSoundEnabled, toggleSound, isReducedMotion, toggleReducedMotion } = useAppContext();

  return (
    <div className="fixed bottom-4 left-4 z-50 flex gap-2">
      <motion.button
        onClick={toggleSound}
        className={`text-xs px-3 py-1 rounded-md ${
          isSoundEnabled 
            ? 'bg-nebula-blue/20 border border-nebula-blue text-stellar-white' 
            : 'bg-cosmic-black/50 border border-stellar-white/40 text-stellar-white/70'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Sound is ${isSoundEnabled ? 'on' : 'off'}`}
      >
        <span className="sr-only">Sound:</span>
        {isSoundEnabled 
          ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
            </svg>
          ) 
          : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )
        }
        Sound
      </motion.button>
      
      <motion.button
        onClick={toggleReducedMotion}
        className={`text-xs px-3 py-1 rounded-md ${
          isReducedMotion 
            ? 'bg-nebula-blue/20 border border-nebula-blue text-stellar-white' 
            : 'bg-cosmic-black/50 border border-stellar-white/40 text-stellar-white/70'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Motion is ${isReducedMotion ? 'reduced' : 'full'}`}
      >
        <span className="sr-only">Motion:</span>
        {isReducedMotion 
          ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          ) 
          : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4zM8 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H9a1 1 0 01-1-1V4zM15 3a1 1 0 00-1 1v12a1 1 0 001 1h2a1 1 0 001-1V4a1 1 0 00-1-1h-2z" />
            </svg>
          )
        }
        Motion
      </motion.button>
    </div>
  );
};

export default AccessibilityControls; 