"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useSound } from '@/hooks/useSound';
import { SOUNDS } from '@/lib/sounds';

// Import components
import CosmicBackground from '@/components/cosmic/CosmicBackground';
import IntroSection from '@/components/journey/IntroSection';
import OriginSection from '@/components/journey/OriginSection';
import CharacterSection from '@/components/journey/CharacterSection';
import MissionSection from '@/components/journey/MissionSection';
import SignUpSection from '@/components/journey/SignUpSection';
import TransitionSection from '@/components/journey/TransitionSection';
import NavigationIndicators from '@/components/ui/NavigationIndicators';
import AccessibilityControls from '@/components/ui/AccessibilityControls';
import LoadingScreen from './ui/LoadingScreen';

const sections = [
  { id: 'intro', Component: IntroSection },
  { id: 'origin', Component: OriginSection },
  { id: 'character', Component: CharacterSection },
  { id: 'mission', Component: MissionSection },
  { id: 'signup', Component: SignUpSection },
  { id: 'transition', Component: TransitionSection },
];

const LandingPageClient: React.FC = () => {
  const { 
    setCurrentSection, 
    isReducedMotion, 
    isLoading, 
    setIsLoading,
    locomotiveScroll
  } = useAppContext();
  const { playSound, stopSound, isInitialized: soundsInitialized } = useSound();
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  // Simulate asset loading & sound initialization
  useEffect(() => {
    // In a real app, track loading of 3D models, textures, critical assets
    const timer = setTimeout(() => {
      setAssetsLoaded(true);
    }, 2000); // Simulate 2s load time

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (assetsLoaded && soundsInitialized) {
      setIsLoading(false);
      console.log("Loading complete");
    }
  }, [assetsLoaded, soundsInitialized, setIsLoading]);

  // Section observation for active state (instead of GSAP ScrollTrigger)
  useEffect(() => {
    if (isLoading || !locomotiveScroll) return;

    const handleScroll = ({ scroll }: { scroll: { y: number } }) => {
      const viewportHeight = window.innerHeight;
      const scrollPosition = scroll.y;
      
      // Find which section is most visible in the viewport
      let currentActiveSection = null;
      let maxVisiblePercentage = 0;
      
      sections.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (!element) return;
        
        const rect = element.getBoundingClientRect();
        const elementHeight = rect.height;
        const elementTop = rect.top + scrollPosition;
        const elementBottom = elementTop + elementHeight;
        
        // Calculate how much of the element is in the viewport
        const visibleTop = Math.max(elementTop, scrollPosition);
        const visibleBottom = Math.min(elementBottom, scrollPosition + viewportHeight);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visiblePercentage = visibleHeight / elementHeight;
        
        if (visiblePercentage > maxVisiblePercentage) {
          maxVisiblePercentage = visiblePercentage;
          currentActiveSection = id;
        }
      });
      
      if (currentActiveSection) {
        setCurrentSection(currentActiveSection);
      }
    };
    
    // Add Locomotive Scroll event listener
    locomotiveScroll.on('scroll', handleScroll);
    
    return () => {
      locomotiveScroll.off('scroll', handleScroll);
    };
  }, [isLoading, locomotiveScroll, setCurrentSection]);

  // Handle Ambient Sound - Play on first interaction
  useEffect(() => {
    if (isLoading || typeof window === 'undefined') return;
      
    const playAmbient = () => {
      playSound(SOUNDS.AMBIENT);
      window.removeEventListener('click', playAmbient);
      window.removeEventListener('scroll', playAmbient);
      window.removeEventListener('keydown', playAmbient);
    };
      
    window.addEventListener('click', playAmbient, { once: true });
    window.addEventListener('scroll', playAmbient, { once: true });
    window.addEventListener('keydown', playAmbient, { once: true });

    return () => {
      stopSound(SOUNDS.AMBIENT);
      window.removeEventListener('click', playAmbient);
      window.removeEventListener('scroll', playAmbient);
      window.removeEventListener('keydown', playAmbient);
    }
  }, [isLoading, playSound, stopSound]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <CosmicBackground />
      <AccessibilityControls />
      <NavigationIndicators sectionIds={sections.map(s => s.id)} />
      
      {/* Locomotive Scroll container */}
      <div className="scroll-container" data-scroll-container>
        {sections.map(({ id, Component }) => (
          <div key={id} data-scroll-section>
            <Component id={id} />
          </div>
        ))}
      </div>
    </>
  );
};

export default LandingPageClient; 