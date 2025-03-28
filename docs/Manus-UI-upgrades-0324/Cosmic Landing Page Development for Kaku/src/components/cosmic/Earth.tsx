"use client";

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppContext } from '@/context/AppContext';

interface EarthProps {
  position: [number, number, number];
}

const Earth: React.FC<EarthProps> = ({ position }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { isReducedMotion } = useAppContext();

  useFrame((state, delta) => {
    if (meshRef.current && !isReducedMotion) {
      meshRef.current.rotation.y += delta * 0.1; // Slow rotation
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      {/* Placeholder material - Replace with texture later */}
      <meshStandardMaterial color="#2A97C8" wireframe={false} roughness={0.8} metalness={0.1} />
    </mesh>
  );
};

export default Earth; 