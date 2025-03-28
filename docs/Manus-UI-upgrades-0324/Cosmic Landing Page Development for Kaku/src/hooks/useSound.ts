"use client";

import { Howl, Howler } from 'howler';
import { useState, useEffect, useRef, useCallback } from 'react';
import { SOUNDS, SOUND_FILES } from '@/lib/sounds';

type SoundMap = { [key: string]: Howl };

export const useSound = () => {
  const [isSoundEnabled, setIsSoundEnabledState] = useState(true); // Default to on
  const soundsRef = useRef<SoundMap>({});
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Initialize sounds
    const loadedSounds: SoundMap = {};
    let loadedCount = 0;
    const totalSounds = Object.keys(SOUND_FILES).length;

    Object.entries(SOUND_FILES).forEach(([key, src]) => {
      loadedSounds[key] = new Howl({
        src: [src],
        loop: key === SOUNDS.AMBIENT,
        volume: key === SOUNDS.AMBIENT ? 0.08 : 0.5, // Lower ambient volume more
        html5: true, // Use HTML5 Audio to allow playback without user interaction
        onload: () => {
          loadedCount++;
          if (loadedCount === totalSounds) {
            setIsInitialized(true);
            console.log("Sounds initialized");
          }
        },
        onloaderror: (_id: any, err: any) => {
          console.error(`Error loading sound ${key}:`, err);
          loadedCount++;
           if (loadedCount === totalSounds) {
             setIsInitialized(true); // Still mark as initialized even if some fail
           }
        }
      });
    });

    soundsRef.current = loadedSounds;

    // Global mute setting
    Howler.mute(!isSoundEnabled);

    // Cleanup
    return () => {
      Object.values(soundsRef.current).forEach(sound => sound.unload());
      setIsInitialized(false);
    };
  }, [isSoundEnabled]); // Re-init if soundEnabled changes (to apply mute)

  const playSound = useCallback((soundName: string, options?: { volume?: number }) => {
    if (isInitialized && isSoundEnabled && soundsRef.current[soundName]) {
      if (options?.volume) {
        soundsRef.current[soundName].volume(options.volume);
      }
      soundsRef.current[soundName].play();
      return soundsRef.current[soundName];
    } else if (!isInitialized) {
      console.warn("Sounds not yet initialized.");
    }
    return null;
  }, [isInitialized, isSoundEnabled]);

  const stopSound = useCallback((soundName: string) => {
    if (isInitialized && soundsRef.current[soundName]) {
      soundsRef.current[soundName].stop();
    }
  }, [isInitialized]);

  const pauseSound = useCallback((soundName: string) => {
    if (isInitialized && soundsRef.current[soundName]) {
      soundsRef.current[soundName].pause();
    }
  }, [isInitialized]);

  const toggleSound = useCallback(() => {
    const newState = !isSoundEnabled;
    setIsSoundEnabledState(newState);
    Howler.mute(!newState);
    // Save preference to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('kakuSoundEnabled', JSON.stringify(newState));
    }
    return newState;
  }, [isSoundEnabled]);

   // Load preference on mount
   useEffect(() => {
     if (typeof window === 'undefined') return;
     
     const savedPreference = localStorage.getItem('kakuSoundEnabled');
     if (savedPreference !== null) {
       const enabled = JSON.parse(savedPreference);
       setIsSoundEnabledState(enabled);
       Howler.mute(!enabled);
     }
   }, []);

  return { 
    playSound, 
    stopSound, 
    pauseSound, 
    toggleSound, 
    isSoundEnabled, 
    isInitialized 
  };
}; 