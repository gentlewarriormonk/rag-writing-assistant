'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCorpus } from '@/contexts/corpus-context';
import FileUploadButton from './file-upload-button';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { isFirstTimeUser, isCorpusReady } = useCorpus();

  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle text area height based on content
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading) return;
    
    await onSendMessage(message);
    setMessage('');
    
    // Reset height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      {isFirstTimeUser && !isCorpusReady && (
        <div className="bg-[#0077b6]/20 text-white rounded-lg p-3 mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm">
              You haven't uploaded any writing samples yet. Upload samples to get responses in your style.
            </p>
          </div>
          <FileUploadButton />
        </div>
      )}
      
      <div className="relative flex items-end bg-[#2d3748] rounded-lg border border-gray-700 focus-within:border-[#00a8e8] transition-colors">
        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Send a message..."
          className="w-full resize-none px-4 py-3 max-h-[200px] bg-transparent text-white focus:outline-none focus:ring-0"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          disabled={isLoading}
        />
        
        <button
          type="submit"
          className={`
            px-4 py-3 rounded-lg 
            ${isLoading || !message.trim() 
              ? 'text-gray-500 cursor-not-allowed' 
              : 'text-[#00a8e8] hover:text-white'}
          `}
          disabled={isLoading || !message.trim()}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-6 h-6 transform rotate-90"
          >
            <path 
              d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" 
            />
          </svg>
        </button>
      </div>
    </form>
  );
} 