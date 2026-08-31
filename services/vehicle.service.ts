import { axiosInstance } from '../lib/axios';

export type VehicleType = 'TRUCK' | 'VAN' | 'TRAILER' | 'OTHER';
export type CapacityUnit = 'TON' | 'KG';
export type VehicleStatus = 'ACTIVE' | 'INACTIVE' | 'UNDER_MAINTENANCE' | 'OUT_OF_SERVICE';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
export type DocumentType = 'VEHICLE_REGISTRATION' | 'INSURANCE' | 'INSPECTION';

export interface VehicleDocument {
  id: string;
  vehicleId: string;
  documentType: DocumentType;
  documentUrl: string;
  uploadedAt: string;
}

export interface Vehicle {
  id: string;
  ownerId: string;
  plateNumber: string;
  vehicleType: VehicleType;
  brand: string;
  model: string;
  manufacturingYear: number;
  capacity: number;
  capacityUnit: CapacityUnit;
  vehicleStatus: VehicleStatus;
  approvalStatus: ApprovalStatus;
  createdAt: string;
  updatedAt: string;
  documents: VehicleDocument[];
  owner?: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
  };
}

export interface RegisterVehicleData {
  plateNumber: string;
  vehicleType: VehicleType;
  brand: string;
  model: string;
  manufacturingYear: number;
  capacity: number;
  capacityUnit: CapacityUnit;
}

export const vehicleService = {
  registerVehicle: async (data: RegisterVehicleData): Promise<{ vehicle: Vehicle }> => {
    const response = await axiosInstance.post('/vehicles', data);
    return response.data;
  },

  getMyVehicles: async (): Promise<{ vehicles: Vehicle[] }> => {
    const response = await axiosInstance.get('/vehicles/my-vehicles');
    return response.data;
  },

  getVehicleById: async (id: string): Promise<{ vehicle: Vehicle }> => {
    const response = await axiosInstance.get(`/vehicles/${id}`);
    return response.data;
  },

  updateVehicle: async (id: string, data: Partial<RegisterVehicleData>): Promise<{ vehicle: Vehicle }> => {
    const response = await axiosInstance.patch(`/vehicles/${id}`, data);
    return response.data;
  },

  uploadDocument: async (id: string, formData: FormData): Promise<{ document: VehicleDocument }> => {
    const response = await axiosInstance.post(`/vehicles/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
