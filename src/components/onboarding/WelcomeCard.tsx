'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface WelcomeCardProps {
  onUploadClick: () => void;
  onContinueClick: () => void;
}

export default function WelcomeCard({ onUploadClick, onContinueClick }: WelcomeCardProps) {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-500/20 shadow-lg p-6 max-w-2xl mx-auto mb-8">
      <div className="flex items-start">
        <div className="flex-shrink-0 bg-blue-500/20 p-3 rounded-full mr-4">
          <svg className="w-8 h-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.357 2.059l.37.185c.115.058.232.11.35.156m-4.8-2.4A2.25 2.25 0 0013.5 8.25h2.25c.984 0 1.814.596 2.157 1.479M15.75 3.104c.251.023.501.05.75.082m-.75-.082a24.301 24.301 0 00-4.5 0m0 0v5.714a2.25 2.25 0 001.357 2.059l.37.185c.115.058.232.11.35.156m0 0a23.925 23.925 0 001.865-.734m-4.8-2.4A2.25 2.25 0 013.5 8.25v-1.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6.75v1.5a2.25 2.25 0 01-1.07 1.916l-.32.16c-.167.083-.334.154-.5.214m-4.8-2.4l1.144-2.293a1.75 1.75 0 011.872-.858l1.76.352" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-medium text-white mb-2">Welcome to Kaku Writing Assistant</h2>
          <p className="text-gray-300 mb-3">
            To write in <span className="text-blue-400 font-medium">your unique style</span>, Kaku needs to analyze your writing samples. 
            These samples help our AI understand your voice, word choice, and writing patterns.
          </p>
          <div className="bg-blue-500/10 p-4 rounded-md border border-blue-500/20 mb-4">
            <h3 className="text-white font-medium mb-2">Why upload writing samples?</h3>
            <ul className="text-gray-300 space-y-2 list-disc pl-5">
              <li>Personalized responses that match your tone and style</li>
              <li>Better understanding of your specialized vocabulary</li>
              <li>More accurate suggestions aligned with your expertise</li>
              <li>Consistent tone across all generated content</li>
            </ul>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Your samples are stored securely and only used to improve your experience. You can delete them anytime.
          </p>
          <div className="flex space-x-3">
            <Button 
              onClick={onUploadClick}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4"
            >
              Upload Writing Samples
            </Button>
            <Button 
              onClick={onContinueClick}
              variant="outline"
              className="bg-transparent border-gray-600 hover:bg-gray-800 text-gray-300"
            >
              Continue Without Samples
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 