import { axiosInstance } from '../lib/axios';
import { UserProfile } from './profile.service';
import { Vehicle } from './vehicle.service';
import { TransportJob } from './job.service';

export type TripStatus =
  | 'SCHEDULED'
  | 'STARTED'
  | 'IN_TRANSIT'
  | 'ARRIVED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Delivery {
  id: string;
  tripId: string;
  status: 'PENDING' | 'DELIVERED' | 'FAILED';
  deliveredAt: string;
  receiverName: string;
  receiverPhone?: string | null;
  notes?: string | null;
  proofDocumentUrl?: string | null;
}

export interface Trip {
  id: string;
  referenceNumber: string;
  jobId: string;
  vehicleId: string;
  driverId: string;
  status: TripStatus;
  pickupLocation: string;
  destination: string;
  plannedDeparture?: string | null;
  actualDeparture?: string | null;
  expectedArrival?: string | null;
  actualArrival?: string | null;
  startingOdometer?: number | null;
  endingOdometer?: number | null;
  distanceTravelled?: number | null;
  notes?: string | null;
  cancellationReason?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  updatedAt: string;
  job?: TransportJob;
  vehicle?: Vehicle & { owner?: Partial<UserProfile> };
  driver?: Partial<UserProfile>;
  delivery?: Delivery | null;
}

export const tripService = {
  getTrips: async (params?: {
    status?: string;
    search?: string;
  }): Promise<{ success: boolean; count: number; trips: Trip[] }> => {
    const response = await axiosInstance.get('/trips', { params });
    return response.data;
  },

  getTripById: async (id: string): Promise<{ success: boolean; trip: Trip }> => {
    const response = await axiosInstance.get(`/trips/${id}`);
    return response.data;
  },

  startTrip: async (
    tripId: string,
    startingOdometer: number
  ): Promise<{ success: boolean; message: string; trip: Trip }> => {
    const response = await axiosInstance.post(`/trips/${tripId}/start`, { startingOdometer });
    return response.data;
  },

  updateTripStatus: async (
    tripId: string,
    status: TripStatus
  ): Promise<{ success: boolean; message: string; trip: Trip }> => {
    const response = await axiosInstance.patch(`/trips/${tripId}/status`, { status });
    return response.data;
  },

  recordDelivery: async (
    tripId: string,
    formData: FormData
  ): Promise<{ success: boolean; message: string; trip: Trip; delivery: Delivery }> => {
    const response = await axiosInstance.post(`/trips/${tripId}/delivery`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  completeTrip: async (
    tripId: string,
    endingOdometer: number
  ): Promise<{ success: boolean; message: string; trip: Trip }> => {
    const response = await axiosInstance.post(`/trips/${tripId}/complete`, { endingOdometer });
    return response.data;
  },

  cancelTrip: async (
    tripId: string,
    reason: string
  ): Promise<{ success: boolean; message: string; trip: Trip }> => {
    const response = await axiosInstance.post(`/trips/${tripId}/cancel`, { reason });
    return response.data;
  },
};
