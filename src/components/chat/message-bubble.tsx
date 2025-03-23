'use client';

import React from 'react';
import Image from 'next/image';
import { Message } from '@/contexts/chat-context';
import { useTheme } from '@/contexts/theme-context';
// Temporarily comment out ReactMarkdown
// import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  message: Message;
  isLoading?: boolean;
}

export default function MessageBubble({ message, isLoading = false }: MessageBubbleProps) {
  const { colors } = useTheme();
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start ${isUser ? 'justify-end' : 'justify-start'} gap-3`}>
      {/* Kaku icon for assistant messages */}
      {!isUser && (
        <div className="flex-shrink-0 w-12 h-12 mt-0">
          <Image
            src="/kaku/kaku-avatar.png" 
            alt="Kaku"
            width={48}
            height={48}
            className="rounded-full"
          />
        </div>
      )}
      
      <div 
        className={`
          max-w-3xl rounded-2xl px-4 py-3 
          ${isUser 
            ? 'bg-[#0077b6] text-white' 
            : 'bg-[#1e1e1e] text-white border border-gray-800/40 shadow-lg'
          }
          ${isLoading ? 'opacity-70' : ''}
        `}
      >
        {isLoading ? (
          <div className="h-6 w-6 flex items-center justify-center">
            <div className="animate-pulse h-2 w-2 bg-gray-400 rounded-full"></div>
          </div>
        ) : (
          <div className="prose prose-invert prose-headings:mt-2 prose-headings:mb-1 prose-p:mt-1 prose-p:mb-1 prose-ul:mt-1 prose-ul:mb-1 prose-ol:mt-1 prose-ol:mb-1 max-w-none">
            {/* Temporarily revert to simple text display */}
            {message.content.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < message.content.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
      
      {/* User avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-12 h-12 mt-0">
          <div className="bg-blue-600 rounded-full w-full h-full flex items-center justify-center text-white">
            <span className="text-sm font-medium">You</span>
          </div>
        </div>
      )}
    </div>
  );
} 