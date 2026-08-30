export type Role = 'ADMIN' | 'VEHICLE_OWNER' | 'DRIVER';
export type AccountStatus = 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';

export interface User {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: Role;
  accountStatus: AccountStatus;
  emailVerified: boolean;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}

export interface ApiError {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}
