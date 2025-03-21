// src/utils/auth.ts
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface CustomJwtPayload extends JwtPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
  exp: number;
}

/**
 * Securely store tokens in HttpOnly cookies
 * Note: This requires backend support for setting cookies
 */
export const storeTokens = async (tokens: AuthTokens): Promise<void> => {
  // In a real implementation, this would be a request to your backend
  // which would set HttpOnly cookies
  
  // For development without backend cookie support, you might use:
  // localStorage.setItem('accessToken', tokens.accessToken);
  // But this is LESS SECURE than HttpOnly cookies

  // Instead, we'll assume an API endpoint that sets cookies:
  try {
    await fetch('/api/auth/set-cookies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tokens),
      credentials: 'include', // Important for cookies
    });
  } catch (error) {
    console.error('Failed to store tokens:', error);
    throw new Error('Authentication failed: Unable to store session');
  }
};

/**
 * Clear authentication tokens (logout)
 */
export const clearTokens = async (): Promise<void> => {
  // In a real implementation with HttpOnly cookies:
  try {
    await fetch('/api/auth/clear-cookies', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Failed to clear tokens:', error);
    // Still attempt to clear any tokens that might be in storage
  }

  // For development without backend cookie support:
  // localStorage.removeItem('accessToken');
};

/**
 * Extract user information from JWT token
 */
export const getUserFromToken = (token: string): User | null => {
  try {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    
    // Check if token is expired
    const currentTime = Date.now() / 1000;
    if (decoded.exp && decoded.exp < currentTime) {
      return null;
    }
    
    return {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role as 'user' | 'admin',
    };
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};

/**
 * Check if user has required permissions
 */
export const hasPermission = (user: User | null, requiredRole: 'user' | 'admin'): boolean => {
  if (!user) return false;
  
  // Admin has access to everything
  if (user.role === 'admin') return true;
  
  // User only has access to user-level permissions
  return user.role === requiredRole;
};

/**
 * Refresh the access token using refresh token
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include', // Important for sending cookies
    });
    
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    
    const data = await response.json();
    return data.accessToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return null;
  }
};

/**
 * Setup axios interceptor for automatic token refresh
 */
export const setupAxiosInterceptors = (axios: any) => {
  axios.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      const originalRequest = error.config;
      
      // If error is 401 and we haven't already tried to refresh
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        const newToken = await refreshAccessToken();
        if (newToken) {
          // No need to manually set token in headers if using HttpOnly cookies
          // The cookie will be automatically sent with the request
          
          // But for development without cookie support:
          // axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          // originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          
          return axios(originalRequest);
        }
      }
      
      return Promise.reject(error);
    }
  );
};

/**
 * Validate reasonable password strength
 */
export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters with some complexity (number or special char)
  const reasonablePasswordRegex = /^(?=.*[a-z])(?=.*[0-9A-Z@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  return reasonablePasswordRegex.test(password);
};

/**
 * Create a sanitized version of user data for the client
 */
export const sanitizeUserData = (user: User): Omit<User, 'password'> => {
  // Create a copy of the user object without sensitive data
  const { ...sanitizedUser } = user;
  return sanitizedUser;
};

/**
 * Generate a CSRF token for forms
 */
export const generateCSRFToken = (): string => {
  // In a real implementation, this would be from your backend
  // For now, generate a random string
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
};
