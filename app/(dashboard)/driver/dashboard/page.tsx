'use client';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { CreditCard } from 'lucide-react';

export default function DriverDashboard() {
  return (
    <RoleGuard allowedRoles={['DRIVER']}>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-600 p-3 rounded-xl text-white shadow-sm">
            <CreditCard className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Driver Dashboard</h1>
            <p className="text-slate-500 mt-1">View your assignments and manage your driving profile.</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <h2 className="text-xl font-medium text-slate-700 mb-2">Welcome, Driver!</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            This dashboard is currently being built. Once completed, you'll be able to see vehicle assignments, track hours, and update your license information here.
          </p>
        </div>
      </div>
    </RoleGuard>
  );
}
