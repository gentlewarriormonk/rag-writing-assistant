import { NextResponse, NextRequest } from 'next/server';
import { sign } from 'jsonwebtoken';
import { isStrongPassword } from '@/utils/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (!isStrongPassword(password)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Password must be at least 8 characters and include a number or special character' 
        },
        { status: 400 }
      );
    }

    // TODO: Replace with actual database registration
    // This is a mock registration for development
    const userId = Math.random().toString(36).substring(2, 15);
    
    // In a real app, you would:
    // 1. Check if the user already exists
    // 2. Hash the password (e.g., with bcrypt)
    // 3. Store the user in your database

    // Create tokens
    const accessToken = sign(
      { 
        userId,
        email,
        name,
        role: 'user'
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = sign(
      { userId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookies
    const response = NextResponse.json(
      { success: true, message: 'Registration successful', accessToken },
      { status: 201 }
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
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 