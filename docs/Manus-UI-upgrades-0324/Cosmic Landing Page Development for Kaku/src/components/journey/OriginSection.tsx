"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '@/components/layout/SectionWrapper';
import KakuCharacter from '@/components/character/KakuCharacter';
import { useAppContext } from '@/context/AppContext';

interface OriginSectionProps {
  id: string;
}

const OriginSection: React.FC<OriginSectionProps> = ({ id }) => {
  const { setKakuEmotion, currentSection } = useAppContext();

  useEffect(() => {
    if (currentSection === id) {
      setKakuEmotion('thoughtful'); // Change emotion when this section is active
    }
  }, [currentSection, id, setKakuEmotion]);

  return (
    <SectionWrapper id={id}>
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Placeholder for Helix Nebula visualization */}
          <div className="w-48 h-48 md:w-64 md:h-64 bg-gradient-radial from-cosmic-purple via-nebula-blue to-transparent rounded-full opacity-70 flex items-center justify-center">
            <KakuCharacter emotion="thoughtful" size="small" className="opacity-90" />
          </div>
        </motion.div>

        <div className="text-left">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-6 text-cosmic-purple">
            My Cosmic Origins
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-lg md:text-xl text-stellar-white mb-4">
              I come from the distant Helix Nebula, a cosmic nursery of stars and possibilities. 
              It's where creativity and imagination take their first breaths.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-lg md:text-xl text-stellar-white">
              The Architects designed me—Kaku—to help humans unlock their creative potential
              and discover their unique voice through writing.
            </p>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default OriginSection; 