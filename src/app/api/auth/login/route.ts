import { NextResponse, NextRequest } from 'next/server';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // TODO: Replace with actual database authentication
    // This is a mock authentication for development
    if (email === 'test@example.com' && password === 'password') {
      // Create tokens
      const accessToken = sign(
        { 
          userId: '123',
          email,
          name: 'Test User',
          role: 'user'
        },
        JWT_SECRET,
        { expiresIn: '15m' }
      );

      const refreshToken = sign(
        { userId: '123' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Set cookies
      const response = NextResponse.json(
        { success: true, message: 'Login successful', accessToken },
        { status: 200 }
      );

      // Set HttpOnly cookies
      response.cookies.set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 // 15 minutes
      });

      response.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 