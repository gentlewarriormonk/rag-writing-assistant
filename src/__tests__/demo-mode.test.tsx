// Mock supabase client first before other imports
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

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuth } from '../contexts/supabase-auth-context';
import { ReactNode } from 'react';

// Mock the useAuth hook
jest.mock('../contexts/supabase-auth-context', () => {
  const originalModule = jest.requireActual('../contexts/supabase-auth-context');
  return {
    ...originalModule,
    useAuth: jest.fn(),
  };
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Import DemoModeButton after all mocks are set up
import DemoModeButton from '../components/auth/demo-mode-button';

describe('Demo Mode', () => {
  it('renders demo mode button', async () => {
    // Mock the useAuth hook
    (useAuth as jest.Mock).mockReturnValue({
      isDemo: false,
      enterDemoMode: jest.fn(),
      exitDemoMode: jest.fn(),
    });
    
    render(<DemoModeButton />);
    
    await waitFor(() => {
      expect(screen.getByText('Try Demo Mode')).toBeInTheDocument();
    });
  });
  
  it('calls enterDemoMode when button is clicked', async () => {
    const mockEnterDemoMode = jest.fn();
    
    // Mock the useAuth hook
    (useAuth as jest.Mock).mockReturnValue({
      isDemo: false,
      enterDemoMode: mockEnterDemoMode,
      exitDemoMode: jest.fn(),
    });
    
    render(<DemoModeButton />);
    
    const demoButton = screen.getByText('Try Demo Mode');
    fireEvent.click(demoButton);
    
    await waitFor(() => {
      expect(mockEnterDemoMode).toHaveBeenCalledTimes(1);
    });
  });
  
  it('shows exit demo mode button when in demo mode', async () => {
    // Mock the useAuth hook to indicate demo mode is active
    (useAuth as jest.Mock).mockReturnValue({
      isDemo: true,
      enterDemoMode: jest.fn(),
      exitDemoMode: jest.fn(),
    });
    
    render(<DemoModeButton />);
    
    await waitFor(() => {
      expect(screen.getByText('Exit Demo Mode')).toBeInTheDocument();
    });
  });
  
  it('calls exitDemoMode when exit button is clicked', async () => {
    const mockExitDemoMode = jest.fn();
    
    // Mock the useAuth hook to indicate demo mode is active
    (useAuth as jest.Mock).mockReturnValue({
      isDemo: true,
      enterDemoMode: jest.fn(),
      exitDemoMode: mockExitDemoMode,
    });
    
    render(<DemoModeButton />);
    
    const exitButton = screen.getByText('Exit Demo Mode');
    fireEvent.click(exitButton);
    
    await waitFor(() => {
      expect(mockExitDemoMode).toHaveBeenCalledTimes(1);
    });
  });
}); 