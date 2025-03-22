import { SupabaseLoginForm } from '@/components/auth/supabase-login-form';
import DemoModeButton from '@/components/auth/demo-mode-button';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#121212] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="h-12 w-12 bg-gradient-to-br from-[#0077b6] to-[#00a8e8] rounded-lg flex items-center justify-center">
            <span className="text-white text-2xl font-bold">書</span>
          </div>
        </div>
        <h1 className="text-center text-3xl font-bold">
          <span className="bg-gradient-to-r from-[#0077b6] to-[#00a8e8] text-transparent bg-clip-text">
            Kaku
          </span>
        </h1>
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
