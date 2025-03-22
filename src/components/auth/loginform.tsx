// src/components/auth/LoginForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-provider';
import { Button } from '@/components/ui/button';

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const success = await login(email, password);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-gray-600 dark:text-gray-400">
            Sign in to your account
          </p>
        </div>
        
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 rounded-md">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
              <input
            id="email"
                name="email"
                type="email"
                required
            className="w-full px-3 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-800"
            placeholder="you@example.com"
              />
            </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
              <input
                id="password"
                name="password"
                type="password"
                required
            className="w-full px-3 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-800"
            placeholder="••••••••"
          />
          </div>

        <Button
              type="submit"
          className="w-full"
              disabled={isLoading}
          loading={isLoading}
        >
              {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
        </form>
    </div>
  );
}
