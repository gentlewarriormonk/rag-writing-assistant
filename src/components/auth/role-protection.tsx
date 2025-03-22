'use client';

import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/contexts/supabase-auth-context';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface RoleProtectedProps {
  children: ReactNode;
  requiredRole?: UserRole;
  fallback?: ReactNode;
  redirectTo?: string;
}

export const RoleProtected: React.FC<RoleProtectedProps> = ({
  children,
  requiredRole = 'free',
  fallback,
  redirectTo = '/login',
}) => {
  const { isAuthenticated, isLoading, checkPermission, isDemo } = useAuth();
  const router = useRouter();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <LoadingSpinner size="md" text="Loading..." />
      </div>
    );
  }

  // If demo mode, show children but only for free tier features
  if (isDemo) {
    if (requiredRole === 'free') {
      return <>{children}</>;
    } else {
      return fallback || (
        <div className="p-8 text-center bg-[#1e1e1e] rounded-lg border border-gray-800">
          <h3 className="text-xl font-medium mb-4">Upgrade Required</h3>
          <p className="text-gray-400 mb-6">
            This feature requires a {requiredRole} plan. You're currently in demo mode.
          </p>
          <button
            onClick={() => router.push('/pricing')}
            className="bg-[#0077b6] hover:bg-[#00a8e8] text-white py-2 px-4 rounded-lg transition-colors"
          >
            View Pricing
          </button>
        </div>
      );
    }
  }

  // Not authenticated, redirect to login
  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      router.push(redirectTo);
    }
    return null;
  }

  // Check permissions
  const hasPermission = checkPermission(requiredRole);
  
  if (!hasPermission) {
    return fallback || (
      <div className="p-8 text-center bg-[#1e1e1e] rounded-lg border border-gray-800">
        <h3 className="text-xl font-medium mb-4">Upgrade Required</h3>
        <p className="text-gray-400 mb-6">
          This feature requires a {requiredRole} plan.
        </p>
        <button
          onClick={() => router.push('/pricing')}
          className="bg-[#0077b6] hover:bg-[#00a8e8] text-white py-2 px-4 rounded-lg transition-colors"
        >
          Upgrade Now
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

// A simpler component for just checking if the user is authenticated
export const AuthProtected: React.FC<{
  children: ReactNode;
  redirectTo?: string;
}> = ({ children, redirectTo = '/login' }) => {
  const { isAuthenticated, isLoading, isDemo } = useAuth();
  const router = useRouter();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <LoadingSpinner size="md" text="Loading..." />
      </div>
    );
  }

  // If demo mode, always show content
  if (isDemo) {
    return <>{children}</>;
  }

  // Not authenticated, redirect to login
  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      router.push(redirectTo);
    }
    return null;
  }

  return <>{children}</>;
};
