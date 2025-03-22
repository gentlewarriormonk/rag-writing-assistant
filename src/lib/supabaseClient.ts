import { createClient } from '@supabase/supabase-js';

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create a mock client for development if credentials are missing
const createMockClient = () => {
  console.warn('Using mock Supabase client. Set proper environment variables for production.');
  
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: {}, error: null }),
      signInWithOAuth: () => Promise.resolve({ data: {}, error: null }),
      signUp: () => Promise.resolve({ data: {}, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
    }),
  };
};

// Initialize the Supabase client with public credentials
// This client has limited permissions based on your Supabase security policies
export const supabase = (!supabaseUrl || !supabaseAnonKey) && isDevelopment
  ? createMockClient()
  : createClient(supabaseUrl, supabaseAnonKey);

// For server-side operations requiring admin privileges
// IMPORTANT: This should only be used on the server side
export const supabaseAdmin = (!supabaseUrl || !supabaseServiceKey) && isDevelopment
  ? createMockClient() 
  : createClient(supabaseUrl, supabaseServiceKey);

// Types for your database schema
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: 'free' | 'paid' | 'enterprise' | 'admin';
          created_at: string;
          updated_at: string;
          last_sign_in: string | null;
          uploads_remaining: number;
          max_uploads: number;
        };
        Insert: {
          id?: string;
          email: string;
          role?: 'free' | 'paid' | 'enterprise' | 'admin';
          created_at?: string;
          updated_at?: string;
          last_sign_in?: string | null;
          uploads_remaining?: number;
          max_uploads?: number;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'free' | 'paid' | 'enterprise' | 'admin';
          created_at?: string;
          updated_at?: string;
          last_sign_in?: string | null;
          uploads_remaining?: number;
          max_uploads?: number;
        };
      };
      // Add other tables as needed
    };
  };
};
