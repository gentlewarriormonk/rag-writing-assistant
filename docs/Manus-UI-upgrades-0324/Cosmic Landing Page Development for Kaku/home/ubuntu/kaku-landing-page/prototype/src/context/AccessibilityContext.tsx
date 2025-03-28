'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessibilityContextType {
  reducedMotion: boolean;
  setReducedMotion: (enabled: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  // Check system preference for reduced motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setReducedMotion(prefersReducedMotion);

      // Listen for changes in system preference
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const handleChange = (e: MediaQueryListEvent) => {
        setReducedMotion(e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Check for saved preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedReducedMotion = localStorage.getItem('kakuReducedMotion');
      const savedSoundEnabled = localStorage.getItem('kakuSoundEnabled');
      const savedHighContrast = localStorage.getItem('kakuHighContrast');

      if (savedReducedMotion !== null) {
        setReducedMotion(savedReducedMotion === 'true');
      }
      if (savedSoundEnabled !== null) {
        setSoundEnabled(savedSoundEnabled === 'true');
      }
      if (savedHighContrast !== null) {
        setHighContrast(savedHighContrast === 'true');
      }
    }
  }, []);

  // Save preferences when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kakuReducedMotion', reducedMotion.toString());
      localStorage.setItem('kakuSoundEnabled', soundEnabled.toString());
      localStorage.setItem('kakuHighContrast', highContrast.toString());
    }
  }, [reducedMotion, soundEnabled, highContrast]);

  return (
    <AccessibilityContext.Provider
      value={{
        reducedMotion,
        setReducedMotion,
        soundEnabled,
        setSoundEnabled,
        highContrast,
        setHighContrast
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
