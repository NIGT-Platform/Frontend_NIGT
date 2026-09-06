'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Package,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  XCircle,
  Calendar,
  MapPin,
  Search,
  Filter,
  UserCheck,
  Ban,
  Loader2,
} from 'lucide-react';
import { jobService, TransportJob, JobStatus } from '@/services/job.service';
import { vehicleService, Vehicle } from '@/services/vehicle.service';

const statusBadges: Record<JobStatus, { label: string; color: string }> = {
  DRAFT: { label: 'Draft', color: 'bg-slate-100 text-slate-700' },
  PENDING_ASSIGNMENT: { label: 'Pending Vehicle', color: 'bg-amber-100 text-amber-800' },
  ASSIGNED: { label: 'Assigned / Ready', color: 'bg-blue-100 text-blue-800' },
  IN_PROGRESS: { label: 'In Transit', color: 'bg-indigo-100 text-indigo-800' },
  DELIVERED: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-800' },
  COMPLETED: { label: 'Completed', color: 'bg-emerald-200 text-emerald-900' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<TransportJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Assign Modal
  const [selectedJob, setSelectedJob] = useState<TransportJob | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState('');

  // Cancel Modal
  const [cancelJobId, setCancelJobId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;
      const res = await jobService.getJobs(params);
      setJobs(res.jobs);
    } catch (err: any) {
      setError('Failed to load transport jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  // Open Assign Modal
  const openAssignModal = async (job: TransportJob) => {
    setSelectedJob(job);
    setAssignError('');
    setSelectedVehicleId('');
    try {
      const res = await vehicleService.getMyVehicles();
      const approvedVehicles = res.vehicles.filter(
        (v) => v.approvalStatus === 'APPROVED' && v.vehicleStatus === 'ACTIVE'
      );
      setVehicles(approvedVehicles);
      if (approvedVehicles.length > 0) setSelectedVehicleId(approvedVehicles[0].id);
    } catch (err) {
      setAssignError('Could not load approved vehicles.');
    }
  };

  const handleAssignSubmit = async () => {
    if (!selectedJob || !selectedVehicleId) return;
    setAssignLoading(true);
    setAssignError('');
    try {
      await jobService.assignJob(selectedJob.id, selectedVehicleId);
      setSelectedJob(null);
      fetchJobs();
    } catch (err: any) {
      setAssignError(err?.response?.data?.message || 'Failed to assign vehicle.');
    } finally {
      setAssignLoading(false);
    }
  };

  // Cancel Job Submit
  const handleCancelSubmit = async () => {
    if (!cancelJobId || !cancelReason.trim()) return;
    setCancelLoading(true);
    try {
      await jobService.cancelJob(cancelJobId, cancelReason);
      setCancelJobId(null);
      setCancelReason('');
      fetchJobs();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to cancel job');
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Transport Operations & Jobs</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage freight orders, assign vehicles & drivers, and track execution.
          </p>
        </div>
        <Link href="/owner/jobs/create">
          <button className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm">
            <Plus className="h-4 w-4" /> Create Transport Job
          </button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {['ALL', 'PENDING_ASSIGNMENT', 'ASSIGNED', 'IN_PROGRESS', 'DELIVERED', 'COMPLETED', 'CANCELLED'].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  statusFilter === status
                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            )
          )}
        </div>

        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-72">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search reference, route..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-slate-800 text-white rounded-lg text-xs font-medium hover:bg-slate-700"
          >
            Search
          </button>
        </form>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">{error}</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <Package className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-base font-semibold text-slate-700">No transport jobs found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">Post a freight job or adjust your filters.</p>
          <Link href="/owner/jobs/create">
            <button className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg text-xs font-medium hover:opacity-90">
              Create Job
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => {
            const statusInfo = statusBadges[job.status] || { label: job.status, color: 'bg-slate-100 text-slate-700' };
            return (
              <div
                key={job.id}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-[var(--color-primary)]/50 transition-all shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-800 text-sm">{job.referenceNumber}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-medium ${
                          job.priority === 'URGENT'
                            ? 'bg-red-100 text-red-700'
                            : job.priority === 'HIGH'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {job.priority} PRIORITY
                      </span>
                    </div>

                    {/* Route */}
                    <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                      <MapPin className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      <span>{job.pickupLocation}</span>
                      <span className="text-slate-400">⟶</span>
                      <MapPin className="h-4 w-4 text-red-600 flex-shrink-0" />
                      <span>{job.destination}</span>
                    </div>

                    {/* Load details */}
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                      <span>
                        📦 <strong>Cargo:</strong> {job.loadDescription} ({job.loadType})
                      </span>
                      <span>
                        ⚖️ <strong>Weight:</strong> {job.loadWeight} {job.loadUnit}
                      </span>
                      {job.customerName && (
                        <span>
                          👤 <strong>Customer:</strong> {job.customerName}
                        </span>
                      )}
                    </div>

                    {/* Assigned Vehicle & Driver */}
                    {job.vehicle ? (
                      <div className="flex items-center gap-3 bg-blue-50/70 text-blue-900 px-3 py-1.5 rounded-lg text-xs w-fit">
                        <Truck className="h-4 w-4 text-[var(--color-primary)]" />
                        <span>
                          Assigned: <strong>{job.vehicle.plateNumber}</strong> ({job.vehicle.brand})
                        </span>
                        {job.driver ? (
                          <span className="border-l border-blue-200 pl-2">
                            Driver: <strong>{job.driver.firstName} {job.driver.lastName}</strong>
                          </span>
                        ) : (
                          <span className="text-amber-600 italic border-l border-blue-200 pl-2">No active driver on vehicle</span>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-amber-600 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> Awaiting vehicle dispatch
                      </div>
                    )}
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center gap-2 self-end lg:self-center">
                    {job.status === 'PENDING_ASSIGNMENT' && (
                      <button
                        onClick={() => openAssignModal(job)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-white text-xs font-medium hover:opacity-90 shadow-sm"
                      >
                        <Truck className="h-3.5 w-3.5" /> Assign Vehicle
                      </button>
                    )}

                    {['PENDING_ASSIGNMENT', 'ASSIGNED'].includes(job.status) && (
                      <button
                        onClick={() => setCancelJobId(job.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50"
                      >
                        <Ban className="h-3.5 w-3.5" /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Assign Vehicle Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-800">Assign Vehicle to Job</h3>
            <p className="text-xs text-slate-500">
              Select an approved active vehicle for {selectedJob.referenceNumber} ({selectedJob.loadDescription}).
            </p>

            {assignError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {assignError}
              </div>
            )}

            {vehicles.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg">
                You do not have any ACTIVE and APPROVED vehicles. Please register and get approval first.
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Vehicle</label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.plateNumber} — {v.brand} {v.model} ({v.capacity} {v.capacityUnit})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-2">
                  ℹ️ The vehicle's active driver will be automatically scheduled to operate the trip.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={assignLoading || vehicles.length === 0}
                onClick={handleAssignSubmit}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-xs font-medium hover:opacity-90 disabled:opacity-50"
              >
                {assignLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {assignLoading ? 'Assigning...' : 'Confirm Dispatch'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Job Modal */}
      {cancelJobId && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-800">Cancel Transport Job</h3>
            <p className="text-xs text-slate-500">Please provide a reason for cancelling this transport order.</p>

            <textarea
              rows={3}
              placeholder="e.g. Customer cancelled order / vehicle unavailable"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setCancelJobId(null);
                  setCancelReason('');
                }}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50"
              >
                Keep Job
              </button>
              <button
                type="button"
                disabled={cancelLoading || !cancelReason.trim()}
                onClick={handleCancelSubmit}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {cancelLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {cancelLoading ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
