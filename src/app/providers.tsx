'use client';

import React, { useEffect } from 'react';
import { ThemeProvider } from '@/contexts/theme-context';
import { CorpusProvider } from '@/contexts/corpus-context';
import { AuthProvider } from '@/contexts/auth-context';
import { ChatProvider } from '@/contexts/chat-context';

export function Providers({ children }: { children: React.ReactNode }) {
  // Handle client-side initialization
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    
    // Remove server-side injected CSS
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles?.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <CorpusProvider>
          <ChatProvider>
            {children}
          </ChatProvider>
        </CorpusProvider>
      </ThemeProvider>
    </AuthProvider>
  );
} 