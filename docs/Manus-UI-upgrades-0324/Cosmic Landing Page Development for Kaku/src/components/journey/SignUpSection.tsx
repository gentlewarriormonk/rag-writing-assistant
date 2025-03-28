"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '@/components/layout/SectionWrapper';
import KakuCharacter from '@/components/character/KakuCharacter';
import SignUpForm from '@/components/ui/SignUpForm';
import { useAppContext } from '@/context/AppContext';

interface SignUpSectionProps {
  id: string;
}

const SignUpSection: React.FC<SignUpSectionProps> = ({ id }) => {
  const { setKakuEmotion, currentSection } = useAppContext();

  useEffect(() => {
    if (currentSection === id) {
      setKakuEmotion('playful');
    }
  }, [currentSection, id, setKakuEmotion]);

  return (
    <SectionWrapper id={id}>
      <div className="flex flex-col items-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 text-center bg-gradient-to-r from-nebula-pink to-cosmic-purple text-transparent bg-clip-text">
            Ready to Begin Our Adventure?
          </h2>
        </motion.div>
        
        <motion.p
          className="text-xl text-stellar-white/80 max-w-2xl text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Join me on a journey to unlock your creative potential and discover your unique voice!
        </motion.p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        {/* SignUpForm */}
        <SignUpForm />

        {/* Kaku Character */}
        <motion.div
          className="hidden md:block"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <KakuCharacter emotion="playful" size="large" />
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default SignUpSection; 