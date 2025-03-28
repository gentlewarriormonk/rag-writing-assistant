'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAccessibility } from '@/context/AccessibilityContext';

interface NavigationIndicatorsProps {
  sections: string[];
  currentSection: string;
  scrollProgress: number;
}

const NavigationIndicators: React.FC<NavigationIndicatorsProps> = ({
  sections,
  currentSection,
  scrollProgress
}) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const [indicatorPositions, setIndicatorPositions] = React.useState<Record<string, number>>({});
  const { reducedMotion } = useAccessibility();

  // Update indicator positions based on sections
  React.useEffect(() => {
    const positions: Record<string, number> = {};
    sections.forEach((section, index) => {
      positions[section] = (index / (sections.length - 1)) * 100;
    });
    setIndicatorPositions(positions);
  }, [sections]);

  // Toggle visibility of indicators
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // Scroll to specific section
  const scrollToSection = (section: string) => {
    // Use the global function exposed by ScrollContainer
    if (typeof window !== 'undefined' && (window as any).kakuScrollToSection) {
      (window as any).kakuScrollToSection(section);
    } else {
      // Fallback
      const sectionElement = document.getElementById(section);
      if (sectionElement) {
        sectionElement.scrollIntoView({
          behavior: reducedMotion ? 'auto' : 'smooth'
        });
      }
    }
  };

  return (
    <div className="navigation-indicators fixed right-6 top-1/2 transform -translate-y-1/2 z-40">
      <motion.div
        className="indicators-container"
        initial={{ opacity: 1 }}
        animate={{ opacity: isVisible ? 1 : 0.3 }}
        onHoverStart={() => setIsVisible(true)}
        onHoverEnd={() => setIsVisible(true)}
      >
        <div className="progress-bar-container h-40 w-1 bg-gray-600 rounded-full relative mx-auto mb-2">
          <motion.div 
            className="progress-indicator w-1 bg-white rounded-full absolute top-0"
            style={{ height: `${scrollProgress * 100}%` }}
          />
        </div>

        <div className="section-indicators flex flex-col items-center space-y-4">
          {sections.map((section, index) => (
            <button
              key={section}
              className="indicator-button relative"
              onClick={() => scrollToSection(section)}
              aria-label={`Navigate to ${section} section`}
              aria-current={currentSection === section ? 'true' : 'false'}
              data-section-index={index}
            >
              <motion.div
                className={`w-3 h-3 rounded-full ${
                  currentSection === section ? 'bg-white' : 'bg-gray-500'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                animate={{ 
                  scale: currentSection === section ? 1.2 : 1,
                  backgroundColor: currentSection === section ? '#FFFFFF' : '#6B7280'
                }}
              />
              {isVisible && (
                <motion.span
                  className="indicator-label absolute left-5 top-0 text-xs text-white bg-black bg-opacity-70 px-2 py-1 rounded whitespace-nowrap"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </motion.span>
              )}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default NavigationIndicators;
