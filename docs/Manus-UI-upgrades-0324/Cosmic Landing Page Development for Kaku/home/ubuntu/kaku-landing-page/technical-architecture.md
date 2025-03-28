# Technical Architecture for Kaku's Cosmic Landing Page

## Overview

This document outlines the technical architecture for Kaku's cosmic landing page, detailing the integration approach with the main Next.js application, technology stack implementation, and key technical considerations for creating an immersive, performant, and accessible user experience.

## Core Architecture

### Application Structure

```
/src
  /landing
    /components
      /animations        # Reusable animation components
      /cosmic            # Cosmic visual elements (stars, nebula, etc.)
      /character         # Kaku character components
      /journey           # Scroll journey section components
      /ui                # UI components (buttons, forms, etc.)
      /transitions       # Transition components between sections
    /hooks               # Custom React hooks
    /utils               # Utility functions
    /context             # React context providers
    /assets              # Static assets (images, sounds, etc.)
    /styles              # CSS/SCSS files
    /pages               # Page components
    /lib                 # Third-party library integrations
    index.js             # Main landing page entry point
```

### Technology Stack

1. **Core Framework**
   - **Next.js**: Server-side rendering for optimal performance and SEO
   - **TypeScript**: For type safety and better developer experience
   - **React 18+**: For component-based UI development with latest features

2. **3D and Animation**
   - **Three.js**: For cosmic starfield, Earth, and 3D elements
   - **react-three-fiber**: React reconciler for Three.js
   - **Framer Motion**: For React-native animations and interactions
   - **GSAP (GreenSock)**: For complex animation sequences and timelines
   - **Lottie**: For more complex character animations if needed

3. **Scroll and Interaction**
   - **Locomotive Scroll**: For smooth scrolling experience
   - **React Intersection Observer**: For scroll-triggered animations
   - **GSAP ScrollTrigger**: For advanced scroll-based animations

4. **Styling**
   - **CSS Modules**: For component-scoped styling
   - **CSS Variables**: For theme consistency
   - **PostCSS**: For processing and optimizing CSS

5. **Audio**
   - **Howler.js**: For ambient sounds and interaction feedback
   - **Web Audio API**: For more complex audio manipulations

6. **State Management**
   - **React Context API**: For global state management
   - **React Query**: For data fetching and caching (if needed)

7. **Form Handling**
   - **React Hook Form**: For efficient form validation and submission
   - **Zod**: For schema validation

8. **Performance and Optimization**
   - **Next.js Image**: For optimized image loading
   - **Dynamic Imports**: For code splitting
   - **Suspense and Lazy Loading**: For component-level code splitting

## Integration with Main Application

### Integration Approach

1. **Module-Based Integration**
   - The landing page will be developed as a standalone module
   - Clear interface boundaries for importing into main application
   - Shared design tokens and theme variables

2. **Routing Integration**
   - Integrated with Next.js routing system
   - Conditional rendering based on user authentication status
   - Path-based routing with potential for dynamic segments

3. **State Sharing**
   - Access to global authentication context
   - Onboarding state persistence
   - User preference storage

4. **Asset Management**
   - Shared CDN for larger assets
   - Optimized asset loading strategy
   - Preloading critical assets

### Authentication Flow

1. **Pre-Authentication Experience**
   - Complete cosmic landing sequence available without authentication
   - Sign-up form integrated with existing authentication system
   - Smooth transition to authenticated state

2. **Post-Authentication Handling**
   - Session storage to prevent repeated landing sequence for returning users
   - Graceful redirection to appropriate experience based on user status
   - Preservation of narrative continuity across authentication boundary

3. **Data Persistence**
   - Store onboarding completion status
   - Remember user's progress in the narrative journey
   - Maintain relationship stage information

## Technical Implementation Details

### Three.js Starfield Implementation

```javascript
// Simplified example of starfield implementation
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

const StarfieldBackground = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  
  useEffect(() => {
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    // Configure renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    
    // Create stars
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true
    });
    
    // Generate random star positions
    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starVertices.push(x, y, z);
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    
    // Position camera
    camera.position.z = 5;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate stars slightly for twinkling effect
      stars.rotation.y += 0.0001;
      stars.rotation.x += 0.0001;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current.removeChild(renderer.domElement);
    };
  }, []);
  
  return <div ref={containerRef} className="starfield-container" />;
};

export default StarfieldBackground;
```

### Scroll-Based Animation System

```javascript
// Simplified example of scroll-based animation system
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollJourneySection = ({ children, id }) => {
  useEffect(() => {
    // Create animation timeline
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: `#${id}`,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        markers: process.env.NODE_ENV === 'development'
      }
    });
    
    // Add animations to timeline
    timeline.fromTo(
      `#${id} .animate-in`,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, stagger: 0.2, duration: 1 }
    );
    
    return () => {
      // Clean up ScrollTrigger
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [id]);
  
  return (
    <section id={id} className="scroll-journey-section">
      {children}
    </section>
  );
};

export default ScrollJourneySection;
```

### Kaku Character Animation

```javascript
// Simplified example of Kaku character animation
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

const KakuCharacter = ({ emotion = 'happy', isAnimating = false }) => {
  const kakuRef = useRef(null);
  
  // Emotion variants
  const emotionVariants = {
    happy: {
      eyes: { d: "M5,10 A2,2 0 0,0 9,10", fill: "#FFFFFF" },
      mouth: { d: "M4,15 Q7,18 10,15", stroke: "#FFFFFF", fill: "none" }
    },
    curious: {
      eyes: { d: "M5,10 A2,2 0 0,0 9,10", fill: "#FFFFFF" },
      mouth: { d: "M4,15 Q7,16 10,15", stroke: "#FFFFFF", fill: "none" }
    },
    excited: {
      eyes: { d: "M5,9 A2,2 0 0,0 9,9", fill: "#FFFFFF" },
      mouth: { d: "M4,15 Q7,19 10,15", stroke: "#FFFFFF", fill: "none" }
    }
  };
  
  // Animation for arrival sequence
  useEffect(() => {
    if (isAnimating) {
      const timeline = gsap.timeline();
      
      timeline
        .fromTo(
          kakuRef.current,
          { scale: 0.1, x: -300, y: -200, opacity: 0.5 },
          { scale: 1, x: 0, y: 0, opacity: 1, duration: 2, ease: "power2.out" }
        )
        .to(
          kakuRef.current,
          { y: -20, duration: 1, repeat: -1, yoyo: true, ease: "sine.inOut" }
        );
    }
  }, [isAnimating]);
  
  return (
    <motion.div 
      ref={kakuRef}
      className="kaku-character"
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
    >
      <svg width="100" height="120" viewBox="0 0 100 120">
        {/* Helmet/Head */}
        <ellipse cx="50" cy="40" rx="30" ry="35" fill="#000000" stroke="#FFFFFF" strokeWidth="3" />
        
        {/* Eyes */}
        <motion.circle 
          cx="40" cy="35" r="5" 
          fill="#FFFFFF"
          initial={emotionVariants[emotion].eyes}
          animate={emotionVariants[emotion].eyes}
          transition={{ duration: 0.5 }}
        />
        <motion.circle 
          cx="60" cy="35" r="5" 
          fill="#FFFFFF"
          initial={emotionVariants[emotion].eyes}
          animate={emotionVariants[emotion].eyes}
          transition={{ duration: 0.5 }}
        />
        
        {/* Mouth */}
        <motion.path
          initial={emotionVariants[emotion].mouth}
          animate={emotionVariants[emotion].mouth}
          transition={{ duration: 0.5 }}
          stroke="#FFFFFF"
          strokeWidth="2"
          fill="none"
        />
        
        {/* Body */}
        <ellipse cx="50" cy="90" rx="25" ry="30" fill="#FFFFFF" />
        
        {/* Arms */}
        <ellipse cx="25" cy="80" rx="8" ry="20" fill="#FFFFFF" transform="rotate(-20 25 80)" />
        <ellipse cx="75" cy="80" rx="8" ry="20" fill="#FFFFFF" transform="rotate(20 75 80)" />
        
        {/* Cosmic Glow */}
        <motion.ellipse 
          cx="50" cy="40" rx="33" ry="38" 
          fill="none" 
          stroke="rgba(131, 195, 230, 0.5)" 
          strokeWidth="2"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        />
      </svg>
    </motion.div>
  );
};

export default KakuCharacter;
```

### Sound Management System

```javascript
// Simplified example of sound management system
import { useEffect, useRef } from 'react';
import { Howl } from 'howler';

const useSoundSystem = () => {
  const soundsRef = useRef({});
  const isMutedRef = useRef(false);
  
  // Initialize sounds
  useEffect(() => {
    // Ambient background
    soundsRef.current.ambient = new Howl({
      src: ['/sounds/cosmic-ambient.mp3'],
      loop: true,
      volume: 0.3,
      autoplay: false
    });
    
    // UI sounds
    soundsRef.current.boop = new Howl({
      src: ['/sounds/boop.mp3'],
      volume: 0.5
    });
    
    soundsRef.current.whoosh = new Howl({
      src: ['/sounds/whoosh.mp3'],
      volume: 0.4
    });
    
    soundsRef.current.chime = new Howl({
      src: ['/sounds/chime.mp3'],
      volume: 0.4
    });
    
    // Check user preference for sound
    const savedMutePreference = localStorage.getItem('kakuSoundMuted');
    if (savedMutePreference === 'true') {
      isMutedRef.current = true;
    }
    
    // Cleanup
    return () => {
      Object.values(soundsRef.current).forEach(sound => sound.unload());
    };
  }, []);
  
  // Play a sound
  const playSound = (soundName) => {
    if (!isMutedRef.current && soundsRef.current[soundName]) {
      soundsRef.current[soundName].play();
    }
  };
  
  // Toggle mute state
  const toggleMute = () => {
    isMutedRef.current = !isMutedRef.current;
    
    Object.values(soundsRef.current).forEach(sound => {
      sound.mute(isMutedRef.current);
    });
    
    localStorage.setItem('kakuSoundMuted', isMutedRef.current.toString());
    
    return isMutedRef.current;
  };
  
  // Start ambient sound
  const startAmbient = () => {
    if (!isMutedRef.current) {
      soundsRef.current.ambient.play();
    }
  };
  
  // Stop ambient sound
  const stopAmbient = () => {
    soundsRef.current.ambient.stop();
  };
  
  return {
    playSound,
    toggleMute,
    startAmbient,
    stopAmbient,
    isMuted: () => isMutedRef.current
  };
};

export default useSoundSystem;
```

## Performance Optimization Strategy

### Initial Load Performance

1. **Asset Loading Strategy**
   - Critical CSS inlined in head
   - Progressive loading of non-critical assets
   - Preload key resources (fonts, critical JS)
   - Defer non-essential JavaScript

2. **Image Optimization**
   - Next.js Image component for automatic optimization
   - WebP format with fallbacks
   - Responsive images with appropriate sizes
   - Lazy loading for off-screen images

3. **Code Splitting**
   - Route-based code splitting
   - Component-level code splitting with React.lazy and Suspense
   - Dynamic imports for heavy libraries (Three.js, GSAP)

4. **Performance Budget**
   - First Contentful Paint < 1.5s
   - Time to Interactive < 3s
   - Total bundle size < 500KB (initial load)
   - Core Web Vitals compliance

### Runtime Performance

1. **Animation Performance**
   - Use requestAnimationFrame for animations
   - GPU-accelerated properties (transform, opacity)
   - Debounce scroll events
   - Reduce JavaScript execution on main thread

2. **Memory Management**
   - Proper cleanup of event listeners
   - Dispose Three.js objects when not needed
   - Unload audio resources when not in use
   - Monitor for memory leaks in development

3. **Progressive Enhancement**
   - Basic experience works without JavaScript
   - Enhanced experience with JavaScript
   - Fallbacks for browsers without WebGL
   - Device capability detection for feature adjustment

## Accessibility Implementation

### Core Accessibility Features

1. **Screen Reader Support**
   - Semantic HTML structure
   - ARIA attributes for custom components
   - Alternative text for visual elements
   - Accessible names for interactive elements

2. **Keyboard Navigation**
   - Logical tab order
   - Focus management for modals and overlays
   - Visible focus states
   - Keyboard shortcuts for key actions

3. **Reduced Motion**
   - Honor prefers-reduced-motion media query
   - Alternative non-animated experience
   - Simplified transitions that maintain narrative
   - Option to disable animations entirely

4. **Color and Contrast**
   - WCAG AA compliance for text contrast
   - Non-color-dependent information
   - Tested for color blindness considerations
   - High contrast mode support

### Narrative Accessibility

1. **Text Alternatives**
   - Complete text version of the cosmic journey
   - Descriptive text for visual storytelling elements
   - Audio descriptions for key visual sequences
   - Transcript of audio elements

2. **Progressive Disclosure**
   - Information chunked into manageable sections
   - Clear headings and structure
   - Consistent navigation patterns
   - Predictable interaction patterns

## Responsive Design Implementation

### Breakpoint Strategy

1. **Mobile First Approach**
   - Base styles for mobile (320px+)
   - Progressive enhancement for larger screens
   - Fluid typography and spacing

2. **Key Breakpoints**
   - Small Mobile: 320px - 375px
   - Large Mo<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>