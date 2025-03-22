import { NextResponse, NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

// Define the JWT secret
const JWT_SECRET = process.env.JWT_SECRET || '';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Extract the JWT token from the request
  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  // Check if it's an API route that should be protected
  if (request.nextUrl.pathname.startsWith('/api/protected')) {
    // If no token, deny access
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    try {
      // Verify the token
      verify(token, JWT_SECRET);
      // If verification passes, continue with the request
      return NextResponse.next();
    } catch (error) {
      // If verification fails, deny access
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }
  }

  // For non-protected routes, continue with the request
  return NextResponse.next();
}

// Update config to specify matcher and runtime
export const config = {
  matcher: ['/api/protected/:path*'],
  runtime: 'nodejs', // Specify Node.js runtime instead of Edge
}; 