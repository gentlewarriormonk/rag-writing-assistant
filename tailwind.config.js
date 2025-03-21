/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#0EA5E9',
        'secondary-teal': '#14B8A6',
        'accent-coral': '#F43F5E',
        'dark-gray': '#1F2937',
        'medium-gray': '#6B7280',
        'light-gray': '#E5E7EB',
        'lighter-gray': '#F3F4F6',
        'success-green': '#22C55E',
        'warning-amber': '#F59E0B',
        'error-red': '#EF4444',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      backgroundColor: {
        'dark': '#1a1a1a',
        'dark-lighter': '#2d2d2d',
      },
      textColor: {
        'dark': '#ffffff',
        'dark-muted': '#a3a3a3',
      },
    },
  },
  plugins: [],
}; 