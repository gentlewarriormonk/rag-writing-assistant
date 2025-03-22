import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white p-4">
      <div className="max-w-md w-full bg-[#1a1a1a] rounded-lg shadow-lg p-6 border border-gray-800 text-center">
        <div className="text-5xl font-bold text-gray-500 mb-4">404</div>
        <h2 className="text-xl font-semibold mb-2">Page Not Found</h2>
        
        <p className="text-gray-400 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col space-y-2">
          <Link href="/" className="w-full">
            <Button variant="default" className="w-full">
              Return Home
            </Button>
          </Link>
          
          <Link href="/dashboard" className="w-full">
            <Button variant="outline" className="w-full">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 