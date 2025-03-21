'use client';

import React, { useState } from 'react';
import { useChat } from '@/contexts/chat-context';
import { useTheme } from '@/contexts/theme-context';
import { useAuth } from '@/contexts/auth-context';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { conversation, conversations, newConversation, loadConversation, deleteConversation } = useChat();
  const { toggleDarkMode, isDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setShowDeleteConfirm(id);
  };

  const handleDeleteConfirm = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteConversation(id);
    setShowDeleteConfirm(null);
  };

  const handleDeleteCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(null);
  };

  return (
    <div 
      className={`
        fixed inset-y-0 left-0 w-64 bg-[#1e1e1e] border-r border-gray-800 z-20 
        transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <button 
            onClick={newConversation}
            className="w-full bg-[#0077b6] hover:bg-[#00a8e8] text-white py-2 px-4 rounded-lg flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Chat
          </button>
        </div>
        
        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto py-2">
          {conversations.map((convo) => (
            <div 
              key={convo.id}
              onClick={() => loadConversation(convo.id)}
              className={`
                px-4 py-2 cursor-pointer flex justify-between items-center
                ${conversation?.id === convo.id ? 'bg-gray-800' : 'hover:bg-gray-800/50'}
              `}
            >
              <div className="truncate flex-1">
                <div className="truncate font-medium">{convo.title || 'New Conversation'}</div>
                <div className="text-xs text-gray-400">{formatDate(convo.createdAt)}</div>
              </div>
              
              {showDeleteConfirm === convo.id ? (
                <div className="flex items-center space-x-1" onClick={e => e.stopPropagation()}>
                  <button 
                    onClick={(e) => handleDeleteConfirm(e, convo.id)}
                    className="text-red-500 hover:text-red-400 p-1"
                  >
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button 
                    onClick={handleDeleteCancel}
                    className="text-gray-400 hover:text-white p-1"
                  >
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={(e) => handleDeleteClick(e, convo.id)}
                  className="text-gray-400 hover:text-white p-1 opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        
        {/* Footer with settings */}
        <div className="border-t border-gray-800 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Dark Mode</span>
            <button 
              onClick={toggleDarkMode} 
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full 
                transition-colors focus:outline-none
                ${isDarkMode ? 'bg-[#0077b6]' : 'bg-gray-600'}
              `}
            >
              <span 
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
          
          <div className="pt-2">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-[#0077b6] rounded-full flex items-center justify-center text-white">
                    {user.name.charAt(0)}
                  </div>
                  <span className="ml-2 text-sm truncate">{user.name}</span>
                </div>
                <button 
                  onClick={() => logout()}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <a 
                href="/login"
                className="flex items-center justify-center text-sm text-[#00a8e8] hover:text-white"
              >
                Sign in
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 