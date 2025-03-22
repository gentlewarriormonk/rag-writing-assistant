'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/supabase-auth-context';
import { Button } from '@/components/ui/button';

export default function DemoModeButton() {
  const { enterDemoMode } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDemoMode = async () => {
    setIsLoading(true);
    try {
      await enterDemoMode();
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to enter demo mode:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 text-center">
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[#1e1e1e] px-2 text-gray-400">or</span>
        </div>
      </div>
      
      <Button
        variant="outline"
        onClick={handleDemoMode}
        disabled={isLoading}
        className="w-full mt-2"
      >
        {isLoading ? 'Loading...' : 'Try Demo Mode'}
      </Button>
      
      <p className="mt-2 text-xs text-gray-500">
        No account required. Experience the app with limited features.
      </p>
    </div>
  );
}
