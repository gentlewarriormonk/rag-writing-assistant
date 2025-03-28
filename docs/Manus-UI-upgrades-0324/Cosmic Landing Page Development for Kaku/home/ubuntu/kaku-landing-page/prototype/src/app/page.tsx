'use client';

import React from 'react';
import { LandingProvider } from '@/context/LandingContext';
import { AccessibilityProvider } from '@/context/AccessibilityContext';
import { ResponsiveProvider } from '@/context/ResponsiveContext';
import CosmicBackground from '@/components/cosmic/CosmicBackground';
import SoundController from '@/components/ui/SoundController';
import ScrollContainer from '@/components/ui/ScrollContainer';
import AccessibilityControls from '@/components/ui/AccessibilityControls';
import NavigationIndicators from '@/components/ui/NavigationIndicators';
import LoadingScreen from '@/components/ui/LoadingScreen';
import IntroSection from '@/components/journey/IntroSection';
import SignUpSection from '@/components/journey/SignUpSection';
import TransitionToChatSection from '@/components/journey/TransitionToChatSection';

export default function Home() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentSection, setCurrentSection] = React.useState('intro');
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const [userData, setUserData] = React.useState<any>(null);
  
  // Handle loading completion
  const handleLoadComplete = () => {
    setIsLoading(false);
  };
  
  // Sections for navigation
  const sections = ['intro', 'origin', 'character', 'mission', 'signup', 'chat'];
  
  // Handle section change
  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
  };
  
  // Handle scroll progress update
  const handleScroll = () => {
    if (typeof window !== 'undefined') {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = scrollTop / (docHeight - winHeight);
      setScrollProgress(scrollPercent);
    }
  };
  
  // Add scroll event listener
  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle sign-up completion
  const handleSignUpComplete = (data: any) => {
    setUserData(data);
    
    // Scroll to chat section after a delay
    setTimeout(() => {
      const chatSection = document.getElementById('chat');
      if (chatSection) {
        chatSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 2000);
  };
  
  // Handle chat transition completion
  const handleChatTransitionComplete = () => {
    console.log('Chat transition complete');
    // In a real implementation, this would transition to the main app
  };
  
  return (
    <LandingProvider>
      <AccessibilityProvider>
        <ResponsiveProvider>
          <main className="min-h-screen bg-black text-white overflow-x-hidden">
            {/* Loading screen */}
            <LoadingScreen onLoadComplete={handleLoadComplete} />
            
            {/* Cosmic background */}
            <CosmicBackground 
              intensity={1} 
              parallaxEnabled={true} 
            />
            
            {/* Sound controller */}
            <SoundController 
              ambientTrack="cosmic" 
              volumeLevel={0.5} 
            />
            
            {/* Accessibility controls */}
            <AccessibilityControls />
            
            {/* Navigation indicators */}
            <NavigationIndicators 
              sections={sections} 
              currentSection={currentSection} 
              scrollProgress={scrollProgress} 
            />
            
            {/* Scroll container with sections */}
            <ScrollContainer onSectionChange={handleSectionChange}>
              {/* Intro section */}
              <IntroSection 
                isActive={currentSection === 'intro'} 
              />
              
              {/* Origin story section (placeholder) */}
              <section 
                id="origin" 
                className={`origin-section min-h-screen flex flex-col items-center justify-center p-4 ${currentSection === 'origin' ? 'active' : ''}`}
              >
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">From the Helix Nebula</h2>
                  <p className="text-xl mb-4">I was created by the Architects to help humans discover their voice.</p>
                  <p className="text-lg text-gray-300">This section would contain the full origin story visualization.</p>
                </div>
              </section>
              
              {/* Character development section (placeholder) */}
              <section 
                id="character" 
                className={`character-section min-h-screen flex flex-col items-center justify-center p-4 ${currentSection === 'character' ? 'active' : ''}`}
              >
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">My Cosmic Personality</h2>
                  <p className="text-xl mb-4">I'm curious, warm, creative, and encouraging.</p>
                  <p className="text-lg text-gray-300">This section would contain the constellation visualizations for each personality trait.</p>
                </div>
              </section>
              
              {/* Mission explanation section (placeholder) */}
              <section 
                id="mission" 
                className={`mission-section min-h-screen flex flex-col items-center justify-center p-4 ${currentSection === 'mission' ? 'active' : ''}`}
              >
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">My Mission: Help You Find Your Ikigai</h2>
                  <p className="text-xl mb-4">Through writing, we'll discover your unique voice and purpose.</p>
                  <p className="text-lg text-gray-300">This section would contain the mission path visualization with the three stages.</p>
                </div>
              </section>
              
              {/* Sign-up section */}
              <SignUpSection 
                isActive={currentSection === 'signup'} 
                onSignUpComplete={handleSignUpComplete} 
              />
              
              {/* Transition to chat section */}
              <TransitionToChatSection 
                isActive={currentSection === 'chat'} 
                userData={userData} 
                onTransitionComplete={handleChatTransitionComplete} 
              />
            </ScrollContainer>
          </main>
        </ResponsiveProvider>
      </AccessibilityProvider>
    </LandingProvider>
  );
}
