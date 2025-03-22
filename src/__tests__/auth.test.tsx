import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/supabase-auth-context';
import { RoleProtected } from '../components/auth/role-protection';
import { ReactNode } from 'react';

// Mock the useAuth hook
jest.mock('../contexts/supabase-auth-context', () => {
  const originalModule = jest.requireActual('../contexts/supabase-auth-context');
  return {
    ...originalModule,
    useAuth: jest.fn(),
    AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  };
});

// Mock Supabase client
jest.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

describe('Authentication', () => {
  describe('Role Protection', () => {
    it('redirects unauthenticated users', async () => {
      // Mock unauthenticated state
      (useAuth as jest.Mock).mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        checkPermission: jest.fn().mockReturnValue(false),
      });

      render(
        <RoleProtected>
          <div>Protected Content</div>
        </RoleProtected>
      );

      await waitFor(() => {
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      });
    });

    it('shows content for users with correct role', async () => {
      // Mock authenticated state with correct role
      (useAuth as jest.Mock).mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '123', email: 'test@example.com', role: 'free' },
        checkPermission: jest.fn().mockReturnValue(true),
      });

      render(
        <RoleProtected requiredRole="free">
          <div>Protected Content</div>
        </RoleProtected>
      );

      await waitFor(() => {
        expect(screen.queryByText('Protected Content')).toBeInTheDocument();
      });
    });
  });
}); 