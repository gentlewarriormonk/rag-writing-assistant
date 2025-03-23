import { SupabaseLoginForm } from '@/components/auth/supabase-login-form';
import DemoModeButton from '@/components/auth/demo-mode-button';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#121212] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex items-center mb-4">
            <img 
              src="/kaku/kaku-avatar.png" 
              alt="Kaku Character" 
              className="h-24 mr-4"
            />
            <img 
              src="/kaku/kaku-logo.png" 
              alt="Kaku" 
              className="h-16"
            />
          </div>
          <div className="text-center text-white text-xl">
            <p>Welcome back! I'm Kaku.</p>
            <p className="text-sm text-gray-400 mt-2">Log in to continue writing with your AI assistant</p>
          </div>
        </div>
        <h2 className="mt-2 text-center text-sm font-medium text-gray-400">
          Your AI Writing Assistant
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#1e1e1e] py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-800">
          <SupabaseLoginForm />
          
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link 
                href="/register" 
                className="font-medium text-[#00a8e8] hover:text-[#0077b6] transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
          
          {/* Demo Mode Button */}
          <DemoModeButton />
        </div>
      </div>
    </div>
  );
}
