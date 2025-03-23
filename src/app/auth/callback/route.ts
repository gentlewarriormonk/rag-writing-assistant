import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    try {
      // For Supabase v2.x, we can try a more direct approach
      // Set the auth code in the URL and let Supabase handle the session
      // This avoids calling exchangeCodeForSession directly
      
      // For OAuth, we just need to verify we have an active session
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        console.error('Error getting session:', error);
        return NextResponse.redirect(
          new URL('/login?error=auth-failed', request.url)
        );
      }
      
      // Session established successfully
    } catch (error) {
      console.error('Error during authentication:', error);
      return NextResponse.redirect(
        new URL('/login?error=auth-failed', request.url)
      );
    }
  }
  
  // Redirect to the dashboard or home page
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
