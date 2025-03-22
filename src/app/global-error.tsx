'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#121212] text-white">
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="max-w-md w-full bg-[#1a1a1a] rounded-lg shadow-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
            
            <div className="bg-red-900/20 border border-red-800 rounded p-3 mb-4 text-sm">
              <p className="text-red-300">
                {error.message || 'A critical error occurred'}
              </p>
              {error.digest && (
                <p className="text-red-400 mt-1 text-xs">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
            
            <p className="text-gray-400 mb-4 text-sm">
              The application encountered a critical error. Try refreshing the page.
            </p>
            
            <Button 
              onClick={reset}
              className="w-full"
            >
              Try again
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
} 