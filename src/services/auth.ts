import apiClient from '@/lib/axios';
import { API_CONFIG } from '@/lib/config';

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
  data?: User;
  errors?: string[];
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
  errors?: string[];
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        data
      );
      return response.data;
    } catch {
      return {
        success: false,
        message: 'Network error occurred',
        errors: ['Unable to connect to server'],
      };
    }
  },

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        data
      );
      return response.data;
    } catch {
      return {
        success: false,
        message: 'Network error occurred',
        errors: ['Unable to connect to server'],
      };
    }
  },

  // Store auth data in localStorage
  setAuthData(user: User, token: string) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  },

  // Get auth data from localStorage
  getAuthData(): { user: User | null; token: string | null } {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    return {
      user: user ? JSON.parse(user) : null,
      token: token,
    };
  },

  // Clear auth data
  clearAuthData() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  // Get user profile
  async getProfile(): Promise<ProfileResponse> {
    try {
      const response = await apiClient.get<ProfileResponse>(
        API_CONFIG.ENDPOINTS.AUTH.PROFILE
      );
      return response.data;
    } catch {
      return {
        success: false,
        message: 'Network error occurred',
        errors: ['Unable to fetch profile'],
      };
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
    } catch {
      return {
        success: false,
        message: 'Network error occurred',
        errors: ['Unable to update profile'],
      };
    }
  },
};
