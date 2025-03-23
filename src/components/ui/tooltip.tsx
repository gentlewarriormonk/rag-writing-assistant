'use client';

import React, { useState } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ 
  children, 
  content, 
  position = 'top' 
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1',
  };
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div
          className={`absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-lg whitespace-nowrap transition-all duration-150 transform ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} ${positionClasses[position]}`}
        >
          {content}
          <div 
            className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === 'top' ? 'top-full -translate-y-1/2 left-1/2 -translate-x-1/2' :
              position === 'bottom' ? 'bottom-full translate-y-1/2 left-1/2 -translate-x-1/2' :
              position === 'left' ? 'left-full -translate-x-1/2 top-1/2 -translate-y-1/2' :
              'right-full translate-x-1/2 top-1/2 -translate-y-1/2'
            }`}
          />
        </div>
      )}
    </div>
  );
} 