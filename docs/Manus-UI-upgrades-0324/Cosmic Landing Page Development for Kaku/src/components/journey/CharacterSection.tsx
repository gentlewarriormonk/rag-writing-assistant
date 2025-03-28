"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '@/components/layout/SectionWrapper';
import KakuCharacter from '@/components/character/KakuCharacter';
import { useAppContext } from '@/context/AppContext';

interface CharacterSectionProps {
  id: string;
}

const CharacterSection: React.FC<CharacterSectionProps> = ({ id }) => {
  const { setKakuEmotion, currentSection } = useAppContext();

  useEffect(() => {
    if (currentSection === id) {
      setKakuEmotion('curious');
    }
  }, [currentSection, id, setKakuEmotion]);

  const traits = [
    { emoji: '✨', trait: 'Curious', description: 'Always eager to learn more about you and your ideas' },
    { emoji: '🌟', trait: 'Supportive', description: 'Here to encourage your creative journey, not judge it' },
    { emoji: '🌌', trait: 'Cosmic', description: 'Bringing a unique perspective from beyond the stars' },
    { emoji: '🎭', trait: 'Playful', description: 'Making the writing process fun and engaging' },
  ];

  return (
    <SectionWrapper id={id}>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 text-nebula-blue">
          Getting to Know Me
        </h2>
        <p className="text-xl text-stellar-white/80 max-w-2xl mx-auto">
          I'm not just any AI assistant - I bring my own personality to our creative journey together!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {traits.map((item, index) => (
          <motion.div
            key={item.trait}
            className="bg-cosmic-black/30 backdrop-blur-sm border border-stellar-white/10 rounded-lg p-6 flex items-start gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
          >
            <div className="text-4xl">{item.emoji}</div>
            <div className="text-left">
              <h3 className="text-xl font-semibold text-stellar-white mb-2">{item.trait}</h3>
              <p className="text-stellar-white/70">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <KakuCharacter emotion="curious" size="large" />
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default CharacterSection; 