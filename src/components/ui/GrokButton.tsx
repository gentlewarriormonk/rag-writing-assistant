import React from 'react';
import theme from '../../styles/theme';

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
    secondary: `text-white bg-[${theme.colors.accent.secondary}] hover:bg-[${theme.colors.accent.primary}]`,
    outline: `text-[${theme.colors.accent.primary}] bg-transparent border border-[${theme.colors.accent.primary}] hover:bg-[${theme.colors.accent.primary}]/10`,
  };

  const getButtonStyles = () => {
    if (variant === 'primary') {
      return {
        background: disabled 
          ? theme.colors.accent.tertiary // Disabled gray
          : theme.colors.gradients.grokBlue,
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
            borderLeftColor: variant === 'outline' ? theme.colors.accent.primary : 'white',
            borderTopColor: variant === 'outline' ? theme.colors.accent.secondary : 'rgba(255,255,255,0.7)'
          }}
        />
      )}
      {children}
    </button>
  );
};

export default GrokButton;
