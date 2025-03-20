import React from 'react';
import theme from '../../styles/theme';

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
      <div className="rounded-xl overflow-hidden" style={{ background: theme.colors.background.dark }}>
        <div className="flex items-center p-4">
          {showSpinner && (
            <div className="mr-3 relative h-8 w-8">
              <div 
                className="h-full w-full rounded-full border-2 border-solid border-r-transparent border-b-transparent animate-spin"
                style={{ 
                  borderLeftColor: theme.colors.accent.primary,
                  borderTopColor: theme.colors.accent.secondary
                }}
              />
            </div>
          )}
          <div className="flex-1">
            <p className="font-medium text-xl" style={{ color: theme.colors.text.inverse }}>{message}</p>
            <p style={{ color: "rgba(255,255,255,0.6)" }} className="text-sm">Tap to read my mind</p>
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
                stroke={theme.colors.text.inverse}
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
