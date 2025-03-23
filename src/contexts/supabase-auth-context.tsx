'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, supabaseAdmin } from '@/lib/supabaseClient';

// Define user roles type
export type UserRole = 'free' | 'paid' | 'enterprise' | 'admin';

// Define enhanced user type with role
export interface EnhancedUser {
  id: string;
  email: string;
  role: UserRole;
  uploadsRemaining: number;
  maxUploads: number;
}

// Define auth context type
interface AuthContextType {
  user: EnhancedUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkPermission: (requiredRole: UserRole) => boolean;
  isDemo: boolean;
  enterDemoMode: () => Promise<void>;
  exitDemoMode: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook for using auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<EnhancedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  // Initialize auth state on component mount
  useEffect(() => {
    // Check for existing session
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check if in demo mode from localStorage
        const isDemoMode = localStorage.getItem('kaku_demo_mode') === 'true';
        if (isDemoMode) {
          // Restore demo user
          const demoUser: EnhancedUser = {
            id: 'demo-user-id',
            email: 'demo@example.com',
            role: 'free',
            uploadsRemaining: 3,
            maxUploads: 3
          };
          setUser(demoUser);
          setIsDemo(true);
          setIsLoading(false);
          return;
        }
        
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session) {
          setSession(session);
          
          // Fetch user data including role from the database
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (userError) {
            console.error('Error fetching user data:', userError);
          } else if (userData) {
            setUser({
              id: userData.id,
              email: userData.email,
              role: userData.role,
              uploadsRemaining: userData.uploads_remaining,
              maxUploads: userData.max_uploads
            });
          }
        }
        
        // Subscribe to auth changes
        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            setSession(currentSession);
            
            if (currentSession) {
              // Fetch user data including role
              const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', currentSession.user.id)
                .single();
              
              if (userError) {
                console.error('Error fetching user data:', userError);
              } else if (userData) {
                // Update last_sign_in if this is a sign-in event
                if (event === 'SIGNED_IN') {
                  await supabase
                    .from('users')
                    .update({ last_sign_in: new Date().toISOString() })
                    .eq('id', userData.id);
                }
                
                setUser({
                  id: userData.id,
                  email: userData.email,
                  role: userData.role,
                  uploadsRemaining: userData.uploads_remaining,
                  maxUploads: userData.max_uploads
                });
              }
            } else {
              setUser(null);
            }
          }
        );
        
        // Cleanup subscription on unmount
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Authentication initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Email/password login
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth login
  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Google sign-in failed:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  // Register new user
  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // Register user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Create user record in our users table
      // This might not be necessary if you have a database trigger that
      // creates a user record when a new auth user is created
      if (data.user) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            role: 'free', // Default role
            uploads_remaining: 3, // Default usage limits
            max_uploads: 3
          });
          
        if (insertError) {
          console.error('Error creating user record:', insertError);
          // Proceed anyway, as the auth user was created successfully
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setIsDemo(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Check if user has required permissions
  const checkPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    
    // Admin has access to everything
    if (user.role === 'admin') return true;
    
    // Enterprise has access to everything except admin
    if (user.role === 'enterprise' && requiredRole !== 'admin') return true;
    
    // Paid has access to paid and free
    if (user.role === 'paid' && (requiredRole === 'paid' || requiredRole === 'free')) return true;
    
    // Free only has access to free
    return user.role === requiredRole;
  };

  // Enter demo mode
  const enterDemoMode = async (): Promise<void> => {
    setIsLoading(true);
    
    // Create a demo user with necessary properties
    const demoUser: EnhancedUser = {
      id: 'demo-user-id',
      email: 'demo@example.com',
      role: 'free',
      uploadsRemaining: 3,
      maxUploads: 3
    };
    
    // Set demo mode state
    setUser(demoUser);
    setIsDemo(true);
    
    // Store demo mode in localStorage for persistence
    localStorage.setItem('kaku_demo_mode', 'true');
    
    // Complete loading
    setIsLoading(false);
  };

  // Exit demo mode
  const exitDemoMode = async (): Promise<void> => {
    // Clear demo mode state
    setUser(null);
    setIsDemo(false);
    
    // Remove demo mode from localStorage
    localStorage.removeItem('kaku_demo_mode');
  };

  const contextValue: AuthContextType = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    login,
    signInWithGoogle,
    register,
    logout,
    checkPermission,
    isDemo,
    enterDemoMode,
    exitDemoMode
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
