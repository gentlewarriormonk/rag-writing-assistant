'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/supabase-auth-context';
import { useRouter } from 'next/navigation';
import SampleManager from '@/components/corpus/SampleManager';

export default function SamplesPage() {
  const { user, isLoading, isDemo } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !user && !isDemo) {
      router.push('/login');
    }
  }, [user, isLoading, isDemo, router]);

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#212121] text-white">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#212121] text-white py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center mb-6">
          <button 
            onClick={handleBackToDashboard}
            className="text-gray-400 hover:text-white mr-4"
            aria-label="Back to dashboard"
          >
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold">Writing Samples</h1>
        </div>
        
        <SampleManager />
      </div>
    </div>
  );
} 