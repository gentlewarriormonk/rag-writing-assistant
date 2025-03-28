"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';

interface SectionWrapperProps {
  children: React.ReactNode;
  id: string;
  className?: string;
  // Add props for specific GSAP triggers if needed, or handle in parent
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ 
  children, 
  id, 
  className = '' 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 }); // Trigger animation once when 30% visible
  const { isReducedMotion } = useAppContext();

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      id={id}
      ref={ref}
      className={`min-h-screen py-20 md:py-32 px-6 md:px-12 relative flex flex-col items-center justify-center ${className}`}
    >
      <motion.div
        className="w-full max-w-4xl mx-auto"
        variants={!isReducedMotion ? variants : undefined}
        initial={!isReducedMotion ? "hidden" : "visible"}
        animate={isInView && !isReducedMotion ? "visible" : undefined}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </section>
  );
};

export default SectionWrapper; 