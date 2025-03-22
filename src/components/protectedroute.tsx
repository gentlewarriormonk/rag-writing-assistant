// src/components/ProtectedRoute.tsx
'use client';

import { FC, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, UserRole } from '@/contexts/supabase-auth-context';
import { Spinner } from './ui/spinner';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, isLoading, checkPermission } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login with the current path as the return URL
      router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
    } else if (!isLoading && isAuthenticated && requiredRole && !checkPermission(requiredRole)) {
      // User doesn't have the required role, redirect to dashboard
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, requiredRole, router, pathname, checkPermission]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Show children only if authenticated and has the required role (if any)
  if (isAuthenticated && (!requiredRole || checkPermission(requiredRole))) {
    return <>{children}</>;
  }

  // Don't render anything if not authenticated or missing required role
  // The useEffect will handle the redirect
  return null;
};

export default ProtectedRoute;
