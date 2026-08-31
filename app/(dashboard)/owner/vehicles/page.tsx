'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Truck, CheckCircle, Clock, XCircle, AlertTriangle, ChevronRight } from 'lucide-react';
import { vehicleService, Vehicle, ApprovalStatus } from '@/services/vehicle.service';

const statusConfig: Record<ApprovalStatus, { label: string; color: string; icon: React.ElementType }> = {
  PENDING: { label: 'Pending Review', color: 'bg-amber-100 text-amber-700', icon: Clock },
  APPROVED: { label: 'Approved', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
  SUSPENDED: { label: 'Suspended', color: 'bg-slate-100 text-slate-600', icon: AlertTriangle },
};

export default function MyVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    vehicleService.getMyVehicles()
      .then(res => setVehicles(res.vehicles))
      .catch(() => setError('Failed to load vehicles. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Vehicles</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track your registered vehicles</p>
        </div>
        <Link href="/owner/vehicles/register">
          <button className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm">
            <Plus className="h-4 w-4" />
            Register Vehicle
          </button>
        </Link>
      </div>

      {/* Content */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">{error}</div>
      )}

      {!loading && !error && vehicles.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <Truck className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No vehicles yet</h3>
          <p className="text-sm text-slate-500 mb-6">Register your first vehicle to get started.</p>
          <Link href="/owner/vehicles/register">
            <button className="bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              Register a Vehicle
            </button>
          </Link>
        </div>
      )}

      {!loading && !error && vehicles.length > 0 && (
        <div className="grid gap-4">
          {vehicles.map((vehicle) => {
            const status = statusConfig[vehicle.approvalStatus];
            const StatusIcon = status.icon;
            return (
              <Link key={vehicle.id} href={`/owner/vehicles/${vehicle.id}`}>
                <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-[var(--color-primary)] hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-100 rounded-lg p-3 group-hover:bg-blue-50 transition-colors">
                        <Truck className="h-6 w-6 text-slate-500 group-hover:text-[var(--color-primary)]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-slate-800">{vehicle.brand} {vehicle.model}</h3>
                          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono">
                            {vehicle.plateNumber}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {vehicle.vehicleType} · {vehicle.capacity} {vehicle.capacityUnit} · {vehicle.manufacturingYear}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${status.color}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {status.label}
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[var(--color-primary)]" />
                    </div>
                  </div>
                  {vehicle.documents.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <p className="text-xs text-slate-400">{vehicle.documents.length} document(s) uploaded</p>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
