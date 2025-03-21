import { RegisterForm } from '@/components/auth/registerform';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-lighter-gray dark:bg-dark-gray flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
          RAG Writing Assistant
        </h1>
        <h2 className="mt-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-dark-lighter py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <RegisterForm />
          
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 