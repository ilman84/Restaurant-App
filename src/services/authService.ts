import apiClient from '../lib/axios';
import { API_CONFIG } from '../lib/config';
import { handleApiError } from './apiService';

// Types for authentication
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt?: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
}

export interface AuthErrorResponse {
  success: false;
  message: string;
  errors: string[];
}

// Authentication service
export const authService = {
  // Login user
  async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        loginData
      );
      return response.data;
    } catch (error: unknown) {
      handleApiError(error, 'Login failed');
    }
  },

  // Register user
  async register(registerData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        registerData
      );
      return response.data;
    } catch (error: unknown) {
      handleApiError(error, 'Registration failed');
    }
  },

  // Logout user
  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
      }>(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
      return response.data;
    } catch (error: unknown) {
      handleApiError(error, 'Logout failed');
    }
  },

  // Get user profile
  async getProfile(): Promise<ProfileResponse> {
    try {
      const response = await apiClient.get<ProfileResponse>(
        API_CONFIG.ENDPOINTS.AUTH.PROFILE
      );
      return response.data;
    } catch (error: unknown) {
      handleApiError(error, 'Failed to get profile');
    }
  },

  // Update user profile
  async updateProfile(updateData: UpdateProfileData): Promise<ProfileResponse> {
    try {
      const response = await apiClient.put<ProfileResponse>(
        API_CONFIG.ENDPOINTS.AUTH.PROFILE,
        updateData
      );
      return response.data;
    } catch (error: unknown) {
      handleApiError(error, 'Failed to update profile');
    }
  },
};
