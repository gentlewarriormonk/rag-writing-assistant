'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Define theme colors using Grok blue palette
export const themeColors = {
  light: {
    background: '#ffffff',
    text: '#0f172a',
    primary: '#0077b6',
    secondary: '#00a8e8',
    neutral: '#64748B',
    surface: '#f8f9fa',
    border: '#e2e8f0',
  },
  dark: {
    background: '#121212',
    surface: '#1e1e1e',
    text: '#ffffff',
    primary: '#00a8e8',
    secondary: '#0077b6',
    neutral: '#94a3b8',
    border: '#2d3748',
  },
};

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: typeof themeColors.dark | typeof themeColors.light;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: true,
  toggleDarkMode: () => {},
  colors: themeColors.dark,
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [colors, setColors] = useState(themeColors.dark);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    
    // Check saved preference, but default to dark
    const userPreference = localStorage.getItem('theme');
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // By default use dark mode, only switch if explicitly set to light
    const shouldUseDarkMode = userPreference !== 'light';
    setIsDarkMode(shouldUseDarkMode);
  }, []);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    
    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      setColors(themeColors.dark);
    } else {
      document.documentElement.classList.remove('dark');
      setColors(themeColors.light);
    }
    
    // Store preference
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContext; 