import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-light-gray">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-primary-blue rounded-md flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
            <span className="ml-2 text-xl font-heading font-bold text-primary-blue">
              RAGWriter
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard" 
              className="text-primary-blue font-medium hover:text-primary-blue/80"
            >
              Go to Dashboard
            </Link>
            <Link 
              href="/login" 
              className="text-primary-blue font-medium hover:text-primary-blue/80"
            >
              Login
            </Link>
            <Link href="/register">
              <Button>Sign Up Free</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary-blue to-secondary-teal text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
              Write in Your Authentic Voice, at Scale
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              The AI writing assistant that actually sounds like you
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-accent-coral hover:bg-accent-coral/90 text-white">
                  Try Free for 14 Days
                </Button>
              </Link>
              <Button variant="secondary" size="lg">
                See How It Works
              </Button>
            </div>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-heading font-bold text-center mb-12">
              Your Writing Style, Amplified
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-lighter-gray p-6 rounded-xl">
                <div className="bg-primary-blue/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-primary-blue"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">
                  Capture Your Unique Voice
                </h3>
                <p className="text-medium-gray">
                  Upload your existing writing and our AI learns your exact style, tone, and patterns.
                </p>
              </div>

              <div className="bg-lighter-gray p-6 rounded-xl">
                <div className="bg-secondary-teal/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-secondary-teal"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">
                  Generate Authentic Content
                </h3>
                <p className="text-medium-gray">
                  Create new content that sounds exactly like you wrote it, in seconds.
                </p>
              </div>

              <div className="bg-lighter-gray p-6 rounded-xl">
                <div className="bg-accent-coral/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-accent-coral"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">
                  Fine-tune and Adapt
                </h3>
                <p className="text-medium-gray">
                  Adjust for tone, formality, or purpose while maintaining your authentic voice.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-lighter-gray py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-heading font-bold mb-6">
              Ready to amplify your voice?
            </h2>
            <p className="text-lg text-medium-gray mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have transformed their writing workflow.
            </p>
            <Link href="/dashboard">
              <Button size="lg">Get Started Now</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-dark-gray text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-white rounded-md flex items-center justify-center">
                  <span className="text-primary-blue font-bold">R</span>
                </div>
                <span className="ml-2 text-xl font-heading font-bold">
                  RAGWriter
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                © 2025 RAGWriter. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link href="/about" className="text-gray-400 hover:text-white">
                About
              </Link>
              <Link href="/features" className="text-gray-400 hover:text-white">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-400 hover:text-white">
                Pricing
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 