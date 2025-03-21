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

// Spacing (in rem)
export interface ThemeSpacing {
  px: string;
  0: string;
  0.5: string;
  1: string;
  1.5: string;
  2: string;
  2.5: string;
  3: string;
  3.5: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  12: string;
  14: string;
  16: string;
  20: string;
  24: string;
  28: string;
  32: string;
  36: string;
  40: string;
  44: string;
  48: string;
  52: string;
  56: string;
  60: string;
  64: string;
  72: string;
  80: string;
  96: string;
}

export const spacing: ThemeSpacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
};

// Border radius
export interface ThemeBorderRadius {
  none: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  full: string;
}

export const borderRadius: ThemeBorderRadius = {
  none: '0',
  sm: '0.125rem',
  base: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

// Shadows
export interface ThemeShadows {
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
  none: string;
}

export const shadows: ThemeShadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
};

// Animations
export interface ThemeAnimations {
  spin: string;
  ping: string;
  pulse: string;
  bounce: string;
}

export const animations: ThemeAnimations = {
  spin: 'spin 1s linear infinite',
  ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
  pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  bounce: 'bounce 1s infinite',
};

// Transitions
export interface ThemeTransitions {
  none: string;
  all: string;
  colors: string;
  opacity: string;
  shadow: string;
  transform: string;
}

export const transitions: ThemeTransitions = {
  none: 'none',
  all: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  colors: 'color, background-color, border-color, text-decoration-color, fill, stroke 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  opacity: 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  shadow: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  transform: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)',
};

// Z-indices
export interface ThemeZIndices {
  auto: string;
  0: string;
  10: string;
  20: string;
  30: string;
  40: string;
  50: string;
}

export const zIndices: ThemeZIndices = {
  auto: 'auto',
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
};

// Button variants
export interface ThemeButtons {
  primary: {
    bg: string;
    color: string;
    hover: string;
    active: string;
    disabled: string;
  };
  secondary: {
    bg: string;
    color: string;
    hover: string;
    active: string;
    disabled: string;
  };
  outline: {
    bg: string;
    color: string;
    hover: string;
    active: string;
    disabled: string;
  };
}

export const buttons: ThemeButtons = {
  primary: {
    bg: colors.accent.primary,
    color: colors.text.inverse,
    hover: colors.accent.secondary,
    active: colors.accent.primary,
    disabled: colors.text.tertiary,
  },
  secondary: {
    bg: colors.background.secondary,
    color: colors.text.primary,
    hover: colors.background.tertiary,
    active: colors.background.secondary,
    disabled: colors.text.tertiary,
  },
  outline: {
    bg: 'transparent',
    color: colors.text.primary,
    hover: colors.background.tertiary,
    active: colors.background.secondary,
    disabled: colors.text.tertiary,
  },
};

// Form styles
export interface ThemeForms {
  input: {
    bg: string;
    border: string;
    color: string;
    placeholder: string;
    focus: string;
    error: string;
  };
}

export const forms: ThemeForms = {
  input: {
    bg: colors.background.primary,
    border: colors.border.light,
    color: colors.text.primary,
    placeholder: colors.text.tertiary,
    focus: colors.accent.primary,
    error: colors.state.error,
  },
};

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
