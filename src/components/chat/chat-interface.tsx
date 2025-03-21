'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/contexts/chat-context';
import { useTheme } from '@/contexts/theme-context';
import MessageBubble from './message-bubble';
import ChatInput from './chat-input';
import ThinkingIndicator from '@/components/ui/ThinkingIndicator';
import Sidebar from './sidebar';

export default function ChatInterface() {
  const { conversation, isLoading, sendMessage, isSidebarOpen, toggleSidebar } = useChat();
  const { colors } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  return (
    <div className="flex h-screen bg-[#121212] text-white overflow-hidden">
      {/* Hover-sensitive left zone for sidebar trigger */}
      <div 
        className="fixed left-0 top-0 bottom-0 w-10 z-10"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      />
      
      {/* Collapsible sidebar - shown when hovering or explicitly opened */}
      <Sidebar 
        isOpen={isSidebarOpen || isHovering} 
        onClose={() => setIsHovering(false)}
      />
      
      {/* Main chat area */}
      <main className="flex-1 flex flex-col h-full max-w-4xl mx-auto">
        {/* Chat history */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {!conversation?.messages.length ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-3 max-w-lg">
                <h2 className="text-2xl font-medium text-white">RAG Writing Assistant</h2>
                <p className="text-gray-400">
                  Empower your writing with AI that matches your style. Upload your writing samples 
                  to teach the assistant your unique voice.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 pb-24">
              {conversation.messages.map((message) => (
                <MessageBubble 
                  key={message.id} 
                  message={message} 
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {/* Thinking indicator - shown when loading */}
        {isLoading && (
          <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2">
            <ThinkingIndicator />
          </div>
        )}
        
        {/* Input area */}
        <div className="border-t border-gray-800 px-4 py-4 bg-[#1e1e1e]">
          <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
          <div className="text-xs text-center mt-2 text-gray-500">
            RAG Writing Assistant may produce inaccurate information about people, places, or facts.
          </div>
        </div>
      </main>
    </div>
  );
} 