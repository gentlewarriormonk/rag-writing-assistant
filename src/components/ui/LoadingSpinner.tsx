import React from 'react';
import theme from '../../styles/theme';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...' 
}) => {
  // Map size to pixel values
  const sizeMap = {
    sm: {
      spinner: 'h-5 w-5',
      container: 'p-2',
      textSize: 'text-xs'
    },
    md: {
      spinner: 'h-8 w-8',
      container: 'p-3',
      textSize: 'text-sm'
    },
    lg: {
      spinner: 'h-12 w-12',
      container: 'p-4',
      textSize: 'text-base'
    }
  };

  const { spinner, container, textSize } = sizeMap[size];

  return (
    <div className={`flex flex-col items-center justify-center ${container}`}>
      <div className={`${spinner} relative`}>
        {/* Grok-style spinner with gradient */}
        <div 
          className={`${spinner} rounded-full border-2 border-solid border-r-transparent border-b-transparent animate-spin`}
          style={{ 
            borderLeftColor: theme.colors.accent.primary,
            borderTopColor: theme.colors.accent.secondary,
          }}
        />
      </div>
      {text && (
        <p className={`mt-2 ${textSize}`} style={{ color: theme.colors.text.secondary }}>{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
