import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with public credentials
// This client has limited permissions based on your Supabase security policies
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// For server-side operations requiring admin privileges
// IMPORTANT: This should only be used on the server side
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

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
