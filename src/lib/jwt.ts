import { NextRequest } from 'next/server';

// JWT functions are replaced with simplified versions for development
// In a real app, you would use proper JWT libraries

/**
 * Signs a JWT token with the provided payload
 */
export function signJWT(payload: any, expiresIn = '7d') {
  // For development mode, we just base64 encode the payload
  // In production, use a proper JWT library
  const encodedPayload = Buffer.from(JSON.stringify({
    ...payload,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days expiry
  })).toString('base64');
  
  return `dev-jwt.${encodedPayload}.signature`;
}

/**
 * Verifies a JWT token and returns the decoded payload
 */
export function verifyJWT(token: string) {
  try {
    // For development mode, we just decode the payload
    // In production, use a proper JWT library
    if (!token || !token.includes('.')) return null;
    
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return null;
    
    const decodedPayload = JSON.parse(
      Buffer.from(payloadBase64, 'base64').toString('utf-8')
    );
    
    // Check if token is expired
    if (decodedPayload.exp && decodedPayload.exp < Date.now()) {
      return null;
    }
    
    return decodedPayload;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

/**
 * Middleware helper to verify JWT from Authorization header
 */
export async function verifyJWTFromRequest(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  return verifyJWT(token);
} 