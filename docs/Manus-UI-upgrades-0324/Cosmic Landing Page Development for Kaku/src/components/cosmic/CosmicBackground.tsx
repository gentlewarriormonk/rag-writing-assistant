"use client";

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import Earth from './Earth';
import { useAppContext } from '@/context/AppContext';

const CosmicBackground: React.FC = () => {
  const { isReducedMotion } = useAppContext();

  return (
    <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
      {/* Basic CSS fallback gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-cosmic-black via-[#0D1B2A] to-[#1A1035]"></div>

      {/* Conditionally render Canvas */}
      {!isReducedMotion && (
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.8}/>
          <Suspense fallback={null}>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Earth position={[4, -2, -5]} /> {/* Position Earth */}
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};

export default CosmicBackground; 