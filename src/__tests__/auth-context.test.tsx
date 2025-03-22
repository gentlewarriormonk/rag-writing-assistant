import { renderHook, act } from '@testing-library/react';
import { useAuth, AuthProvider, UserRole } from '../contexts/supabase-auth-context';
import { createClient } from '@supabase/supabase-js';
import { ReactNode } from 'react';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      update: jest.fn().mockResolvedValue({ data: null, error: null }),
      insert: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
  })),
}));

describe('Auth Context', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it('provides auth state', async () => {
    let hook: any;

    await act(async () => {
      hook = renderHook(() => useAuth(), { wrapper });
    });

    expect(hook.result.current).toHaveProperty('isAuthenticated');
    expect(hook.result.current).toHaveProperty('isLoading');
    expect(hook.result.current).toHaveProperty('user');
    expect(hook.result.current).toHaveProperty('session');
  });

  it('handles demo mode', async () => {
    let hook: any;

    await act(async () => {
      hook = renderHook(() => useAuth(), { wrapper });
    });

    await act(async () => {
      await hook.result.current.enterDemoMode();
    });

    expect(hook.result.current.isDemo).toBe(true);

    await act(async () => {
      await hook.result.current.exitDemoMode();
    });

    expect(hook.result.current.isDemo).toBe(false);
  });

  it('checks permissions correctly', async () => {
    let hook: any;

    await act(async () => {
      hook = renderHook(() => useAuth(), { wrapper });
    });

    await act(async () => {
      await hook.result.current.enterDemoMode();
    });

    expect(hook.result.current.checkPermission('free')).toBe(true);
    expect(hook.result.current.checkPermission('paid')).toBe(false);

    await act(async () => {
      await hook.result.current.exitDemoMode();
    });
  });
}); 