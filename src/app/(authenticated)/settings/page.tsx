'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/supabase-auth-context';
import { useTheme } from '@/contexts/theme-context';

export default function SettingsPage() {
  const { user, isLoading, logout } = useAuth();
  const { toggleDarkMode, isDarkMode } = useTheme();
  const router = useRouter();
  
  const [notifyNewFeatures, setNotifyNewFeatures] = useState(true);
  const [notifyTips, setNotifyTips] = useState(true);
  
  // Check if user is authenticated
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#212121] text-white">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    router.push('/login');
    return null;
  }
  
  return (
    <div className="min-h-screen bg-[#212121] text-white py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => router.push('/dashboard')}
            className="text-gray-400 hover:text-white mr-4"
          >
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        
        {/* Account Section */}
        <section className="mb-8 bg-[#252525] rounded-lg p-6 border border-gray-800">
          <h2 className="text-lg font-medium mb-4">Account Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <div className="text-white">{user.email}</div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Account Type</label>
              <div className="flex items-center">
                <span className="text-white">Free Plan</span>
                <button 
                  onClick={() => router.push('/pricing')}
                  className="ml-3 text-xs bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded"
                >
                  Upgrade
                </button>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-800">
              <button 
                onClick={() => logout()}
                className="text-red-400 hover:text-red-300 text-sm flex items-center"
              >
                <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </section>
        
        {/* Privacy & Data Section */}
        <section className="mb-8 bg-[#252525] rounded-lg p-6 border border-gray-800">
          <h2 className="text-lg font-medium mb-4">Privacy & Data</h2>
          
          <div className="space-y-4">
            <div>
              <button className="text-blue-400 hover:text-blue-300 text-sm">
                Export My Data
              </button>
            </div>
            
            <div>
              <button className="text-blue-400 hover:text-blue-300 text-sm">
                Delete All Writing Samples
              </button>
            </div>
            
            <div className="pt-4 border-t border-gray-800">
              <button className="text-red-400 hover:text-red-300 text-sm">
                Delete My Account
              </button>
            </div>
          </div>
        </section>
        
        {/* Notifications Section */}
        <section className="mb-8 bg-[#252525] rounded-lg p-6 border border-gray-800">
          <h2 className="text-lg font-medium mb-4">Notifications</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-gray-300">New Features and Updates</label>
              <button 
                className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                  notifyNewFeatures ? 'bg-blue-600' : 'bg-gray-700'
                }`}
                onClick={() => setNotifyNewFeatures(!notifyNewFeatures)}
              >
                <span 
                  className={`inline-block w-4 h-4 transform transition bg-white rounded-full ${
                    notifyNewFeatures ? 'translate-x-6' : 'translate-x-1'
                  }`} 
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-gray-300">Writing Tips and Advice</label>
              <button 
                className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                  notifyTips ? 'bg-blue-600' : 'bg-gray-700'
                }`}
                onClick={() => setNotifyTips(!notifyTips)}
              >
                <span 
                  className={`inline-block w-4 h-4 transform transition bg-white rounded-full ${
                    notifyTips ? 'translate-x-6' : 'translate-x-1'
                  }`} 
                />
              </button>
            </div>
          </div>
        </section>
        
        {/* Appearance Section */}
        <section className="mb-8 bg-[#252525] rounded-lg p-6 border border-gray-800">
          <h2 className="text-lg font-medium mb-4">Appearance</h2>
          
          <div className="flex items-center justify-between">
            <label className="text-gray-300">Dark Mode</label>
            <button 
              className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                isDarkMode ? 'bg-blue-600' : 'bg-gray-700'
              }`}
              onClick={toggleDarkMode}
            >
              <span 
                className={`inline-block w-4 h-4 transform transition bg-white rounded-full ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`} 
              />
            </button>
          </div>
        </section>
        
        {/* About Section */}
        <section className="mb-8 bg-[#252525] rounded-lg p-6 border border-gray-800">
          <h2 className="text-lg font-medium mb-4">About</h2>
          
          <div className="space-y-2 text-sm text-gray-400">
            <p>Kaku AI Writing Assistant</p>
            <p>Version 1.0.0</p>
            <div className="pt-2">
              <a href="/privacy" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
              <span className="mx-2">•</span>
              <a href="/terms" className="text-blue-400 hover:text-blue-300">Terms of Service</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 