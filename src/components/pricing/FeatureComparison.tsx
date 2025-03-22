'use client';

import React from 'react';

interface FeatureCategory {
  title: string;
  features: Feature[];
}

interface Feature {
  name: string;
  free: boolean | string;
  premium: boolean | string;
  enterprise: boolean | string;
}

export default function FeatureComparison() {
  const featureCategories: FeatureCategory[] = [
    {
      title: "Core Features",
      features: [
        {
          name: "Voice Profiles",
          free: "1",
          premium: "5",
          enterprise: "Unlimited"
        },
        {
          name: "Writing Samples",
          free: "3",
          premium: "Unlimited",
          enterprise: "Unlimited"
        },
        {
          name: "Daily Messages",
          free: "5",
          premium: "Unlimited",
          enterprise: "Unlimited"
        },
        {
          name: "Style & Purpose Controls",
          free: true,
          premium: true,
          enterprise: true
        }
      ]
    },
    {
      title: "Writing Tools",
      features: [
        {
          name: "Content Generation",
          free: true,
          premium: true,
          enterprise: true
        },
        {
          name: "Export Options",
          free: "Basic",
          premium: "Advanced",
          enterprise: "Advanced"
        },
        {
          name: "Formatting Options",
          free: "Basic",
          premium: "Advanced",
          enterprise: "Advanced"
        },
        {
          name: "Multi-format Support",
          free: false,
          premium: true,
          enterprise: true
        }
      ]
    },
    {
      title: "Advanced Features",
      features: [
        {
          name: "Voice Analytics",
          free: false,
          premium: true,
          enterprise: true
        },
        {
          name: "Tone Refinement",
          free: "Basic",
          premium: "Advanced",
          enterprise: "Advanced"
        },
        {
          name: "API Access",
          free: false,
          premium: false,
          enterprise: true
        },
        {
          name: "Custom Integrations",
          free: false,
          premium: false,
          enterprise: true
        }
      ]
    },
    {
      title: "Support",
      features: [
        {
          name: "Documentation Access",
          free: true,
          premium: true,
          enterprise: true
        },
        {
          name: "Email Support",
          free: "Limited",
          premium: "Priority",
          enterprise: "Priority"
        },
        {
          name: "Chat Support",
          free: false,
          premium: true,
          enterprise: true
        },
        {
          name: "Dedicated Account Manager",
          free: false,
          premium: false,
          enterprise: true
        }
      ]
    }
  ];

  // Helper function to render feature availability
  const renderAvailability = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <svg className="w-5 h-5 text-blue-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    }
    return <span className="text-sm text-gray-300">{value}</span>;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left px-6 py-3 bg-[#1e1e1e] text-gray-300 font-medium rounded-tl-lg"></th>
            <th className="text-center px-6 py-3 bg-[#1e1e1e] text-gray-300 font-medium">Free</th>
            <th className="text-center px-6 py-3 bg-blue-900/30 text-blue-300 font-medium">Premium</th>
            <th className="text-center px-6 py-3 bg-[#1e1e1e] text-gray-300 font-medium rounded-tr-lg">Enterprise</th>
          </tr>
        </thead>
        <tbody>
          {featureCategories.map((category, categoryIndex) => (
            <React.Fragment key={categoryIndex}>
              <tr>
                <td 
                  colSpan={4} 
                  className="px-6 py-3 bg-[#252525] text-white font-medium"
                >
                  {category.title}
                </td>
              </tr>
              {category.features.map((feature, featureIndex) => (
                <tr 
                  key={featureIndex}
                  className={featureIndex % 2 === 0 ? 'bg-[#2a2a2a]' : 'bg-[#252525]'}
                >
                  <td className="px-6 py-3 text-gray-300">{feature.name}</td>
                  <td className="px-6 py-3 text-center">{renderAvailability(feature.free)}</td>
                  <td className="px-6 py-3 text-center bg-blue-900/5">{renderAvailability(feature.premium)}</td>
                  <td className="px-6 py-3 text-center">{renderAvailability(feature.enterprise)}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
} 