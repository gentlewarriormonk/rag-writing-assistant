import { render, screen, waitFor } from '@testing-library/react';
import { useAuth } from '../contexts/supabase-auth-context';
import { AuthGuard } from '../components/auth/auth-guard';
import { ReactNode } from 'react';

// Mock supabase client
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
  supabaseAdmin: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
    })),
  },
}));

// Mock the useAuth hook
jest.mock('../contexts/supabase-auth-context', () => {
  const originalModule = jest.requireActual('../contexts/supabase-auth-context');
  return {
    ...originalModule,
    useAuth: jest.fn(),
  };
});

// Mock the Spinner component
jest.mock('../components/ui/spinner', () => ({
  Spinner: () => <div data-testid="loading-spinner">Loading...</div>
}));

// Mock next/navigation
jest.mock('next/navigation', () => {
  const push = jest.fn();
  return {
    useRouter: () => ({
      push,
    }),
    usePathname: () => '/protected',
  };
});

describe('Auth Guards', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Set up router mock
    jest.requireMock('next/navigation').useRouter = () => ({
      push: mockPush,
    });
  });
  
  it('allows authenticated users to access protected content', async () => {
    // Mock authenticated user
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: '123', email: 'test@example.com', role: 'free' },
    });
    
    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
  
  it('redirects unauthenticated users to login page', async () => {
    // Mock unauthenticated user
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });
    
    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );
    
    await waitFor(() => {
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      expect(mockPush).toHaveBeenCalledWith('/login?returnUrl=%2Fprotected');
    });
  });
  
  it('shows loading state while authentication is in progress', async () => {
    // Mock loading state
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
    });
    
    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );
    
    await waitFor(() => {
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
}); 