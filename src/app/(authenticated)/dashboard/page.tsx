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
    // Hide the welcome card and let user proceed with the chat interface
    setShowWelcome(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#121212] text-white">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  // Show onboarding welcome card or chat interface
  if (isFirstTimeUser && showWelcome && !isDemo) {
    return (
      <div className="flex flex-col h-screen bg-[#212121] items-center justify-center p-4">
        <WelcomeCard 
          onUploadClick={handleUploadClick}
          onContinueClick={handleContinueWithoutSamples} 
        />
      </div>
    );
  }

  // Show chat interface when not showing welcome card or for demo users
  return (
    <div className="flex flex-col h-screen bg-[#212121]">
      <ChatInterface />
    </div>
  );
} 