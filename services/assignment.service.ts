import { axiosInstance } from '../lib/axios';
import { UserProfile } from './profile.service';
import { Vehicle } from './vehicle.service';

export interface VehicleAssignment {
  id: string;
  vehicleId: string;
  driverId: string;
  assignedById: string;
  status: 'PENDING' | 'ACTIVE' | 'ENDED';
  assignedAt: string;
  endedAt?: string;
  driver?: UserProfile;
  assignedBy?: Partial<UserProfile>;
  vehicle?: Vehicle & { owner?: Partial<UserProfile> };
}

export const assignmentService = {
  // Fetch drivers available for assignment
  getAvailableDrivers: async (): Promise<{ drivers: UserProfile[] }> => {
    const response = await axiosInstance.get('/users/available-drivers');
    return response.data;
  },

  // Owner endpoints
  assignDriver: async (vehicleId: string, driverId: string): Promise<{ assignment: VehicleAssignment }> => {
    const response = await axiosInstance.post(`/vehicles/${vehicleId}/assign`, { driverId });
    return response.data;
  },

  unassignDriver: async (vehicleId: string, driverId: string): Promise<{ assignment: VehicleAssignment }> => {
    const response = await axiosInstance.post(`/vehicles/${vehicleId}/unassign`, { driverId });
    return response.data;
  },

  getVehicleAssignments: async (vehicleId: string): Promise<{ assignments: VehicleAssignment[] }> => {
    const response = await axiosInstance.get(`/vehicles/${vehicleId}/assignments`);
    return response.data;
  },

  // Admin endpoints (same structure but hits /admin/...)
  adminAssignDriver: async (vehicleId: string, driverId: string): Promise<{ assignment: VehicleAssignment }> => {
    const response = await axiosInstance.post(`/admin/vehicles/${vehicleId}/assign`, { driverId });
    return response.data;
  },

  adminUnassignDriver: async (vehicleId: string, driverId: string): Promise<{ assignment: VehicleAssignment }> => {
    const response = await axiosInstance.post(`/admin/vehicles/${vehicleId}/unassign`, { driverId });
    return response.data;
  },

  adminGetVehicleAssignments: async (vehicleId: string): Promise<{ assignments: VehicleAssignment[] }> => {
    const response = await axiosInstance.get(`/admin/vehicles/${vehicleId}/assignments`);
    return response.data;
  },

  // Driver endpoint
  getMyAssignment: async (): Promise<{ assignment: VehicleAssignment | null }> => {
    const response = await axiosInstance.get('/driver/my-assignment');
    return response.data;
  }
};
