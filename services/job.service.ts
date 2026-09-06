import { axiosInstance } from '../lib/axios';
import { UserProfile } from './profile.service';
import { Vehicle } from './vehicle.service';

export type JobPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type JobStatus =
  | 'DRAFT'
  | 'PENDING_ASSIGNMENT'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface TransportJob {
  id: string;
  referenceNumber: string;
  createdById: string;
  vehicleId?: string | null;
  driverId?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  pickupLocation: string;
  destination: string;
  loadDescription: string;
  loadType: string;
  loadWeight: number;
  loadUnit: 'TON' | 'KG';
  itemCount?: number | null;
  specialInstructions?: string | null;
  plannedPickupDate?: string | null;
  expectedDeliveryDate?: string | null;
  priority: JobPriority;
  status: JobStatus;
  cancellationReason?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: Partial<UserProfile>;
  vehicle?: (Vehicle & { owner?: Partial<UserProfile> }) | null;
  driver?: Partial<UserProfile> | null;
  trips?: any[];
}

export interface CreateJobData {
  pickupLocation: string;
  destination: string;
  loadDescription: string;
  loadType: string;
  loadWeight: number;
  loadUnit?: 'TON' | 'KG';
  itemCount?: number;
  customerName?: string;
  customerPhone?: string;
  specialInstructions?: string;
  plannedPickupDate?: string;
  expectedDeliveryDate?: string;
  priority?: JobPriority;
}

export const jobService = {
  getJobs: async (params?: {
    status?: string;
    priority?: string;
    search?: string;
  }): Promise<{ success: boolean; count: number; jobs: TransportJob[] }> => {
    const response = await axiosInstance.get('/jobs', { params });
    return response.data;
  },

  getJobById: async (id: string): Promise<{ success: boolean; job: TransportJob }> => {
    const response = await axiosInstance.get(`/jobs/${id}`);
    return response.data;
  },

  createJob: async (data: CreateJobData): Promise<{ success: boolean; message: string; job: TransportJob }> => {
    const response = await axiosInstance.post('/jobs', data);
    return response.data;
  },

  assignJob: async (
    jobId: string,
    vehicleId: string
  ): Promise<{ success: boolean; message: string; job: TransportJob }> => {
    const response = await axiosInstance.post(`/jobs/${jobId}/assign`, { vehicleId });
    return response.data;
  },

  updateJob: async (
    jobId: string,
    data: Partial<CreateJobData>
  ): Promise<{ success: boolean; message: string; job: TransportJob }> => {
    const response = await axiosInstance.patch(`/jobs/${jobId}`, data);
    return response.data;
  },

  cancelJob: async (
    jobId: string,
    reason: string
  ): Promise<{ success: boolean; message: string; job: TransportJob }> => {
    const response = await axiosInstance.post(`/jobs/${jobId}/cancel`, { reason });
    return response.data;
  },
};
