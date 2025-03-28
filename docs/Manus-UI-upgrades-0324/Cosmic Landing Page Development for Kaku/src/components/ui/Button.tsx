"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "px-6 py-2 rounded-md font-semibold transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cosmic-black disabled:opacity-50 disabled:cursor-not-allowed";
  const primaryStyle = "bg-gradient-to-r from-nebula-blue to-cosmic-teal text-stellar-white hover:from-nebula-blue hover:to-cosmic-teal hover:shadow-lg focus:ring-cosmic-teal";
  const secondaryStyle = "bg-cosmic-black border border-nebula-blue text-stellar-white hover:bg-nebula-blue/10 focus:ring-nebula-blue";

  const style = variant === 'primary' ? primaryStyle : secondaryStyle;

  return (
    <motion.button
      className={`${baseStyle} ${style} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button; 