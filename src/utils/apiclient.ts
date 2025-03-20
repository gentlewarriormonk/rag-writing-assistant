// src/utils/apiClient.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { setupAxiosInterceptors } from './auth';

// Create a custom instance of axios
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Setup request interceptor for security
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    // Add CSRF token to requests if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
      config.headers = config.headers || {};
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    
    // Add additional security headers
    config.headers = config.headers || {};
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Setup response interceptor for automatic token refresh
setupAxiosInterceptors(apiClient);

// Add response data sanitization
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // You could add data sanitization here if needed
    return response;
  },
  (error) => {
    // Enhanced error handling
    if (error.response) {
      // Server responded with a status code outside 2xx range
      console.error('API Error:', error.response.status, error.response.data);
      
      // Handle specific error codes
      switch (error.response.status) {
        case 401: // Unauthorized
          // This will be handled by the auth interceptor
          break;
        case 403: // Forbidden
          console.error('Permission denied');
          break;
        case 429: // Too Many Requests
          console.error('Rate limit exceeded. Please try again later.');
          break;
        case 500: // Server Error
          console.error('Server error. Please try again later.');
          break;
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error: No response received');
    } else {
      // Something else triggered an error
      console.error('Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Rate limiting helper to prevent API abuse
const rateLimitedEndpoints: Record<string, { lastCall: number; minInterval: number }> = {};

export const callWithRateLimit = async (
  endpoint: string,
  requestFn: () => Promise<AxiosResponse>,
  minIntervalMs = 1000
): Promise<AxiosResponse> => {
  if (!rateLimitedEndpoints[endpoint]) {
    rateLimitedEndpoints[endpoint] = {
      lastCall: 0,
      minInterval: minIntervalMs,
    };
  }
  
  const now = Date.now();
  const timeSinceLastCall = now - rateLimitedEndpoints[endpoint].lastCall;
  
  if (timeSinceLastCall < minIntervalMs) {
    const waitTime = minIntervalMs - timeSinceLastCall;
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  rateLimitedEndpoints[endpoint].lastCall = Date.now();
  return requestFn();
};

// Create typed API request functions
export const apiGet = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return apiClient.get(url, config).then(response => response.data);
};

export const apiPost = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return apiClient.post(url, data, config).then(response => response.data);
};

export const apiPut = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return apiClient.put(url, data, config).then(response => response.data);
};

export const apiDelete = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return apiClient.delete(url, config).then(response => response.data);
};

export default apiClient;
