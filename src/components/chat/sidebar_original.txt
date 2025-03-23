'use client';

import React, { useState } from 'react';
import { useChat } from '@/contexts/chat-context';
import { useTheme } from '@/contexts/theme-context';
import { useAuth } from '@/contexts/supabase-auth-context';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  onLockToggle?: (locked: boolean) => void;
  isLocked?: boolean;
}

export default function Sidebar({ 
  isOpen, 
  onClose, 
  onMouseEnter, 
  onMouseLeave,
  onLockToggle,
  isLocked = false
}: SidebarProps) {
  const { conversation, conversations, newConversation, loadConversation, deleteConversation } = useChat();
  const { toggleDarkMode, isDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  // Preserve selected tab in state even when the sidebar is closed
  const [activeTab, setActiveTab] = useState<'chats' | 'voices'>('chats');
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

  // Stop event propagation on tab clicks to prevent panel from closing
  const handleTabClick = (e: React.MouseEvent, tab: 'chats' | 'voices') => {
    e.stopPropagation();
    setActiveTab(tab);
  };

  // Handler for locking/unlocking the sidebar
  const toggleLock = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLockToggle) {
      onLockToggle(!isLocked);
    }
  };

  return (
    <motion.div 
      initial={{ x: -280, opacity: 0 }}
      animate={{ 
        x: isOpen ? 0 : -280,
        opacity: isOpen ? 1 : 0
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="fixed inset-y-0 left-0 w-64 bg-blue-900/10 backdrop-blur-sm border-r border-gray-800/50 z-10 flex flex-col h-full shadow-xl"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={(e) => {
        e.stopPropagation(); // Ensure clicks don't bubble up 
      }}
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top section with Voices link and lock button */}
        <div className="pt-4 px-3 pb-3 border-b border-gray-800/30 flex justify-between items-center">
          <Link 
            href="/voices"
            className="flex items-center px-2 py-1.5 rounded-md text-gray-200 hover:bg-blue-800/20"
          >
            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            Voices
          </Link>
          
          {/* Lock/Unlock button */}
          <button
            onClick={toggleLock}
            className={`p-1.5 rounded-full ${
              isLocked 
                ? 'text-blue-400 bg-blue-400/10' 
                : 'text-gray-400 hover:text-blue-400 hover:bg-gray-800/40'
            }`}
            aria-label={isLocked ? "Unlock sidebar" : "Lock sidebar open"}
          >
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              {isLocked ? (
                <path fillRule="evenodd" d="M14.5 1A4.5 4.5 0 0010 5.5V9H3a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2v-7a2 2 0 00-2-2h-1.5V5.5a3 3 0 116 0v2.75a.75.75 0 001.5 0V5.5A4.5 4.5 0 0014.5 1z" clipRule="evenodd" />
              ) : (
                <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-3 space-y-2">
          {/* New Chat Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              newConversation();
            }}
            className="w-full bg-blue-700 hover:bg-blue-600 text-white py-2 px-3 rounded-md text-sm flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Start New Chat
          </button>

          {/* Your Writing Samples Link */}
          <Link 
            href="/samples"
            className="w-full bg-[#2e2e2e] hover:bg-[#3e3e3e] text-white py-2 px-3 rounded-md text-sm flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              router.push('/samples');
            }}
          >
            <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Your Writing Samples
          </Link>
        </div>
        
        {/* Tabs */}
        <div className="px-3 pt-1 pb-2 flex space-x-1">
          <button
            onClick={(e) => handleTabClick(e, 'chats')}
            className={`flex-1 text-xs py-1.5 px-2 rounded-md ${
              activeTab === 'chats' 
                ? 'bg-blue-800/40 text-white font-medium' 
                : 'text-gray-300 hover:bg-blue-800/20'
            }`}
          >
            Recent Chats
          </button>
          <button
            onClick={(e) => handleTabClick(e, 'voices')}
            className={`flex-1 text-xs py-1.5 px-2 rounded-md ${
              activeTab === 'voices' 
                ? 'bg-blue-800/40 text-white font-medium' 
                : 'text-gray-300 hover:bg-blue-800/20'
            }`}
          >
            Favorites
          </button>
        </div>
        
        {/* Chat/Voices Lists */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {activeTab === 'chats' && (
            <div className="space-y-1">
              {conversations.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">
                  No conversations yet
                </div>
              ) : (
                conversations.map((convo) => (
                  <div 
                    key={convo.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      loadConversation(convo.id);
                    }}
                    className={`
                      px-3 py-2 rounded-md cursor-pointer text-sm group
                      ${conversation?.id === convo.id ? 'bg-blue-800/30 text-white' : 'text-gray-300 hover:bg-gray-800/40'}
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <div className="truncate flex-1">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          <span className="truncate">{convo.title || 'New Conversation'}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 pl-6">{formatDate(convo.createdAt)}</div>
                      </div>
                      
                      {/* Star/Delete Controls */}
                      <div className="flex items-center space-x-1 ml-2">
                        <button
                          className="text-gray-400 hover:text-yellow-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add star functionality here
                          }}
                        >
                          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </button>
                        {showDeleteConfirm === convo.id ? (
                          <div className="flex items-center" onClick={e => e.stopPropagation()}>
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
                            className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          
          {activeTab === 'voices' && (
            <div className="space-y-1">
              <div className="text-center py-6 text-gray-500 text-sm">
                No starred chats yet
              </div>
              {/* Starred chat items would go here */}
            </div>
          )}
        </div>
      </div>
      
      {/* Settings at the bottom */}
      <div className="mt-auto space-y-2 border-t border-gray-800/30 p-3">
        {/* Upgrade to Pro button */}
        <Link
          href="/pricing"
          className="w-full flex items-center justify-center py-2 px-3 rounded-md bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-medium hover:from-blue-500 hover:to-blue-400 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            router.push('/pricing');
          }}
        >
          <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Upgrade to Pro
        </Link>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push('/settings');
          }}
          className="w-full flex items-center px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800/40"
        >
          <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </button>
        
        {user && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-800/30">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center text-white text-xs">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <span className="ml-2 text-xs text-gray-300 truncate">{user.email}</span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                logout();
              }}
              className="text-gray-500 hover:text-white"
            >
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
} 