'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useResponsive } from '@/context/ResponsiveContext';
import { useAccessibility } from '@/context/AccessibilityContext';

interface CosmicBackgroundProps {
  intensity?: number;
  parallaxEnabled?: boolean;
  focusPoint?: { x: number; y: number };
}

const CosmicBackground: React.FC<CosmicBackgroundProps> = ({
  intensity = 1,
  parallaxEnabled = true,
  focusPoint
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const { deviceCapabilities, currentBreakpoint } = useResponsive();
  const { reducedMotion } = useAccessibility();
  
  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current || !deviceCapabilities.webgl) return;
    
    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: deviceCapabilities.highPerformance,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Determine particle count based on device capability
    let particleCount = 5000;
    if (deviceCapabilities.highPerformance) {
      particleCount = 10000;
    } else if (currentBreakpoint === 'mobile') {
      particleCount = 2000;
    }
    
    // Create stars
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1 * intensity,
      transparent: true,
      opacity: 0.8
    });
    
    // Generate random star positions
    const starVertices = [];
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starVertices.push(x, y, z);
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    starsRef.current = stars;
    
    // Create Earth (simplified for prototype)
    const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
    const earthMaterial = new THREE.MeshBasicMaterial({
      color: 0x2233ff,
      wireframe: true
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(-3, -2, -5);
    scene.add(earth);
    earthRef.current = earth;
    
    // Animation loop
    const animate = () => {
      if (!reducedMotion) {
        // Rotate stars slightly for twinkling effect
        if (stars) {
          stars.rotation.y += 0.0001;
          stars.rotation.x += 0.0001;
        }
        
        // Rotate Earth
        if (earth) {
          earth.rotation.y += 0.001;
        }
      }
      
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (renderer && containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
        renderer.dispose();
      }
      
      if (starGeometry) {
        starGeometry.dispose();
      }
      
      if (starMaterial) {
        starMaterial.dispose();
      }
      
      if (earthGeometry) {
        earthGeometry.dispose();
      }
      
      if (earthMaterial) {
        earthMaterial.dispose();
      }
    };
  }, [intensity, deviceCapabilities, currentBreakpoint, reducedMotion]);
  
  // Handle parallax effect
  useEffect(() => {
    if (!parallaxEnabled || reducedMotion || !sceneRef.current || !starsRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!starsRef.current) return;
      
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = (e.clientY / window.innerHeight) * 2 - 1;
      
      starsRef.current.rotation.x = mouseY * 0.05;
      starsRef.current.rotation.y = mouseX * 0.05;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [parallaxEnabled, reducedMotion]);
  
  // Handle focus point changes
  useEffect(() => {
    if (!focusPoint || !cameraRef.current) return;
    
    // Animate camera to focus on the specified point
    const targetX = focusPoint.x * 0.1;
    const targetY = focusPoint.y * 0.1;
    
    const animate = () => {
      if (!cameraRef.current) return;
      
      cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.05;
      cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * 0.05;
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [focusPoint]);
  
  return (
    <div 
      ref={containerRef} 
      className="cosmic-background fixed inset-0 w-full h-full -z-10"
      aria-hidden="true"
    />
  );
};

export default CosmicBackground;
