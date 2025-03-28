"use client";

import React, { createContext, useState, useContext, useRef, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { useSound } from '@/hooks/useSound';
import LocomotiveScroll from 'locomotive-scroll';

type Emotion = 'neutral' | 'happy' | 'curious' | 'excited' | 'thoughtful' | 'encouraging' | 'playful';

interface AppContextProps {
  currentSection: string | null;
  setCurrentSection: Dispatch<SetStateAction<string | null>>;
  isSoundEnabled: boolean;
  toggleSound: () => boolean; // Returns the new state
  isReducedMotion: boolean;
  toggleReducedMotion: () => boolean; // Returns the new state
  kakuEmotion: Emotion;
  setKakuEmotion: Dispatch<SetStateAction<Emotion>>;
  isLandingComplete: boolean;
  setLandingComplete: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  locomotiveScroll: LocomotiveScroll | null;
  scrollTo: (target: string | HTMLElement, options?: any) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentSection, setCurrentSection] = useState<string | null>('intro'); // Start at intro
  const [kakuEmotion, setKakuEmotion] = useState<Emotion>('neutral');
  const [isLandingComplete, setLandingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Assume loading initially
  const [isReducedMotion, setIsReducedMotionState] = useState(false);
  const { isSoundEnabled, toggleSound } = useSound();
  
  const locomotiveRef = useRef<LocomotiveScroll | null>(null);

  // Initialize Locomotive Scroll
  useEffect(() => {
    if (typeof window === 'undefined' || isLoading || isReducedMotion) return;

    // Clean up previous instance if it exists
    if (locomotiveRef.current) {
      locomotiveRef.current.destroy();
    }

    const scrollContainerElement = document.querySelector('.scroll-container');
    if (scrollContainerElement) {
      const locomotiveScroll = new LocomotiveScroll({
        el: scrollContainerElement,
        smooth: true, 
        multiplier: 1.0,
        lerp: 0.1, // Linear interpolation, smooth value
        smartphone: {
          smooth: false
        },
        tablet: {
          smooth: false
        }
      });

      locomotiveRef.current = locomotiveScroll;
      
      // Update locomotive scroll on resize
      const handleResize = () => {
        setTimeout(() => {
          locomotiveScroll.update();
        }, 300);
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        locomotiveScroll.destroy();
        locomotiveRef.current = null;
      };
    }
  }, [isLoading, isReducedMotion]);

  // Scroll to a specific element
  const scrollTo = (target: string | HTMLElement, options = {}) => {
    if (!locomotiveRef.current) return;
    
    locomotiveRef.current.scrollTo(target, {
      offset: -50,
      duration: 1000,
      ...options
    });
  };

  // Load reduced motion preference on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const savedPreference = localStorage.getItem('kakuReducedMotion');

    const setMotion = (reduce: boolean) => {
      setIsReducedMotionState(reduce);
      document.body.classList.toggle('reduced-motion', reduce);
    };

    if (savedPreference !== null) {
      setMotion(JSON.parse(savedPreference));
    } else {
      setMotion(mediaQuery.matches); // Default to system preference
    }

    const handleChange = (event: MediaQueryListEvent) => {
      // Only update if no user preference is saved
      if (localStorage.getItem('kakuReducedMotion') === null) {
        setMotion(event.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleReducedMotion = () => {
    const newState = !isReducedMotion;
    setIsReducedMotionState(newState);
    document.body.classList.toggle('reduced-motion', newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kakuReducedMotion', JSON.stringify(newState));
    }
    
    // Reinitialize locomotive scroll when motion preference changes
    if (locomotiveRef.current) {
      locomotiveRef.current.destroy();
      locomotiveRef.current = null;
      
      if (!newState) {
        // Schedule re-initialization on next tick after state update
        setTimeout(() => {
          const scrollContainer = document.querySelector('.scroll-container');
          if (scrollContainer) {
            locomotiveRef.current = new LocomotiveScroll({
              el: scrollContainer,
              smooth: true,
              multiplier: 1.0,
              lerp: 0.1,
            });
          }
        }, 0);
      }
    }
    
    return newState;
  };

  return (
    <AppContext.Provider value={{
      currentSection,
      setCurrentSection,
      isSoundEnabled,
      toggleSound,
      isReducedMotion,
      toggleReducedMotion,
      kakuEmotion,
      setKakuEmotion,
      isLandingComplete,
      setLandingComplete,
      isLoading,
      setIsLoading,
      locomotiveScroll: locomotiveRef.current,
      scrollTo,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 