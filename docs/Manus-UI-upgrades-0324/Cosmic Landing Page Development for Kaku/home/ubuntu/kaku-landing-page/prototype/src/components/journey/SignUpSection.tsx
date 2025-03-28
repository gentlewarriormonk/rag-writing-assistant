'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAccessibility } from '@/context/AccessibilityContext';

interface SignUpSectionProps {
  isActive: boolean;
  onSignUpComplete?: (userData: any) => void;
}

const SignUpSection: React.FC<SignUpSectionProps> = ({
  isActive,
  onSignUpComplete
}) => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    interests: [] as string[]
  });
  
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [formStatus, setFormStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [kakuReaction, setKakuReaction] = React.useState<'encouraging' | 'celebrating' | 'helping'>('encouraging');
  
  const { reducedMotion } = useAccessibility();

  // Handle form submission
  const handleSubmit = (data: any) => {
    setFormData(data);
    setFormStatus('submitting');
    
    // Simulate API call
    setTimeout(() => {
      setFormStatus('success');
      setKakuReaction('celebrating');
      
      if (onSignUpComplete) {
        onSignUpComplete(data);
      }
    }, 2000);
  };

  // Update Kaku's reaction based on form interaction
  const updateKakuReaction = (field: string, isValid: boolean) => {
    if (!isValid) {
      setKakuReaction('helping');
    } else {
      setKakuReaction('encouraging');
    }
  };

  // Make the updateKakuReaction function available globally
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).kakuReactToFormField = updateKakuReaction;
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).kakuReactToFormField;
      }
    };
  }, []);

  return (
    <section 
      id="signup" 
      className={`signup-section min-h-screen flex flex-col items-center justify-center p-4 ${isActive ? 'active' : ''}`}
    >
      <div className="relative z-10 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            className="kaku-container text-center md:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ 
              opacity: isActive ? 1 : 0, 
              x: isActive ? 0 : -50 
            }}
            transition={{ duration: reducedMotion ? 0.1 : 0.5 }}
          >
            <div className="kaku-placeholder mb-8">
              <motion.div 
                className="w-32 h-32 bg-white rounded-full mx-auto md:mx-0 flex items-center justify-center"
                animate={{ 
                  y: [0, -10, 0],
                  scale: kakuReaction === 'celebrating' ? [1, 1.1, 1] : 1
                }}
                transition={{ 
                  y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                  scale: { repeat: kakuReaction === 'celebrating' ? Infinity : 0, duration: 0.5 }
                }}
              >
                <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center">
                  <div className="text-white text-2xl">Kaku</div>
                </div>
              </motion.div>
            </div>
            
            <motion.div
              className="kaku-message mb-6"
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.3 }}
            >
              {kakuReaction === 'encouraging' && (
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  I'm excited to guide your writing journey!
                </h2>
              )}
              
              {kakuReaction === 'helping' && (
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Let me help you complete this step!
                </h2>
              )}
              
              {kakuReaction === 'celebrating' && (
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Wonderful! We're ready to begin!
                </h2>
              )}
              
              <p className="text-lg text-gray-300">
                {formStatus === 'success' 
                  ? "Your cosmic writing adventure is about to begin!"
                  : "Join me to discover your unique voice and find your ikigai through writing."}
              </p>
            </motion.div>
          </motion.div>
          
          <motion.div
            className="form-container"
            initial={{ opacity: 0, x: 50 }}
            animate={{ 
              opacity: isActive ? 1 : 0, 
              x: isActive ? 0 : 50 
            }}
            transition={{ duration: reducedMotion ? 0.1 : 0.5 }}
          >
            {formStatus === 'success' ? (
              <motion.div
                className="success-message bg-black bg-opacity-70 backdrop-blur-md rounded-lg p-6 border border-gray-700 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="success-icon mb-4">
                  <svg 
                    className="w-16 h-16 text-green-500 mx-auto" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">Welcome Aboard, {formData.name}!</h3>
                <p className="text-gray-300 mb-6">Your account has been created successfully.</p>
                
                <motion.div
                  className="cosmic-portal"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 3
                  }}
                >
                  <div className="w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white">→</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">Preparing your writing space...</p>
                </motion.div>
              </motion.div>
            ) : (
              <SignUpForm 
                onSubmit={handleSubmit} 
                isSubmitting={formStatus === 'submitting'} 
              />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Import the SignUpForm component
import SignUpForm from '../ui/SignUpForm';

export default SignUpSection;
