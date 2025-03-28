/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'cosmic-black': '#0A0A14', // Deep space background
        'nebula-blue': '#2B4C8C', // Primary brand color
        'stellar-white': '#F0F0FF', // Text and UI elements
        
        // Secondary Colors
        'cosmic-purple': '#6B46C1', // Accent and highlights
        'nebula-pink': '#FF6B81', // Accent and highlights
        'cosmic-teal': '#38B2AC', // Accent and highlights
        
        // Emotional Color States
        'kaku-neutral': '#83C3E6', // Soft blue
        'kaku-excited': '#FFD166', // Warm yellow
        'kaku-thoughtful': '#9F7AEA', // Purple
        'kaku-encouraging': '#48BB78', // Green
        'kaku-playful': '#F687B3', // Pink
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
        'display': ['Space Grotesk', 'ui-sans-serif', 'system-ui'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'cosmic-pulse': 'cosmicPulse 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
      },
      keyframes: {
        cosmicPulse: {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
        },
      },
    },
  },
  plugins: [],
}; 