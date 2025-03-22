'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/supabase-auth-context';
import PricingTiers from '@/components/pricing/PricingTiers';
import FeatureComparison from '@/components/pricing/FeatureComparison';

export default function PricingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-[#212121] text-white">
      {/* Navigation */}
      <nav className="bg-[#1a1a1a]/90 backdrop-blur-sm border-b border-gray-800 fixed w-full z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-br from-[#0077b6] to-[#00a8e8] rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">書</span>
            </div>
            <span className="font-bold text-xl">Kaku</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link href="/features" className="text-gray-300 hover:text-white text-sm">
              Features
            </Link>
            <Link href="/pricing" className="text-blue-400 text-sm">
              Pricing
            </Link>
            {!user ? (
              <>
                <Link href="/login" className="text-gray-300 hover:text-white text-sm">
                  Login
                </Link>
                <Link 
                  href="/demo-login" 
                  className="bg-gradient-to-r from-[#0077b6] to-[#00a8e8] px-4 py-2 rounded-md text-sm font-medium hover:from-[#00a8e8] hover:to-[#0077b6] transition-all duration-300"
                >
                  Try Demo
                </Link>
              </>
            ) : (
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-300 hover:text-white text-sm"
              >
                Dashboard
              </button>
            )}
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your <span className="bg-gradient-to-r from-[#0077b6] to-[#00a8e8] text-transparent bg-clip-text">Perfect Plan</span>
          </h1>
          <p className="text-gray-400 max-w-2xl text-lg mb-8">
            Whether you're just starting or need advanced features, we have a plan that fits your needs.
          </p>
          
          {/* Pricing Tiers */}
          <PricingTiers />
          
          {/* Feature Comparison */}
          <div className="mt-20 w-full max-w-5xl">
            <h2 className="text-2xl font-bold mb-10 text-center">Feature Comparison</h2>
            <FeatureComparison />
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-[#1a1a1a]">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-[#252525] p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Can I change plans later?</h3>
              <p className="text-gray-400">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
            </div>
            
            <div className="bg-[#252525] p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-2">How many writing samples can I upload?</h3>
              <p className="text-gray-400">Free users can upload up to 3 writing samples. Premium users can upload unlimited samples and organize them into multiple voices.</p>
            </div>
            
            <div className="bg-[#252525] p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Is there a free trial for Premium?</h3>
              <p className="text-gray-400">Yes, all new users can try Premium features for 7 days before deciding which plan works best for them.</p>
            </div>
            
            <div className="bg-[#252525] p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Can I cancel my subscription?</h3>
              <p className="text-gray-400">You can cancel your subscription at any time. You'll continue to have access to Premium features until the end of your current billing period.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gradient-to-r from-[#0d283b] to-[#154e6b] rounded-xl p-8 flex flex-col items-center text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to find your voice?</h2>
            <p className="text-gray-300 mb-6 max-w-lg">
              Start with our free plan today and upgrade whenever you're ready for more features.
            </p>
            <Link 
              href={user ? "/dashboard" : "/register"} 
              className="px-8 py-3 text-base font-medium rounded-md text-white bg-[#00a8e8] hover:bg-[#0077b6] transition-colors"
            >
              {user ? "Go to Dashboard" : "Get Started"}
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