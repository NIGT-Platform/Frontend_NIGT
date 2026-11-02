'use client';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Clock, Truck, ChevronDown, ChevronUp, Loader2, Eye } from 'lucide-react';
import { adminVehicleService } from '@/services/admin.vehicle.service';
import { Vehicle, ApprovalStatus } from '@/services/vehicle.service';
import { getFileUrl } from '@/lib/axios';

const statusConfig: Record<ApprovalStatus, { label: string; color: string; icon: React.ElementType }> = {
  PENDING: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: Clock },
  APPROVED: { label: 'Approved', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
  SUSPENDED: { label: 'Suspended', color: 'bg-slate-100 text-slate-600', icon: AlertTriangle },
};

type Tab = 'all' | 'pending';

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('pending');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchVehicles = async (activeTab: Tab) => {
    setLoading(true);
    setError('');
    try {
      const res = activeTab === 'pending'
        ? await adminVehicleService.getPendingVehicles()
        : await adminVehicleService.getAllVehicles();
      setVehicles(res.vehicles);
    } catch {
      setError('Failed to load vehicles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVehicles(tab); }, [tab]);

  const handleAction = async (id: string, action: 'approve' | 'reject' | 'suspend') => {
    setActionLoading(`${id}-${action}`);
    try {
      if (action === 'approve') await adminVehicleService.approveVehicle(id);
      else if (action === 'reject') await adminVehicleService.rejectVehicle(id);
      else await adminVehicleService.suspendVehicle(id);
      await fetchVehicles(tab);
    } catch (err: any) {
      setError(err?.response?.data?.message || `Failed to ${action} vehicle.`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Vehicle Management</h1>
        <p className="text-sm text-slate-500 mt-1">Review and manage all vehicles in the system</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-lg w-fit">
        {([['pending', 'Pending Approval'], ['all', 'All Vehicles']] as [Tab, string][]).map(([value, label]) => (
          <button key={value} onClick={() => setTab(value)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === value ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm mb-4">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <Truck className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <p className="text-slate-500 text-sm">{tab === 'pending' ? 'No pending vehicles to review.' : 'No vehicles found.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {vehicles.map((vehicle) => {
            const status = statusConfig[vehicle.approvalStatus];
            const StatusIcon = status.icon;
            const isExpanded = expandedId === vehicle.id;
            return (
              <div key={vehicle.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                {/* Main row */}
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 rounded-lg p-2.5">
                      <Truck className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-slate-800">{vehicle.brand} {vehicle.model}</h3>
                        <span className="text-xs font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{vehicle.plateNumber}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Owner: {vehicle.owner?.firstName} {vehicle.owner?.lastName} · {vehicle.owner?.email}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {vehicle.vehicleType} · {vehicle.capacity} {vehicle.capacityUnit} · {vehicle.manufacturingYear}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${status.color}`}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      {status.label}
                    </span>
                    <button onClick={() => setExpandedId(isExpanded ? null : vehicle.id)}
                      className="text-slate-400 hover:text-slate-600 p-1 transition-colors">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded section */}
                {isExpanded && (
                  <div className="border-t border-slate-100 p-5 bg-slate-50">
                    {/* Documents */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Documents</p>
                      {vehicle.documents.length === 0 ? (
                        <p className="text-xs text-slate-400">No documents uploaded yet.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {vehicle.documents.map(doc => (
                            <a key={doc.id} href={getFileUrl(doc.documentUrl)} target="_blank" rel="noreferrer"
                              className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg transition-colors">
                              <Eye className="h-3.5 w-3.5" />
                              {doc.documentType.replace(/_/g, ' ')}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {vehicle.approvalStatus === 'PENDING' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleAction(vehicle.id, 'approve')}
                          disabled={!!actionLoading}
                          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 disabled:opacity-60 transition-colors">
                          {actionLoading === `${vehicle.id}-approve` ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                          Approve
                        </button>
                        <button onClick={() => handleAction(vehicle.id, 'reject')}
                          disabled={!!actionLoading}
                          className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-60 transition-colors">
                          {actionLoading === `${vehicle.id}-reject` ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                          Reject
                        </button>
                      </div>
                    )}
                    {vehicle.approvalStatus === 'APPROVED' && (
                      <button onClick={() => handleAction(vehicle.id, 'suspend')}
                        disabled={!!actionLoading}
                        className="flex items-center gap-1.5 px-4 py-2 bg-slate-700 text-white text-sm rounded-lg hover:bg-slate-800 disabled:opacity-60 transition-colors">
                        {actionLoading === `${vehicle.id}-suspend` ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertTriangle className="h-4 w-4" />}
                        Suspend Vehicle
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
