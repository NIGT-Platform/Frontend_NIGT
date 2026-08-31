'use client';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Car } from 'lucide-react';

export default function VehicleOwnerDashboard() {
  return (
    <RoleGuard allowedRoles={['VEHICLE_OWNER']}>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="bg-[var(--color-secondary)] p-3 rounded-xl text-white shadow-sm">
            <Car className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Vehicle Owner Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage your registered vehicles and assign drivers.</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <h2 className="text-xl font-medium text-slate-700 mb-2">Welcome to your workspace!</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            This section is currently under construction. Soon, you'll be able to register new vehicles, assign drivers, and monitor your fleet directly from here.
          </p>
        </div>
      </div>
    </RoleGuard>
  );
}
