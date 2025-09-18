import axios, { type AxiosRequestHeaders } from 'axios';
import { API_CONFIG } from './config';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Prefer per-user token from localStorage on the client
    try {
      const isBrowser = typeof window !== 'undefined';
      const token = isBrowser ? window.localStorage.getItem('token') : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // Fallback to static API token when available
        if (API_CONFIG.TOKEN) {
          config.headers.Authorization = `Bearer ${API_CONFIG.TOKEN}`;
        } else {
          // If no tokens, ensure Authorization header is not set
          if (config.headers && 'Authorization' in config.headers) {
            delete (config.headers as AxiosRequestHeaders).Authorization;
          }
        }
      }
    } catch {
      // noop
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.error('Unauthorized: Please login again');
      try {
        const isBrowser = typeof window !== 'undefined';
        if (isBrowser) {
          const existing = window.localStorage.getItem('token');
          if (existing) {
            window.localStorage.removeItem('token');
          }
        }
      } catch {
        // noop
      }
    } else if (error.response?.status === 403) {
      console.error('Forbidden: Access denied');
    } else if (error.response?.status >= 500) {
      console.error('Server error: Please try again later');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
