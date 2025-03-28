'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'large';
type Orientation = 'portrait' | 'landscape';

interface DeviceCapabilities {
  webgl: boolean;
  touch: boolean;
  highPerformance: boolean;
}

interface ResponsiveContextType {
  currentBreakpoint: Breakpoint;
  orientation: Orientation;
  deviceCapabilities: DeviceCapabilities;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const breakpointValues = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  large: 1440
};

const ResponsiveContext = createContext<ResponsiveContextType | undefined>(undefined);

export const ResponsiveProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('desktop');
  const [orientation, setOrientation] = useState<Orientation>('landscape');
  const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities>({
    webgl: true,
    touch: false,
    highPerformance: true
  });

  // Detect device capabilities
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Detect WebGL support
      const canvas = document.createElement('canvas');
      const hasWebGL = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );

      // Detect touch support
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Estimate performance capability (simplified)
      const highPerformance = !hasTouch || window.devicePixelRatio >= 2;

      setDeviceCapabilities({
        webgl: hasWebGL,
        touch: hasTouch,
        highPerformance
      });
    }
  }, []);

  // Update breakpoint and orientation on resize
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      
      // Determine breakpoint
      let newBreakpoint: Breakpoint = 'large';
      if (width < breakpointValues.mobile) {
        newBreakpoint = 'mobile';
      } else if (width < breakpointValues.tablet) {
        newBreakpoint = 'tablet';
      } else if (width < breakpointValues.desktop) {
        newBreakpoint = 'desktop';
      }
      
      if (newBreakpoint !== currentBreakpoint) {
        setCurrentBreakpoint(newBreakpoint);
      }
      
      // Determine orientation
      const newOrientation: Orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
      if (newOrientation !== orientation) {
        setOrientation(newOrientation);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => window.removeEventListener('resize', handleResize);
  }, [currentBreakpoint, orientation]);

  // Derived values
  const isMobile = currentBreakpoint === 'mobile';
  const isTablet = currentBreakpoint === 'tablet';
  const isDesktop = currentBreakpoint === 'desktop' || currentBreakpoint === 'large';

  return (
    <ResponsiveContext.Provider
      value={{
        currentBreakpoint,
        orientation,
        deviceCapabilities,
        isMobile,
        isTablet,
        isDesktop
      }}
    >
      {children}
    </ResponsiveContext.Provider>
  );
};

export const useResponsive = (): ResponsiveContextType => {
  const context = useContext(ResponsiveContext);
  if (context === undefined) {
    throw new Error('useResponsive must be used within a ResponsiveProvider');
  }
  return context;
};
