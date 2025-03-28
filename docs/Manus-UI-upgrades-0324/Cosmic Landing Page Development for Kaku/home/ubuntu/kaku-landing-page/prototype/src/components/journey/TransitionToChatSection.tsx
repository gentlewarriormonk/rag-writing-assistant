'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAccessibility } from '@/context/AccessibilityContext';

interface TransitionToChatSectionProps {
  isActive: boolean;
  userData?: any;
  onTransitionComplete?: () => void;
}

const TransitionToChatSection: React.FC<TransitionToChatSectionProps> = ({
  isActive,
  userData,
  onTransitionComplete
}) => {
  const [transitionPhase, setTransitionPhase] = React.useState<'initial' | 'opening' | 'materializing' | 'complete'>('initial');
  const [chatInterfaceReady, setChatInterfaceReady] = React.useState(false);
  const [welcomeMessageProgress, setWelcomeMessageProgress] = React.useState(0);
  
  const { reducedMotion } = useAccessibility();

  // Start transition when section becomes active
  React.useEffect(() => {
    if (isActive && transitionPhase === 'initial') {
      startTransition();
    }
  }, [isActive, transitionPhase]);

  // Start transition animation
  const startTransition = () => {
    if (reducedMotion) {
      // Skip animation for reduced motion
      setTransitionPhase('complete');
      setChatInterfaceReady(true);
      setWelcomeMessageProgress(1);
      if (onTransitionComplete) {
        setTimeout(onTransitionComplete, 1000);
      }
      return;
    }

    // Begin portal opening phase
    setTransitionPhase('opening');
    
    // Simulate phased transition
    setTimeout(() => {
      setTransitionPhase('materializing');
      
      // Start materializing interface
      const materializeDuration = 3000;
      const startTime = Date.now();
      
      const updateMaterializeProgress = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, elapsed / materializeDuration);
        
        materializeInterface(progress);
        
        if (progress < 1) {
          requestAnimationFrame(updateMaterializeProgress);
        } else {
          setTransitionPhase('complete');
          setChatInterfaceReady(true);
          animateWelcomeMessage();
        }
      };
      
      requestAnimationFrame(updateMaterializeProgress);
    }, 2000);
  };

  // Materialize chat interface elements
  const materializeInterface = (progress: number) => {
    // In a real implementation, this would animate in the chat interface elements
    // For the prototype, we'll just update the progress state
    if (progress >= 1) {
      setChatInterfaceReady(true);
    }
  };

  // Animate typing of welcome message
  const animateWelcomeMessage = () => {
    const typingDuration = 2000;
    const startTime = Date.now();
    
    const updateTypingProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / typingDuration);
      
      setWelcomeMessageProgress(progress);
      
      if (progress < 1) {
        requestAnimationFrame(updateTypingProgress);
      } else if (onTransitionComplete) {
        setTimeout(onTransitionComplete, 1000);
      }
    };
    
    requestAnimationFrame(updateTypingProgress);
  };

  // Portal animation variants
  const portalVariants = {
    initial: { 
      scale: 0, 
      opacity: 0 
    },
    opening: { 
      scale: [0, 1, 1.2, 1], 
      opacity: 1,
      transition: { 
        duration: 2,
        times: [0, 0.6, 0.8, 1],
        ease: "easeInOut" 
      }
    }
  };

  // Chat interface animation variants
  const chatInterfaceVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  // Welcome message animation
  const getTypedMessage = (message: string, progress: number) => {
    const charactersToShow = Math.floor(message.length * progress);
    return message.substring(0, charactersToShow);
  };

  return (
    <section 
      id="chat" 
      className={`chat-transition-section min-h-screen flex flex-col items-center justify-center p-4 ${isActive ? 'active' : ''}`}
    >
      <div className="relative z-10 max-w-4xl mx-auto w-full">
        {transitionPhase === 'initial' || transitionPhase === 'opening' ? (
          <div className="portal-container flex flex-col items-center justify-center">
            <motion.div
              className="cosmic-portal w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center"
              variants={portalVariants}
              initial="initial"
              animate={transitionPhase === 'opening' ? 'opening' : 'initial'}
            >
              <div className="portal-inner w-24 h-24 bg-blue-700 rounded-full flex items-center justify-center">
                <div className="portal-core w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">→</span>
                </div>
              </div>
            </motion.div>
            
            <motion.p
              className="text-white text-xl mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: transitionPhase === 'opening' ? 1 : 0 }}
              transition={{ delay: 0.5 }}
            >
              Opening your writing space...
            </motion.p>
          </div>
        ) : (
          <motion.div
            className="chat-interface bg-black bg-opacity-80 backdrop-blur-md rounded-lg border border-gray-700 overflow-hidden"
            initial="hidden"
            animate={chatInterfaceReady ? "visible" : "hidden"}
            variants={chatInterfaceVariants}
          >
            {/* Chat header */}
            <motion.div 
              className="chat-header p-4 border-b border-gray-700 flex items-center"
              variants={chatInterfaceVariants}
            >
              <div className="kaku-avatar w-10 h-10 bg-white rounded-full mr-3 flex items-center justify-center">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">K</span>
                </div>
              </div>
              <div>
                <h3 className="text-white font-medium">Kaku</h3>
                <p className="text-gray-400 text-xs">Your cosmic writing assistant</p>
              </div>
            </motion.div>
            
            {/* Chat messages */}
            <motion.div 
              className="chat-messages p-4 h-64 overflow-y-auto"
              variants={chatInterfaceVariants}
            >
              <div className="message flex mb-4">
                <div className="kaku-avatar w-8 h-8 bg-white rounded-full mr-2 flex-shrink-0 flex items-center justify-center">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">K</span>
                  </div>
                </div>
                <div className="message-bubble bg-blue-600 text-white p-3 rounded-lg rounded-tl-none max-w-xs">
                  <p>
                    {getTypedMessage(`Welcome, ${userData?.name || 'friend'}! I'm so excited to begin our writing journey together.`, welcomeMessageProgress)}
                    {welcomeMessageProgress < 1 && (
                      <span className="typing-indicator inline-block w-2 h-4 ml-1 bg-white animate-pulse"></span>
                    )}
                  </p>
                </div>
              </div>
              
              {welcomeMessageProgress === 1 && (
                <motion.div 
                  className="message flex mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="kaku-avatar w-8 h-8 bg-white rounded-full mr-2 flex-shrink-0 flex items-center justify-center">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">K</span>
                    </div>
                  </div>
                  <div className="message-bubble bg-blue-600 text-white p-3 rounded-lg rounded-tl-none max-w-xs">
                    <p>What would you like to write about today?</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
            
            {/* Chat input */}
            <motion.div 
              className="chat-input p-4 border-t border-gray-700"
              variants={chatInterfaceVariants}
            >
              <div className="flex">
                <input
                  type="text"
                  className="flex-grow bg-gray-800 text-white rounded-l-md px-4 py-2 focus:outline-none"
                  placeholder="Type your message..."
                  disabled={!chatInterfaceReady || welcomeMessageProgress < 1}
                />
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-md"
                  disabled={!chatInterfaceReady || welcomeMessageProgress < 1}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TransitionToChatSection;
