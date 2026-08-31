import { axiosInstance } from '../lib/axios';

export interface UserProfile {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  accountStatus: string;
  emailVerified: boolean;
  profileImageUrl?: string;
  createdAt: string;
}

export interface ProfileChangeRequest {
  id: string;
  userId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  phoneNumber: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  reviewedAt?: string;
  user?: UserProfile;
}

export interface ProfileData {
  user: UserProfile;
  pendingRequest: ProfileChangeRequest | null;
  lastRequest: ProfileChangeRequest | null;
}

export const profileService = {
  getProfile: async (): Promise<ProfileData> => {
    const response = await axiosInstance.get('/users/profile');
    return response.data;
  },

  uploadProfileImage: async (formData: FormData): Promise<{ profileImageUrl: string }> => {
    const response = await axiosInstance.post('/users/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  submitEditRequest: async (data: {
    firstName: string;
    middleName?: string;
    lastName: string;
    phoneNumber: string;
  }): Promise<{ request: ProfileChangeRequest }> => {
    const response = await axiosInstance.post('/users/profile/edit-request', data);
    return response.data;
  },

  // Admin
  getPendingProfileRequests: async (): Promise<{ requests: ProfileChangeRequest[] }> => {
    const response = await axiosInstance.get('/admin/profile-requests');
    return response.data;
  },

  approveProfileRequest: async (id: string): Promise<{ request: ProfileChangeRequest }> => {
    const response = await axiosInstance.patch(`/admin/profile-requests/${id}/approve`);
    return response.data;
  },

  rejectProfileRequest: async (id: string): Promise<{ request: ProfileChangeRequest }> => {
    const response = await axiosInstance.patch(`/admin/profile-requests/${id}/reject`);
    return response.data;
  },
};
