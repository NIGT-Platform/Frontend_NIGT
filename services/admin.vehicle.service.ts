import { axiosInstance } from '../lib/axios';
import { Vehicle } from './vehicle.service';

export const adminVehicleService = {
  getAllVehicles: async (): Promise<{ vehicles: Vehicle[] }> => {
    const response = await axiosInstance.get('/admin/vehicles');
    return response.data;
  },

  getPendingVehicles: async (): Promise<{ vehicles: Vehicle[] }> => {
    const response = await axiosInstance.get('/admin/vehicles/pending');
    return response.data;
  },

  getVehicleById: async (id: string): Promise<{ vehicle: Vehicle }> => {
    const response = await axiosInstance.get(`/admin/vehicles/${id}`);
    return response.data;
  },

  approveVehicle: async (id: string): Promise<{ vehicle: Vehicle }> => {
    const response = await axiosInstance.patch(`/admin/vehicles/${id}/approve`);
    return response.data;
  },

  rejectVehicle: async (id: string): Promise<{ vehicle: Vehicle }> => {
    const response = await axiosInstance.patch(`/admin/vehicles/${id}/reject`);
    return response.data;
  },

  suspendVehicle: async (id: string): Promise<{ vehicle: Vehicle }> => {
    const response = await axiosInstance.patch(`/admin/vehicles/${id}/suspend`);
    return response.data;
  },
};
