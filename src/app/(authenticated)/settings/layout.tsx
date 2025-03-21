import React from 'react';
import ProtectedRoute from '@/components/protectedroute';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#121212] text-white">
        {children}
      </main>
    </ProtectedRoute>
  );
} 