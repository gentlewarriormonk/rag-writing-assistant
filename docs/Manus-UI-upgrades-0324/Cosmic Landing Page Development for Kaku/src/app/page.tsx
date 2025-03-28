"use client";

import dynamic from 'next/dynamic';

// Dynamically import the main landing page to avoid SSR issues with Locomotive Scroll
const LandingPageClient = dynamic(() => import('@/components/LandingPageClient'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-cosmic-black flex items-center justify-center z-50">
      <div className="w-20 h-20 border-4 border-t-nebula-blue border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      <p className="absolute mt-24 text-stellar-white animate-pulse">Loading cosmic adventure...</p>
    </div>
  ),
});

export default function Home() {
  return (
    <main>
      <LandingPageClient />
    </main>
  );
} 