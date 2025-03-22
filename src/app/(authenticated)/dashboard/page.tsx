'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/supabase-auth-context';
import { useRouter } from 'next/navigation';
import ChatInterface from '@/components/chat/chat-interface';

export default function DashboardPage() {
  const { user, isLoading, isDemo, logout } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !user && !isDemo) {
      router.push('/login');
    }
  }, [user, isLoading, isDemo, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#121212] text-white">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return <ChatInterface />;
} 