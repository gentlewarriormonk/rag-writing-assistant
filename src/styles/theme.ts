// src/styles/theme.ts

/**
 * Theme configuration using the selected color scheme:
 * - Primary Background: #ffffff (White)
 * - Primary Text: #0f172a (Dark Blue/Black)
 * - Primary Accent: #0EA5E9 (Bright Blue)
 * - Secondary Accent: #06B6D4 (Teal)
 * - Tertiary/Neutral: #64748B (Gray)
 * - Font Family: Inter
 */

export const colors = {
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    accent: '#e0f2fe',
  },
  text: {
    primary: '#0f172a',
    secondary: '#334155',
    tertiary: '#64748b',
    inverse: '#ffffff',
  },
  accent: {
    primary: '#0EA5E9',
    secondary: '#06B6D4',
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
  }
};

// Font configuration
export const fonts = {
  body: 'Inter, system-ui, sans-serif',
  heading: 'Inter, system-ui, sans-serif',
  monospace: 'Menlo, monospace',
};

// Font sizes (in rem)
export const fontSizes = {
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
export const fontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

// Line heights
export const lineHeights = {
  none: 1,
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
};

// Spacing scale (in rem)
export const spacing = {
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
export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  md: '0.25rem',
  lg: '0.375rem',
  xl: '0.5rem',
  '2xl': '0.75rem',
  '3xl': '1rem',
  full: '9999px',
};

// Shadows
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
};

// Transitions
export const transitions = {
  default: 'all 0.2s ease-in-out',
  fast: 'all 0.1s ease-in-out',
  slow: 'all 0.3s ease-in-out',
};

// Z-index scale
export const zIndices = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  toast: 1600,
  tooltip: 1700,
};

// Button variants
export const buttons = {
  primary: {
    backgroundColor: colors.accent.primary,
    color: colors.text.inverse,
    hover: {
      backgroundColor: '#0284c7', // Darker shade of primary accent
    },
    focus: {
      boxShadow: `0 0 0 3px rgba(14, 165, 233, 0.4)`,
    },
  },
  secondary: {
    backgroundColor: colors.accent.secondary,
    color: colors.text.inverse,
    hover: {
      backgroundColor: '#0891b2', // Darker shade of secondary accent
    },
    focus: {
      boxShadow: `0 0 0 3px rgba(6, 182, 212, 0.4)`,
    },
  },
  tertiary: {
    backgroundColor: 'transparent',
    color: colors.accent.primary,
    border: `1px solid ${colors.accent.primary}`,
    hover: {
      backgroundColor: 'rgba(14, 165, 233, 0.1)',
    },
    focus: {
      boxShadow: `0 0 0 3px rgba(14, 165, 233, 0.4)`,
    },
  },
  danger: {
    backgroundColor: colors.state.error,
    color: colors.text.inverse,
    hover: {
      backgroundColor: '#dc2626', // Darker shade of error
    },
    focus: {
      boxShadow: `0 0 0 3px rgba(239, 68, 68, 0.4)`,
    },
  },
};

// Form element styling
export const forms = {
  input: {
    backgroundColor: colors.background.primary,
    borderColor: colors.border.medium,
    color: colors.text.primary,
    focus: {
      borderColor: colors.accent.primary,
      boxShadow: `0 0 0 1px ${colors.accent.primary}`,
    },
    error: {
      borderColor: colors.state.error,
      boxShadow: `0 0 0 1px ${colors.state.error}`,
    },
  },
  select: {
    backgroundColor: colors.background.primary,
    borderColor: colors.border.medium,
    color: colors.text.primary,
    focus: {
      borderColor: colors.accent.primary,
      boxShadow: `0 0 0 1px ${colors.accent.primary}`,
    },
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
  transitions,
  zIndices,
  buttons,
  forms,
};

export default theme;
