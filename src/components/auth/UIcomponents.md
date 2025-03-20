// src/components/ui/LoadingSpinner.tsx
import React from 'react';

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
          className={`${spinner} rounded-full border-2 border-solid border-r-transparent border-b-transparent`}
          style={{ 
            borderLeftColor: '#0077b6',
            borderTopColor: '#00a8e8',
            animation: 'spin 1s linear infinite' 
          }}
        />
      </div>
      {text && (
        <p className={`mt-2 text-gray-700 ${textSize}`}>{text}</p>
      )}
      
      {/* CSS for the animation */}
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;

// src/components/ui/ThinkingIndicator.tsx
import React from 'react';

interface ThinkingIndicatorProps {
  duration?: number;
  message?: string;
  showSpinner?: boolean;
}

const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({ 
  duration, 
  message = 'Thinking', 
  showSpinner = true 
}) => {
  return (
    <div className="w-full max-w-md mx-auto my-4">
      <div className="rounded-xl overflow-hidden bg-gray-900 text-white">
        <div className="flex items-center p-4">
          {showSpinner && (
            <div className="mr-3 relative h-8 w-8">
              <div 
                className="h-full w-full rounded-full border-2 border-solid border-r-transparent border-b-transparent animate-spin"
                style={{ 
                  borderLeftColor: '#0077b6',
                  borderTopColor: '#00a8e8'
                }}
              />
            </div>
          )}
          <div className="flex-1">
            <p className="font-medium text-xl">{message}</p>
            <p className="text-gray-400 text-sm">Tap to read my mind</p>
          </div>
          <div className="ml-2">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M9 18L15 12L9 6" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThinkingIndicator;

// src/components/ui/GrokButton.tsx
import React from 'react';

interface GrokButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const GrokButton: React.FC<GrokButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  type = 'button',
  className = '',
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };

  // Base classes
  const baseClasses = 'font-medium rounded-md focus:outline-none transition-all duration-200 flex items-center justify-center';

  // Variant classes
  const variantClasses = {
    primary: 'text-white',
    secondary: 'text-white bg-[#00a8e8] hover:bg-[#0077b6]',
    outline: 'text-[#0077b6] bg-transparent border border-[#0077b6] hover:bg-[#0077b6]/10',
  };

  const getButtonStyles = () => {
    if (variant === 'primary') {
      return {
        background: disabled 
          ? '#94a3b8' // Disabled gray
          : 'linear-gradient(90deg, #0077b6 0%, #00a8e8 100%)',
      };
    }
    return {};
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${baseClasses} 
        ${sizeClasses[size]} 
        ${variantClasses[variant]} 
        ${disabled || isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md'} 
        ${className}
      `}
      style={getButtonStyles()}
    >
      {isLoading && (
        <span className="mr-2 h-4 w-4 rounded-full border-2 border-solid border-r-transparent border-b-transparent animate-spin inline-block" 
          style={{ 
            borderLeftColor: variant === 'outline' ? '#0077b6' : 'white',
            borderTopColor: variant === 'outline' ? '#00a8e8' : 'rgba(255,255,255,0.7)'
          }}
        />
      )}
      {children}
    </button>
  );
};

export default GrokButton;
