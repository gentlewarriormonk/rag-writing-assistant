"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '@/components/layout/SectionWrapper';
import KakuCharacter from '@/components/character/KakuCharacter';
import { useAppContext } from '@/context/AppContext';

interface MissionSectionProps {
  id: string;
}

const MissionSection: React.FC<MissionSectionProps> = ({ id }) => {
  const { setKakuEmotion, currentSection } = useAppContext();

  useEffect(() => {
    if (currentSection === id) {
      setKakuEmotion('encouraging');
    }
  }, [currentSection, id, setKakuEmotion]);

  const features = [
    {
      title: "Creative Collaboration",
      description: "Together, we'll build worlds, craft stories, and bring your ideas to life.",
      icon: (
        <svg className="w-10 h-10 text-cosmic-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "Personalized Guidance",
      description: "As we work together, I'll learn your style and provide increasingly tailored support.",
      icon: (
        <svg className="w-10 h-10 text-cosmic-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: "Cosmic Inspiration",
      description: "When you're stuck, I'll help you see possibilities you might not have considered.",
      icon: (
        <svg className="w-10 h-10 text-cosmic-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    }
  ];

  return (
    <SectionWrapper id={id}>
      <div className="flex flex-col-reverse md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-6 text-cosmic-teal">
              My Mission For You
            </h2>
            <p className="text-xl text-stellar-white mb-8">
              I'm here to be your creative companion, helping you find your unique voice
              and express yourself through writing.
            </p>
          </motion.div>

          <div className="space-y-8">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.title}
                className="flex gap-4 items-start"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <div className="flex-shrink-0 mt-1">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-stellar-white mb-2">{feature.title}</h3>
                  <p className="text-stellar-white/70">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <KakuCharacter emotion="encouraging" size="large" />
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default MissionSection; 