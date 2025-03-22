'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/supabase-auth-context';
import { useCorpus } from '@/contexts/corpus-context';
import { useRouter } from 'next/navigation';
import ChatInterface from '@/components/chat/chat-interface';
import WelcomeCard from '@/components/onboarding/WelcomeCard';

export default function DashboardPage() {
  const { user, isLoading, isDemo, logout } = useAuth();
  const { isFirstTimeUser, uploadDocuments } = useCorpus();
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(true);
  
  useEffect(() => {
    if (!isLoading && !user && !isDemo) {
      router.push('/login');
    }
  }, [user, isLoading, isDemo, router]);

  const handleUploadClick = () => {
    router.push('/samples');
  };

  const handleContinueWithoutSamples = () => {
    // Just hide the welcome card and let user proceed with the chat interface
    setShowWelcome(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#121212] text-white">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#212121]">
      {isFirstTimeUser && showWelcome && (
        <div className="pt-6 px-4">
          <WelcomeCard 
            onUploadClick={handleUploadClick}
            onContinueClick={handleContinueWithoutSamples} 
          />
        </div>
      )}
      <ChatInterface />
    </div>
  );
} 