'use client';

import React from 'react';
import Navbar from './navbar';
import Sidebar from './sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-lighter-gray">
      {/* Mobile navigation */}
      <div className="md:hidden">
        <Navbar />
      </div>

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - hidden on mobile */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Page content */}
          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout; 