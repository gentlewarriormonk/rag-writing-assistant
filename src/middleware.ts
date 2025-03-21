import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

// Define the JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// List of paths that require authentication
const protectedPaths = [
  '/dashboard',
  '/projects',
  '/corpus',
  '/settings',
  '/history',
];

// List of paths that should redirect to dashboard if already authenticated
const authPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Get the token from the cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  
  // Extract user data if token exists
  let user = null;
  if (accessToken) {
    try {
      user = verify(accessToken, JWT_SECRET);
    } catch (error) {
      // Token invalid or expired, user remains null
    }
  }

  const isAuthPath = authPaths.some(authPath => path.startsWith(authPath));
  const isProtectedPath = protectedPaths.some(protectedPath => path.startsWith(protectedPath));

  // Redirect authenticated users away from auth pages
  if (isAuthPath && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users to login
  if (isProtectedPath && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow the request to continue
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 