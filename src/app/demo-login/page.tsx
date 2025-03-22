'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/supabase-auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DemoLoginPage() {
  const { enterDemoMode } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // For step-by-step demo information
  
  const handleDemoMode = async () => {
    setIsLoading(true);
    try {
      await enterDemoMode();
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to enter demo mode:', error);
      setIsLoading(false);
    }
  };
  
  const getStepContent = () => {
    switch(step) {
      case 1:
        return {
          title: "Experience Without Commitment",
          description: "Try Kaku's core features without creating an account or providing any credentials.",
          icon: "🚀"
        };
      case 2:
        return {
          title: "Limited but Powerful",
          description: "Demo mode gives you access to essential features like document creation and AI assistance with usage limits.",
          icon: "⚡"
        };
      case 3:
        return {
          title: "Your Data Stays Local",
          description: "In demo mode, your data is stored only in your browser and will be cleared when you exit.",
          icon: "🔒"
        };
      default:
        return {
          title: "Experience Without Commitment",
          description: "Try Kaku's core features without creating an account or providing any credentials.",
          icon: "🚀"
        };
    }
  };
  
  const stepContent = getStepContent();

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col justify-center items-center py-12 px-4">
      <Link href="/" className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 010 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back
      </Link>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="h-12 w-12 bg-gradient-to-br from-[#0077b6] to-[#00a8e8] rounded-lg flex items-center justify-center">
            <span className="text-white text-2xl font-bold">書</span>
          </div>
        </div>
        <h1 className="text-center text-3xl font-bold">
          <span className="bg-gradient-to-r from-[#0077b6] to-[#00a8e8] text-transparent bg-clip-text">
            Kaku Demo Mode
          </span>
        </h1>
        <h2 className="mt-2 text-center text-sm font-medium text-gray-400">
          Try the AI Writing Assistant without an account
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative">
        {/* Step indicator */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {[1, 2, 3].map((i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-1.5 rounded-full transition-all ${
                step === i ? 'w-8 bg-blue-500' : 'w-4 bg-gray-600'
              }`}
              aria-label={`Step ${i}`}
            />
          ))}
        </div>
        
        <div className="bg-[#1e1e1e] py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-800">
          {/* Step content with animation */}
          <div className="text-center mb-6 min-h-[120px] flex flex-col items-center justify-center transition-all duration-300 transform">
            <div className="text-3xl mb-3">{stepContent.icon}</div>
            <h3 className="text-lg font-medium mb-2">{stepContent.title}</h3>
            <p className="text-gray-400 text-sm">{stepContent.description}</p>
          </div>
          
          {/* Demo Button */}
          <div className="mt-6">
            <Button
              type="button"
              variant="default"
              className="w-full bg-gradient-to-r from-[#0077b6] to-[#00a8e8] hover:from-[#00a8e8] hover:to-[#0077b6] transition-all duration-300"
              onClick={handleDemoMode}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Starting Demo...
                </span>
              ) : (
                'Enter Demo Mode'
              )}
            </Button>
            
            <div className="mt-6 flex justify-center">
              <p className="text-center text-xs text-gray-400 max-w-xs">
                By entering demo mode, you agree to our <Link href="#" className="text-blue-400 hover:underline">Terms of Service</Link> and <Link href="#" className="text-blue-400 hover:underline">Privacy Policy</Link>
              </p>
            </div>
          </div>
          
          {/* Account links */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-[#1e1e1e] text-gray-400">
                Already have an account?
              </span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 gap-3">
            <Link 
              href="/login"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm bg-transparent text-sm font-medium text-gray-300 hover:bg-gray-800"
            >
              Sign In
            </Link>
            
            <Link 
              href="/register"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm bg-transparent text-sm font-medium text-gray-300 hover:bg-gray-800"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 