import { NextResponse, NextRequest } from 'next/server';
import { sign, verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: 'Refresh token not found' },
        { status: 401 }
      );
    }

    try {
      // Verify the refresh token
      const decoded = verify(refreshToken, JWT_SECRET) as { userId: string };
      
      // In a real app, you would:
      // 1. Check if the refresh token is in the blocklist (for logout)
      // 2. Fetch user data from your database based on userId
      // For this mock, we'll create user data
      
      const mockUserData = {
        userId: decoded.userId,
        email: 'test@example.com', // This would come from your database
        name: 'Test User',
        role: 'user'
      };

      // Create a new access token
      const newAccessToken = sign(
        mockUserData,
        JWT_SECRET,
        { expiresIn: '15m' }
      );

      // Set the new access token in a cookie
      const response = NextResponse.json(
        { success: true, accessToken: newAccessToken },
        { status: 200 }
      );

      response.cookies.set('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 // 15 minutes
      });

      return response;
    } catch (error) {
      // Token verification failed
      return NextResponse.json(
        { success: false, message: 'Invalid refresh token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 