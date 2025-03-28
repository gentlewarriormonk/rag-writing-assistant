'use client';

import React, { useRef, useEffect } from 'react';
import { useAccessibility } from '@/context/AccessibilityContext';
import { Howl } from 'howler';

interface SoundControllerProps {
  isMuted?: boolean;
  ambientTrack?: string;
  volumeLevel?: number;
}

const SoundController: React.FC<SoundControllerProps> = ({
  isMuted = false,
  ambientTrack = 'cosmic-ambient',
  volumeLevel = 0.5
}) => {
  const soundsRef = useRef<Record<string, Howl>>({});
  const isMutedRef = useRef<boolean>(isMuted);
  const currentAmbientRef = useRef<string | null>(null);
  const volumeLevelRef = useRef<number>(volumeLevel);
  
  const { soundEnabled } = useAccessibility();
  
  // Initialize sounds
  useEffect(() => {
    // In a real implementation, these would be actual sound files
    // For the prototype, we'll just define them but not load real files
    
    // Ambient background
    soundsRef.current.cosmic = new Howl({
      src: ['/assets/sounds/cosmic-ambient.mp3'],
      loop: true,
      volume: volumeLevelRef.current * 0.3,
      autoplay: false
    });
    
    // UI sounds
    soundsRef.current.boop = new Howl({
      src: ['/assets/sounds/boop.mp3'],
      volume: volumeLevelRef.current * 0.5
    });
    
    soundsRef.current.whoosh = new Howl({
      src: ['/assets/sounds/whoosh.mp3'],
      volume: volumeLevelRef.current * 0.4
    });
    
    soundsRef.current.chime = new Howl({
      src: ['/assets/sounds/chime.mp3'],
      volume: volumeLevelRef.current * 0.4
    });
    
    // Check user preference for sound
    isMutedRef.current = !soundEnabled;
    
    // Cleanup
    return () => {
      Object.values(soundsRef.current).forEach(sound => sound.unload());
    };
  }, []);
  
  // Handle sound enabled/disabled changes
  useEffect(() => {
    isMutedRef.current = !soundEnabled;
    
    Object.values(soundsRef.current).forEach(sound => {
      sound.mute(isMutedRef.current);
    });
    
    // Start or stop ambient based on mute state
    if (isMutedRef.current) {
      if (currentAmbientRef.current) {
        soundsRef.current[currentAmbientRef.current]?.pause();
      }
    } else if (currentAmbientRef.current) {
      soundsRef.current[currentAmbientRef.current]?.play();
    }
  }, [soundEnabled]);
  
  // Handle ambient track changes
  useEffect(() => {
    // Stop current ambient if playing
    if (currentAmbientRef.current && soundsRef.current[currentAmbientRef.current]) {
      soundsRef.current[currentAmbientRef.current].stop();
    }
    
    // Start new ambient if not muted
    if (!isMutedRef.current && ambientTrack && soundsRef.current[ambientTrack]) {
      soundsRef.current[ambientTrack].play();
      currentAmbientRef.current = ambientTrack;
    } else {
      currentAmbientRef.current = null;
    }
    
    return () => {
      if (currentAmbientRef.current && soundsRef.current[currentAmbientRef.current]) {
        soundsRef.current[currentAmbientRef.current].stop();
      }
    };
  }, [ambientTrack]);
  
  // Handle volume changes
  useEffect(() => {
    volumeLevelRef.current = volumeLevel;
    
    Object.values(soundsRef.current).forEach(sound => {
      // Adjust volume but maintain relative levels
      const currentVolume = sound.volume();
      const ratio = currentVolume / (volumeLevelRef.current || 0.01);
      sound.volume(volumeLevel * ratio);
    });
  }, [volumeLevel]);
  
  // Expose methods to window for other components to use
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // This is a simplified approach for the prototype
      // In a real implementation, we would use a more robust method
      (window as any).kakuSoundSystem = {
        playSound: (id: string) => {
          if (!isMutedRef.current && soundsRef.current[id]) {
            soundsRef.current[id].play();
          }
        },
        stopSound: (id: string) => {
          if (soundsRef.current[id]) {
            soundsRef.current[id].stop();
          }
        },
        isMuted: () => isMutedRef.current
      };
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).kakuSoundSystem;
      }
    };
  }, []);
  
  // This component doesn't render anything visible
  return null;
};

export default SoundController;
