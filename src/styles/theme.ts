// src/styles/theme.ts

/**
 * Theme configuration using the selected color scheme with Grok Blue
 */

// Define the theme type structure
export interface ThemeColors {
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
    dark: string;
    darkSurface: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
  accent: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  state: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  border: {
    light: string;
    medium: string;
    dark: string;
  };
  gradients: {
    grokBlue: string;
    grokLoading: string;
  };
}

export const colors: ThemeColors = {
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    accent: '#e0f2fe',
    dark: '#121212',
    darkSurface: '#1e1e1e',
  },
  text: {
    primary: '#0f172a',
    secondary: '#334155',
    tertiary: '#64748B',
    inverse: '#ffffff',
  },
  accent: {
    primary: '#0077b6',   // Grok Blue Primary
    secondary: '#00a8e8', // Grok Blue Secondary
    tertiary: '#64748B',
  },
  state: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  border: {
    light: '#e2e8f0',
    medium: '#cbd5e1',
    dark: '#94a3b8',
  },
  gradients: {
    grokBlue: 'linear-gradient(90deg, #0077b6 0%, #00a8e8 100%)',
    grokLoading: 'conic-gradient(from 0deg, #0077b6, #00a8e8, #0077b6)',
  }
};

// Continue with remaining type definitions...
export interface ThemeFonts {
  body: string;
  heading: string;
  monospace: string;
}

export const fonts: ThemeFonts = {
  body: 'Inter, system-ui, sans-serif',
  heading: 'Inter, system-ui, sans-serif',
  monospace: 'Menlo, monospace',
};

// Font sizes (in rem)
export interface ThemeFontSizes {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
}

export const fontSizes: ThemeFontSizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
};

// Font weights
export interface ThemeFontWeights {
  normal: number;
  medium: number;
  semibold: number;
  bold: number;
}

export const fontWeights: ThemeFontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

// Line heights
export interface ThemeLineHeights {
  none: number;
  tight: number;
  normal: number;
  relaxed: number;
  loose: number;
}

export const lineHeights: ThemeLineHeights = {
  none: 1,
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
};

// Rest of the theme definition with proper typing...

// Complete theme object
const theme = {
  colors,
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  spacing,
  borderRadius,
  shadows,
  animations,
  transitions,
  zIndices,
  buttons,
  forms,
};

export type Theme = typeof theme;
export default theme;
