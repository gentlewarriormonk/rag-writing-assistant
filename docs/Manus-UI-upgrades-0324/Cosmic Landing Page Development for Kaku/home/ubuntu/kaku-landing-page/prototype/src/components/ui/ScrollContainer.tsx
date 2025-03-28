'use client';

import React, { useRef, useEffect } from 'react';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useLanding } from '@/context/LandingContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollContainerProps {
  children: React.ReactNode;
  smoothScrolling?: boolean;
  onSectionChange?: (section: string) => void;
}

const ScrollContainer: React.FC<ScrollContainerProps> = ({
  children,
  smoothScrolling = true,
  onSectionChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useAccessibility();
  const { handleSectionChange } = useLanding();
  
  // Initialize scroll behavior
  useEffect(() => {
    if (!containerRef.current) return;
    
    // In a full implementation, we would initialize Locomotive Scroll here
    // For the prototype, we'll use a simplified approach with GSAP ScrollTrigger
    
    // Disable smooth scrolling if reduced motion is enabled
    const useSmooth = smoothScrolling && !reducedMotion;
    
    // Set up scroll triggers for each section
    const sections = containerRef.current.querySelectorAll('section[id]');
    
    sections.forEach((section) => {
      const sectionId = section.id;
      
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          if (onSectionChange) {
            onSectionChange(sectionId);
          }
          // Use the section ID to update the landing context
          handleSectionChange(sectionId as any);
        },
        onEnterBack: () => {
          if (onSectionChange) {
            onSectionChange(sectionId);
          }
          // Use the section ID to update the landing context
          handleSectionChange(sectionId as any);
        }
      });
    });
    
    // Set up animations for elements with data-animate attribute
    const animatedElements = containerRef.current.querySelectorAll('[data-animate]');
    
    animatedElements.forEach((element) => {
      gsap.fromTo(
        element,
        { 
          opacity: 0, 
          y: 50 
        },
        {
          opacity: 1,
          y: 0,
          duration: reducedMotion ? 0.1 : 0.8,
          scrollTrigger: {
            trigger: element,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
    
    return () => {
      // Clean up all ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [smoothScrolling, reducedMotion, onSectionChange, handleSectionChange]);
  
  // Method to programmatically scroll to a section
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth'
      });
    }
  };
  
  // Expose scrollToSection method to window for other components to use
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).kakuScrollToSection = scrollToSection;
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).kakuScrollToSection;
      }
    };
  }, [reducedMotion]);
  
  return (
    <div 
      ref={containerRef} 
      className="scroll-container"
    >
      {children}
    </div>
  );
};

export default ScrollContainer;
