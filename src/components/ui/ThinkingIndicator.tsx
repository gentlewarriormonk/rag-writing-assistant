'use client';

import React from 'react';

export default function ThinkingIndicator() {
  return (
    <div className="flex items-center space-x-2 px-3 py-2 rounded-full bg-[#1e1e1e] border border-gray-800">
      <div className="text-sm text-gray-300">Thinking</div>
      <div className="flex space-x-1">
        <div className="h-1.5 w-1.5 rounded-full bg-[#00a8e8] animate-pulse" style={{ animationDelay: '0ms' }}></div>
        <div className="h-1.5 w-1.5 rounded-full bg-[#0090cc] animate-pulse" style={{ animationDelay: '300ms' }}></div>
        <div className="h-1.5 w-1.5 rounded-full bg-[#0077b6] animate-pulse" style={{ animationDelay: '600ms' }}></div>
      </div>
    </div>
  );
}
