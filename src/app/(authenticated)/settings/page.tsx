'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/supabase-auth-context';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState<string>('');
  const [isApiKeySet, setIsApiKeySet] = useState<boolean>(false);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>('');
  const [saveError, setSaveError] = useState<string>('');
  
  const { user } = useAuth();
  const router = useRouter();
  
  // Check if API key is already set
  useEffect(() => {
    async function checkApiKey() {
      try {
        const response = await fetch('/api/settings/api-key');
        const data = await response.json();
        
        if (data.isSet) {
          setIsApiKeySet(true);
          // Don't set the actual API key for security, just indicate it's set
          setApiKey('●●●●●●●●●●●●●●●●●●');
        }
      } catch (error) {
        console.error('Error checking API key:', error);
      }
    }
    
    checkApiKey();
  }, []);
  
  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSaving(true);
    setSaveMessage('');
    setSaveError('');
    
    try {
      const response = await fetch('/api/settings/api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsApiKeySet(true);
        setApiKey('●●●●●●●●●●●●●●●●●●');
        setShowApiKey(false);
        setSaveMessage('API key saved successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSaveMessage('');
        }, 3000);
      } else {
        setSaveError(data.error || 'Failed to save API key');
      }
    } catch (error) {
      console.error('Error saving API key:', error);
      setSaveError('An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleClearApiKey = async () => {
    setIsSaving(true);
    
    try {
      const response = await fetch('/api/settings/api-key', {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setIsApiKeySet(false);
        setApiKey('');
        setSaveMessage('API key removed successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSaveMessage('');
        }, 3000);
      } else {
        const data = await response.json();
        setSaveError(data.error || 'Failed to remove API key');
      }
    } catch (error) {
      console.error('Error removing API key:', error);
      setSaveError('An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };
  
  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
    
    // If revealing the API key, fetch the actual value
    if (!showApiKey && isApiKeySet) {
      fetchActualApiKey();
    }
  };
  
  const fetchActualApiKey = async () => {
    try {
      const response = await fetch('/api/settings/api-key?reveal=true');
      const data = await response.json();
      
      if (data.apiKey) {
        setApiKey(data.apiKey);
      }
    } catch (error) {
      console.error('Error fetching API key:', error);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-white">Settings</h1>
      
      <div className="bg-[#1e1e1e] rounded-lg p-6 mb-8 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">API Configuration</h2>
        
        <form onSubmit={handleSaveApiKey}>
          <div className="mb-4">
            <label 
              htmlFor="anthropic-api-key" 
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              Anthropic API Key
            </label>
            <div className="flex items-center">
              <input
                type={showApiKey ? "text" : "password"}
                id="anthropic-api-key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isSaving}
                placeholder="Enter your Anthropic API key"
                className="bg-[#121212] text-white rounded-l-md border border-r-0 border-gray-600 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
              <button
                type="button"
                onClick={toggleShowApiKey}
                className="bg-[#1e1e1e] text-gray-300 border border-l-0 border-gray-600 rounded-r-md p-2.5 hover:bg-gray-700"
              >
                {showApiKey ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-400">
              {isApiKeySet ? 
                "Your API key is securely stored. You can update it or remove it." : 
                "Enter your API key to enable Anthropic Claude API integration. Without an API key, mock responses will be used."
              }
            </p>
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSaving || !apiKey}
              className={`px-4 py-2 rounded-md text-white bg-gradient-to-r from-[#0077b6] to-[#00a8e8] hover:from-[#006da7] hover:to-[#0099d4] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                (isSaving || !apiKey) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? 'Saving...' : 'Save API Key'}
            </button>
            
            {isApiKeySet && (
              <button
                type="button"
                onClick={handleClearApiKey}
                disabled={isSaving}
                className={`px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  isSaving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Remove API Key
              </button>
            )}
          </div>
          
          {saveMessage && (
            <p className="mt-3 text-sm text-green-400">{saveMessage}</p>
          )}
          
          {saveError && (
            <p className="mt-3 text-sm text-red-400">{saveError}</p>
          )}
        </form>
      </div>
      
      <div className="bg-[#1e1e1e] rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">API Usage</h2>
        <p className="text-gray-300">
          This application uses the Anthropic Claude API to provide intelligent responses to your messages.
        </p>
        
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2 text-white">API Mode Status</h3>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${isApiKeySet ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-gray-300">
              {isApiKeySet ? 'Using Anthropic Claude API' : 'Using mock responses (No API key set)'}
            </span>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2 text-white">Get an API Key</h3>
          <p className="text-gray-300 mb-2">
            To use the Anthropic Claude API, you need to obtain an API key from Anthropic.
          </p>
          <a 
            href="https://www.anthropic.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 inline-flex items-center"
          >
            Visit Anthropic's website
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
} 