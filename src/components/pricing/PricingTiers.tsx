'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PricingTier {
  title: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  isPopular?: boolean;
  ctaLink: string;
}

export default function PricingTiers() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const router = useRouter();
  
  const pricingTiers: PricingTier[] = [
    {
      title: "Free",
      price: "0",
      description: "Perfect for getting started with the basics.",
      features: [
        "One voice profile",
        "Up to 3 writing samples",
        "5 messages per day",
        "Basic style adjustments",
        "Standard response time"
      ],
      cta: "Get Started",
      ctaLink: "/register"
    },
    {
      title: "Premium",
      price: billingCycle === 'monthly' ? "12" : "99",
      description: "For writers who need more flexibility and faster responses.",
      features: [
        "Multiple voice profiles",
        "Unlimited writing samples",
        "Unlimited messages",
        "Advanced style adjustments",
        "Priority response time",
        "Export in multiple formats",
        "Content enhancement tools"
      ],
      isPopular: true,
      cta: "Upgrade Now",
      ctaLink: "/register?plan=premium"
    },
    {
      title: "Enterprise",
      price: "Custom",
      description: "For teams and businesses with advanced needs.",
      features: [
        "Team voice profiles",
        "Collaborative editing",
        "Style guide integration",
        "API access",
        "Team management",
        "SSO authentication",
        "Dedicated support"
      ],
      cta: "Contact Sales",
      ctaLink: "/contact"
    }
  ];

  return (
    <div className="w-full max-w-6xl">
      {/* Billing toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-[#252525] p-1 rounded-md flex">
          <button 
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'monthly' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'yearly' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Yearly
            <span className="ml-1 text-xs text-blue-400">(Save 30%)</span>
          </button>
        </div>
      </div>
      
      {/* Pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingTiers.map((tier, index) => (
          <div 
            key={index}
            className={`bg-[#252525] border ${
              tier.isPopular 
                ? 'border-blue-500 shadow-lg shadow-blue-500/10' 
                : 'border-gray-800'
            } rounded-xl overflow-hidden`}
          >
            {tier.isPopular && (
              <div className="bg-blue-600 text-white text-xs font-medium text-center py-1">
                Most Popular
              </div>
            )}
            
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{tier.title}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">${tier.price}</span>
                {tier.price !== "Custom" && (
                  <span className="text-gray-400 text-sm">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                )}
              </div>
              <p className="text-gray-400 text-sm mb-6">{tier.description}</p>
              
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                href={tier.ctaLink}
                className={`w-full block text-center py-2 rounded-md font-medium ${
                  tier.isPopular 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                    : 'bg-[#2e2e2e] hover:bg-[#333] text-gray-200'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {/* Discount note */}
      {billingCycle === 'yearly' && (
        <p className="text-center text-gray-400 text-sm mt-4">
          Yearly plans are billed as one payment and save you 30% compared to monthly billing.
        </p>
      )}
    </div>
  );
} 