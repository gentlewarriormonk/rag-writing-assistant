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
        <div className="flex-shrink-0 mr-4">
          <img 
            src="/kaku/kaku-avatar.png" 
            alt="Kaku" 
            className="w-16 h-16"
          />
        </div>
        <div>
          <h2 className="text-xl font-medium text-white mb-2">Welcome to Kaku, Your AI Writing Assistant</h2>
          <p className="text-gray-300 mb-3">
            To write in <span className="text-blue-400 font-medium">your unique style</span>, I need to analyze your writing samples. 
            These samples help me understand your voice, word choice, and writing patterns.
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