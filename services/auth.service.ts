import { axiosInstance } from '../lib/axios';
import { AuthResponse } from '../types/auth.types';

export const authService = {
  // Vehicle Owner Registration
  registerVehicleOwner: async (data: any): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/register/vehicle-owner', data);
    return response.data;
  },

  // Driver Registration (requires multipart/form-data)
  registerDriver: async (formData: FormData): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/register/driver', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Buyer / Customer Registration
  registerBuyer: async (data: any): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/register/buyer', data);
    return response.data;
  },

  // Login
  login: async (data: any): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  },

  // Verify Email
  verifyEmail: async (token: string): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/verify-email', { token });
    return response.data;
  },

  // Resend Verification Email
  resendVerification: async (email: string): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/resend-verification', { email });
    return response.data;
  },

  // Forgot Password
  forgotPassword: async (email: string): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset Password
  resetPassword: async (data: any): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/reset-password', data);
    return response.data;
  },

  // Logout
  logout: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/logout', { refreshToken });
    return response.data;
  },
};
