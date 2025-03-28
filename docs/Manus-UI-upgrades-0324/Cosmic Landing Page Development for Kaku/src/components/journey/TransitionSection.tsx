"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '@/components/layout/SectionWrapper';
import KakuCharacter from '@/components/character/KakuCharacter';
import { useAppContext } from '@/context/AppContext';

interface TransitionSectionProps {
  id: string;
}

const TransitionSection: React.FC<TransitionSectionProps> = ({ id }) => {
  const { setKakuEmotion, currentSection, isLandingComplete, setLandingComplete } = useAppContext();

  useEffect(() => {
    if (currentSection === id) {
      setKakuEmotion('excited');
    }
  }, [currentSection, id, setKakuEmotion]);

  return (
    <SectionWrapper id={id} className="h-screen flex items-center justify-center">
      <div className="text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <KakuCharacter emotion="excited" size="large" />
        </motion.div>

        <motion.h2
          className="text-4xl md:text-5xl font-bold font-display mb-6 bg-gradient-to-r from-cosmic-teal to-nebula-blue text-transparent bg-clip-text"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Preparing Your Cosmic Journey
        </motion.h2>

        <motion.p
          className="text-xl text-stellar-white/90 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          I'm so excited to help you explore your creative universe! In just a moment, we'll be ready to begin.
        </motion.p>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          {/* This would typically trigger the actual transition to the app */}
          <button
            onClick={() => setLandingComplete(true)}
            className="px-8 py-3 bg-gradient-to-r from-nebula-blue to-cosmic-teal rounded-full text-stellar-white font-semibold hover:shadow-lg hover:shadow-cosmic-teal/20 transition-all"
          >
            Launch Writer's Space
          </button>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default TransitionSection; 