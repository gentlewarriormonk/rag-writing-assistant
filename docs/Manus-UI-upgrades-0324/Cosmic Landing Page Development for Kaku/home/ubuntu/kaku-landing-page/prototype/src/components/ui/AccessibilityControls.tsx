'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAccessibility } from '@/context/AccessibilityContext';

interface AccessibilityControlsProps {
  onReducedMotionChange?: (enabled: boolean) => void;
  onSoundToggle?: (enabled: boolean) => void;
  initialReducedMotion?: boolean;
  initialSoundEnabled?: boolean;
}

const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
  onReducedMotionChange,
  onSoundToggle,
  initialReducedMotion = false,
  initialSoundEnabled = true
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { 
    reducedMotion, 
    setReducedMotion, 
    soundEnabled, 
    setSoundEnabled 
  } = useAccessibility();

  // Toggle controls expansion
  const toggleControls = () => {
    setIsExpanded(!isExpanded);
  };

  // Toggle reduced motion setting
  const toggleReducedMotion = () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    if (onReducedMotionChange) {
      onReducedMotionChange(newValue);
    }
  };

  // Toggle sound setting
  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    if (onSoundToggle) {
      onSoundToggle(newValue);
    }
  };

  return (
    <div className="accessibility-controls fixed bottom-4 right-4 z-50">
      <motion.div
        className="controls-container bg-black bg-opacity-70 rounded-lg overflow-hidden"
        initial={{ width: 'auto', height: 'auto' }}
        animate={{ 
          width: isExpanded ? 'auto' : 'auto',
          height: isExpanded ? 'auto' : 'auto'
        }}
      >
        <button
          className="toggle-button p-3 w-full flex items-center justify-between text-white"
          onClick={toggleControls}
          aria-expanded={isExpanded}
          aria-controls="accessibility-options"
        >
          <span className="sr-only">Accessibility options</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 8v8"></path>
            <path d="M8 12h8"></path>
          </svg>
          {isExpanded && <span className="ml-2">Accessibility</span>}
        </button>

        {isExpanded && (
          <div 
            id="accessibility-options"
            className="options-container p-3 space-y-3"
          >
            <button
              className={`option-button w-full flex items-center justify-between p-2 rounded ${
                reducedMotion ? 'bg-blue-600' : 'bg-gray-700'
              }`}
              onClick={toggleReducedMotion}
              aria-pressed={reducedMotion}
            >
              <span className="text-white">Reduced Motion</span>
              <div className={`toggle-switch w-10 h-6 rounded-full p-1 ${
                reducedMotion ? 'bg-blue-400' : 'bg-gray-500'
              }`}>
                <motion.div 
                  className="w-4 h-4 bg-white rounded-full"
                  animate={{ x: reducedMotion ? 16 : 0 }}
                />
              </div>
            </button>

            <button
              className={`option-button w-full flex items-center justify-between p-2 rounded ${
                soundEnabled ? 'bg-blue-600' : 'bg-gray-700'
              }`}
              onClick={toggleSound}
              aria-pressed={soundEnabled}
            >
              <span className="text-white">Sound</span>
              <div className={`toggle-switch w-10 h-6 rounded-full p-1 ${
                soundEnabled ? 'bg-blue-400' : 'bg-gray-500'
              }`}>
                <motion.div 
                  className="w-4 h-4 bg-white rounded-full"
                  animate={{ x: soundEnabled ? 16 : 0 }}
                />
              </div>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AccessibilityControls;
