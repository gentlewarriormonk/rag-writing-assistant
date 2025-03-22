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
      // Reset height to auto to accurately calculate scroll height
      inputRef.current.style.height = 'auto';
      
      // Calculate new height based on content, with a maximum of around 10 rows
      const maxHeight = 240; // Approximately 10 rows at 24px per row
      const newHeight = Math.min(inputRef.current.scrollHeight, maxHeight);
      
      inputRef.current.style.height = `${newHeight}px`;
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading) return;
    
    await onSendMessage(message);
    setMessage('');
    
    // Reset height to 2 rows after sending
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-end bg-[#2e2e2e] rounded-lg border border-gray-700 focus-within:border-[#00a8e8] focus-within:shadow-[0_0_0_1px_rgba(0,168,232,0.3)] hover:border-blue-500/50 transition-colors max-w-[85%] mx-auto">
        <textarea
          ref={inputRef}
          value={message}
          onChange={handleInputChange}
          placeholder="Send a message..."
          className="w-full resize-none px-4 py-3 bg-transparent text-white focus:outline-none focus:ring-0 overflow-y-auto"
          rows={2} // Start with 2 rows
          maxLength={5000} // Set a reasonable character limit
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          disabled={isLoading}
          style={{ 
            minHeight: '60px', // About 2 rows
            maxHeight: '192px'  // About 8 rows (reduced from 10)
          }}
        />
        
        <button
          type="submit"
          className={`
            px-4 py-3 rounded-lg self-end
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