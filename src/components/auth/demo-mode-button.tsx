'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/supabase-auth-context';

/**
 * An enhanced button that allows users to enter or exit demo mode
 * with visual feedback and transitions
 */
const DemoModeButton = () => {
  const { isDemo, enterDemoMode, exitDemoMode } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const router = useRouter();

  const handleClick = async () => {
    setIsLoading(true);
    setFeedbackMessage('');
    
    try {
      if (isDemo) {
        await exitDemoMode();
        setFeedbackMessage('Exited demo mode');
        // After a brief delay to show the message, redirect
        setTimeout(() => router.push('/'), 1000);
      } else {
        await enterDemoMode();
        setFeedbackMessage('Entered demo mode');
        // After a brief delay to show the message, redirect
        setTimeout(() => router.push('/dashboard'), 1000);
      }
    } catch (error) {
      console.error(`Failed to ${isDemo ? 'exit' : 'enter'} demo mode:`, error);
      setFeedbackMessage(`Error: Could not ${isDemo ? 'exit' : 'enter'} demo mode`);
    } finally {
      // Keep loading state active for a moment to show the feedback message
      setTimeout(() => setIsLoading(false), 1500);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-[#1e1e1e] text-gray-400">
            {isDemo ? 'Currently in demo mode' : 'No account?'}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col items-center space-y-2">
        <Button
          type="button"
          variant={isDemo ? "outline" : "default"}
          className={`w-full transition-all duration-300 ${
            isDemo 
              ? 'border-red-700 hover:border-red-600 hover:bg-red-900/10 text-red-500' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          onClick={handleClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isDemo ? 'Exiting demo mode...' : 'Entering demo mode...'}
            </span>
          ) : (
            <span>{isDemo ? 'Exit Demo Mode' : 'Try Demo Mode'}</span>
          )}
        </Button>
        
        {feedbackMessage && (
          <p className={`text-sm transition-opacity duration-300 ${
            isDemo ? 'text-red-400' : 'text-blue-400'
          }`}>
            {feedbackMessage}
          </p>
        )}
        
        <p className="text-xs text-center text-gray-400 max-w-[90%]">
          {isDemo 
            ? 'You currently have access to limited features. Sign in for full access.' 
            : 'Experience the application with limited features. No account required.'}
        </p>
      </div>
    </div>
  );
};

export default DemoModeButton;
