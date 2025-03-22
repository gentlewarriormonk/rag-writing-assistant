'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/supabase-auth-context';
import Link from 'next/link';

interface Voice {
  id: string;
  name: string;
  description: string;
  sampleCount: number;
  lastUsed: Date;
  isPremium: boolean;
}

export default function VoicesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  // Mock data - in a real app, this would come from an API
  const voices: Voice[] = [
    {
      id: '1',
      name: 'My Writing Voice',
      description: 'Your default writing style based on your uploaded samples.',
      sampleCount: 3,
      lastUsed: new Date(),
      isPremium: false
    }
  ];
  
  // Mock premium voices that would be locked for free users
  const premiumVoices: Voice[] = [
    {
      id: 'premium-1',
      name: 'Academic Writing',
      description: 'Formal academic tone suitable for research papers and scholarly articles.',
      sampleCount: 0,
      lastUsed: new Date(Date.now() - 86400000), // yesterday
      isPremium: true
    },
    {
      id: 'premium-2',
      name: 'Business Professional',
      description: 'Clear, concise communication suitable for business contexts.',
      sampleCount: 0,
      lastUsed: new Date(Date.now() - 86400000 * 2), // 2 days ago
      isPremium: true
    }
  ];
  
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
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  const handleCreateVoice = () => {
    setShowPremiumModal(true);
  };
  
  return (
    <div className="min-h-screen bg-[#212121] text-white py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button 
              onClick={() => router.push('/dashboard')}
              className="text-gray-400 hover:text-white mr-4"
            >
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold">Your Voices</h1>
          </div>
          
          <button 
            onClick={handleCreateVoice}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Voice
          </button>
        </div>
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {/* Free voice */}
          {voices.map(voice => (
            <div 
              key={voice.id}
              className="bg-[#252525] rounded-lg border border-gray-800 overflow-hidden shadow-md transition-all hover:shadow-lg hover:border-gray-700"
            >
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-medium text-white mb-2">{voice.name}</h3>
                  <span className="text-xs px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full">Default</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{voice.description}</p>
                
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <span className="mr-4">{voice.sampleCount} samples</span>
                  <span>Last used: {formatDate(voice.lastUsed)}</span>
                </div>
                
                <div className="flex justify-between">
                  <button
                    onClick={() => router.push('/samples')}
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit
                  </button>
                  
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="text-gray-400 hover:text-white text-sm flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Write
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Premium voices (locked for free users) */}
          {premiumVoices.map(voice => (
            <div 
              key={voice.id}
              className="bg-[#252525] rounded-lg border border-gray-800 overflow-hidden shadow-md relative"
            >
              {/* Premium overlay */}
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 p-6">
                <svg className="w-8 h-8 text-yellow-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-white text-center mb-4">Premium Feature</p>
                <Link 
                  href="/pricing"
                  className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-blue-500 hover:to-blue-400"
                >
                  Upgrade to Pro
                </Link>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-medium text-white mb-2">{voice.name}</h3>
                  <span className="text-xs px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded-full">Premium</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{voice.description}</p>
                
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <span className="mr-4">{voice.sampleCount} samples</span>
                  <span>Last used: {formatDate(voice.lastUsed)}</span>
                </div>
                
                <div className="flex justify-between">
                  <button
                    className="text-gray-500 text-sm flex items-center cursor-not-allowed"
                  >
                    <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit
                  </button>
                  
                  <button
                    className="text-gray-500 text-sm flex items-center cursor-not-allowed"
                  >
                    <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Write
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Premium upsell info */}
        <div className="mt-12 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-500/20 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="mr-8 mb-4 md:mb-0">
              <svg className="w-12 h-12 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-white mb-2">Upgrade to Premium for Multiple Voices</h3>
              <p className="text-gray-300 mb-4">
                Create different voice profiles for various writing contexts - academic papers, 
                marketing content, creative writing, technical documentation, and more.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link 
                  href="/pricing"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  See Pricing Options
                </Link>
                <button 
                  className="bg-transparent border border-blue-500 text-blue-400 hover:bg-blue-500/10 px-4 py-2 rounded-md text-sm font-medium"
                  onClick={() => router.push('/dashboard')}
                >
                  Continue with Free Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Premium upgrade modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#252525] rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-medium text-white">Premium Feature</h3>
              <button 
                onClick={() => setShowPremiumModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-300 mb-4">
                Creating multiple voice profiles is a Premium feature. Upgrade to our Pro plan to:
              </p>
              <ul className="space-y-2 mb-4 text-gray-300">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Create up to 5 different voice profiles
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Upload unlimited writing samples per voice
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Switch between voices with one click
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col space-y-3">
              <Link 
                href="/pricing"
                className="bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-md text-center text-sm font-medium"
              >
                Upgrade to Pro
              </Link>
              <button 
                onClick={() => setShowPremiumModal(false)}
                className="bg-transparent hover:bg-gray-700/30 text-gray-300 py-2 rounded-md text-center text-sm"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 