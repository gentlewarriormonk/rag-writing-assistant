'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Section = 'intro' | 'origin' | 'character' | 'mission' | 'signup' | 'chat';

interface LandingContextType {
  currentSection: Section;
  setCurrentSection: (section: Section) => void;
  landingProgress: number;
  setLandingProgress: (progress: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  hasInteracted: boolean;
  setHasInteracted: (interacted: boolean) => void;
  handleSectionChange: (section: Section) => void;
  handleComplete: () => void;
}

const LandingContext = createContext<LandingContextType | undefined>(undefined);

export const LandingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentSection, setCurrentSection] = useState<Section>('intro');
  const [landingProgress, setLandingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Handle section change
  const handleSectionChange = (section: Section) => {
    setCurrentSection(section);
    
    // Update progress based on section
    const progressMap: Record<Section, number> = {
      intro: 0,
      origin: 0.2,
      character: 0.4,
      mission: 0.6,
      signup: 0.8,
      chat: 1
    };
    
    setLandingProgress(progressMap[section]);
  };

  // Handle completion of landing experience
  const handleComplete = () => {
    setLandingProgress(1);
    // Additional completion logic could be added here
    console.log('Landing experience completed');
  };

  // Check for user interaction
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
      }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('scroll', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };
  }, [hasInteracted]);

  // Check device capabilities
  useEffect(() => {
    const checkDeviceCapabilities = () => {
      // This would be expanded in a real implementation
      const hasWebGL = (
        typeof window !== 'undefined' &&
        !!window.WebGLRenderingContext
      );
      
      console.log('WebGL support:', hasWebGL);
      // Additional capability checks would be added here
    };

    checkDeviceCapabilities();
  }, []);

  return (
    <LandingContext.Provider
      value={{
        currentSection,
        setCurrentSection,
        landingProgress,
        setLandingProgress,
        isLoading,
        setIsLoading,
        hasInteracted,
        setHasInteracted,
        handleSectionChange,
        handleComplete
      }}
    >
      {children}
    </LandingContext.Provider>
  );
};

export const useLanding = (): LandingContextType => {
  const context = useContext(LandingContext);
  if (context === undefined) {
    throw new Error('useLanding must be used within a LandingProvider');
  }
  return context;
};
