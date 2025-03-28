# Kaku Landing Page (Manus Version)

A cosmic landing page for Kaku, the AI writing assistant with personality, featuring smooth scroll animations and enhanced visual effects.

## Project Overview

This is a Next.js application featuring:

- Locomotive Scroll for smooth scrolling experience
- 3D cosmic background with React Three Fiber
- Advanced character animations
- Interactive journey through Kaku's story
- Enhanced visual effects and animations
- Sign-up experience with form validation
- Accessibility features (reduced motion, sound toggles)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd kaku-landing-manus
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Key Differences from Gemini Version

- **Locomotive Scroll Integration**: Smooth scrolling experience using Locomotive Scroll instead of regular scrolling
- **Enhanced Animation System**: More complex animations for character and background elements
- **Improved Loading Screen**: Multi-phase loading with progress indicators
- **Expanded Sound System**: Additional sound effects and more control over audio playback
- **Custom Tailwind Animations**: Pre-defined animation classes for cosmic effects

## Project Structure

- `src/app`: Next.js app router files
- `src/components`: React components organized by category
  - `character`: Kaku character components
  - `cosmic`: Background and cosmic elements
  - `journey`: Main journey sections
  - `layout`: Layout components
  - `ui`: Reusable UI components
- `src/context`: Application context providers
- `src/hooks`: Custom React hooks
- `src/lib`: Utility functions and configuration

## Technologies Used

- Next.js
- React
- TypeScript
- React Three Fiber / Three.js
- Framer Motion
- Locomotive Scroll
- Tailwind CSS
- React Hook Form with Zod
- Howler.js for sound

## Adding Real Assets

The current implementation includes:
- Placeholder sound files (replace with real audio)
- Simple SVG Kaku character (can be replaced with more detailed model)
- Basic Earth rendering (can be enhanced with textures)

## Accessibility Features

- Reduced motion toggle
- Sound toggle
- Semantic HTML
- ARIA labels on interactive elements
- Keyboard navigation support

## Deployment

This is a Next.js application and can be deployed on Vercel, Netlify, or any static site hosting service.

```bash
npm run build
# or
yarn build
```

## License

[MIT](LICENSE) 