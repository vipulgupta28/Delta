import { apiClient } from './api';
import { LoginCredentials, SignupCredentials, AuthResponse, OTPVerification } from '../types/auth';
import { User } from '../types/user';

export const authApi = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  // Register user
  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/signup', credentials);
  },

  // Logout user
  logout: async (): Promise<void> => {
    return apiClient.post<void>('/auth/logout');
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
  },

  // Verify OTP
  verifyOTP: async (otpData: OTPVerification): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/verify-otp', otpData);
  },

  // Send OTP
  sendOTP: async (email: string): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/auth/send-otp', { email });
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    return apiClient.get<User>('/auth/me');
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    return apiClient.put<User>('/auth/profile', userData);
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    return apiClient.put<{ message: string }>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/auth/reset-password', {
      token,
      newPassword,
    });
  },
};
