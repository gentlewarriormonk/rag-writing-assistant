"use client";

import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { motion } from 'framer-motion';

interface NavigationIndicatorsProps {
  sectionIds: string[];
}

const NavigationIndicators: React.FC<NavigationIndicatorsProps> = ({ sectionIds }) => {
  const { currentSection } = useAppContext();

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-30 hidden md:block">
      <ul className="space-y-3">
        {sectionIds.map((id) => (
          <li key={id} className="flex items-center justify-end">
            <span 
              className={`text-xs uppercase mr-2 transition-opacity duration-300 ${
                currentSection === id ? 'opacity-100 text-cosmic-teal' : 'opacity-0 text-stellar-white'
              }`}
            >
              {id}
            </span>
            <motion.button
              aria-label={`Navigate to ${id} section`}
              onClick={() => handleClick(id)}
              className={`w-3 h-3 rounded-full border border-stellar-white transition-colors duration-300 ${
                currentSection === id ? 'bg-cosmic-teal border-cosmic-teal' : 'bg-transparent'
              }`}
              initial={false}
              animate={{ 
                scale: currentSection === id ? 1.5 : 1 
              }}
              whileHover={{ scale: 1.3 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavigationIndicators; 