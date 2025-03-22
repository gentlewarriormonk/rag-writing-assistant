'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/supabase-auth-context';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    setMounted(true);
    
    // Redirect authenticated users to dashboard
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);
  
  if (!mounted || isLoading) return null;
  
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Navigation */}
      <nav className="bg-[#1a1a1a]/90 backdrop-blur-sm border-b border-gray-800 fixed w-full z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-br from-[#0077b6] to-[#00a8e8] rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">書</span>
            </div>
            <span className="font-bold text-xl">Kaku</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link href="/features" className="text-gray-300 hover:text-white text-sm">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-300 hover:text-white text-sm">
              Pricing
            </Link>
            <Link href="/login" className="text-gray-300 hover:text-white text-sm">
              Login
            </Link>
            <Link 
              href="/demo-login" 
              className="bg-gradient-to-r from-[#0077b6] to-[#00a8e8] px-4 py-2 rounded-md text-sm font-medium hover:from-[#00a8e8] hover:to-[#0077b6] transition-all duration-300"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold max-w-4xl mb-6">
            Write in <span className="bg-gradient-to-r from-[#0077b6] to-[#00a8e8] text-transparent bg-clip-text">your voice</span>, powered by AI
          </h1>
          <p className="text-gray-400 max-w-2xl text-lg mb-8">
            Kaku helps you generate authentic content that matches your writing style by learning from your reference materials.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link 
              href="/demo-login" 
              className="px-8 py-3 text-base font-medium rounded-md text-white bg-[#00a8e8] hover:bg-[#0077b6] transition-colors"
            >
              Try Demo Mode
            </Link>
            <Link 
              href="/register" 
              className="px-8 py-3 text-base font-medium rounded-md text-gray-300 border border-gray-700 bg-gray-800/50 hover:bg-gray-700 transition-colors"
            >
              Create Account
            </Link>
          </div>
          
          {/* Screenshot/Preview */}
          <div className="relative w-full max-w-5xl mx-auto">
            <div className="aspect-video bg-[#1a1a1a] rounded-lg border border-gray-800 overflow-hidden shadow-2xl">
              <div className="h-full w-full flex items-center justify-center">
                <div className="w-full max-w-3xl">
                  <div className="h-8 bg-[#252525] rounded-t-md flex items-center pl-4 space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <div className="ml-4 w-1/2 h-4 bg-[#333] rounded-full"></div>
                  </div>
                  <div className="p-6 bg-[#1e1e1e] border-x border-b border-gray-800 rounded-b-md">
                    <div className="flex gap-4">
                      <div className="w-1/3 space-y-3">
                        <div className="h-4 bg-[#333] rounded w-3/4"></div>
                        <div className="h-3 bg-[#333] rounded w-full"></div>
                        <div className="h-3 bg-[#333] rounded w-1/2"></div>
                        <div className="h-10 mt-4 bg-blue-600/20 border border-blue-700 rounded"></div>
                      </div>
                      <div className="w-2/3 space-y-2">
                        <div className="h-5 bg-[#333] rounded w-1/2"></div>
                        <div className="h-40 bg-[#252525] rounded border border-gray-700"></div>
                        <div className="flex justify-between mt-2">
                          <div className="h-8 w-24 bg-[#333] rounded"></div>
                          <div className="h-8 w-24 bg-blue-600 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-blue-600/20 to-cyan-600/20 -z-10 blur-xl opacity-60"></div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-[#151515]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <div className="h-12 w-12 mb-4 rounded-lg bg-blue-900/30 text-blue-400 flex items-center justify-center text-2xl">
                ✍️
              </div>
              <h3 className="text-xl font-semibold mb-2">Personal Writing Style</h3>
              <p className="text-gray-400">
                Upload your previous writing samples and Kaku learns your unique voice and style patterns.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <div className="h-12 w-12 mb-4 rounded-lg bg-purple-900/30 text-purple-400 flex items-center justify-center text-2xl">
                🧠
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Assistance</h3>
              <p className="text-gray-400">
                Get intelligent suggestions, completions, and revisions that match your writing style.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <div className="h-12 w-12 mb-4 rounded-lg bg-teal-900/30 text-teal-400 flex items-center justify-center text-2xl">
                🔍
              </div>
              <h3 className="text-xl font-semibold mb-2">Authentic Content</h3>
              <p className="text-gray-400">
                Create content that truly sounds like you wrote it, maintaining your unique voice.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gradient-to-r from-[#0d283b] to-[#154e6b] rounded-xl p-8 flex flex-col items-center text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Experience Kaku Today</h2>
            <p className="text-gray-300 mb-6 max-w-lg">
              Try our demo mode to see how Kaku can help you create content that truly sounds like you.
            </p>
            <Link 
              href="/demo-login" 
              className="px-8 py-3 text-base font-medium rounded-md text-white bg-[#00a8e8] hover:bg-[#0077b6] transition-colors"
            >
              Start Demo Now
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-[#1a1a1a] border-t border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-7 w-7 bg-gradient-to-br from-[#0077b6] to-[#00a8e8] rounded-lg flex items-center justify-center mr-2">
                <span className="text-white text-sm font-bold">書</span>
              </div>
              <span className="font-bold">Kaku</span>
            </div>
            
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="#" className="hover:text-white">Terms</Link>
              <Link href="#" className="hover:text-white">Privacy</Link>
              <Link href="#" className="hover:text-white">About</Link>
              <Link href="#" className="hover:text-white">Contact</Link>
            </div>
            
            <div className="mt-4 md:mt-0 text-xs text-gray-500">
              © 2025 Kaku. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 