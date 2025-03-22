'use client';

import React from 'react';
import { Message } from '@/contexts/chat-context';
import { useTheme } from '@/contexts/theme-context';

interface MessageBubbleProps {
  message: Message;
  isLoading?: boolean;
}

export default function MessageBubble({ message, isLoading = false }: MessageBubbleProps) {
  const { colors } = useTheme();
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`
          max-w-3xl rounded-2xl px-4 py-3 
          ${isUser 
            ? 'bg-[#0077b6] text-white' 
            : 'bg-[#1e1e1e] text-white border border-gray-800'
          }
          ${isLoading ? 'opacity-70' : ''}
        `}
      >
        {isLoading ? (
          <div className="h-6 w-6 flex items-center justify-center">
            <div className="animate-pulse h-2 w-2 bg-gray-400 rounded-full"></div>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none">
            {message.content.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < message.content.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 