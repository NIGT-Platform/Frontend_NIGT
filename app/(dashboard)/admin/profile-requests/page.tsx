'use client';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, User, Loader2, ArrowRight } from 'lucide-react';
import { profileService, ProfileChangeRequest } from '@/services/profile.service';

export default function AdminProfileRequestsPage() {
  const [requests, setRequests] = useState<ProfileChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await profileService.getPendingProfileRequests();
      setRequests(data.requests);
    } catch {
      setError('Failed to load profile change requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setActionLoading(`${id}-${action}`);
    setError('');
    try {
      if (action === 'approve') await profileService.approveProfileRequest(id);
      else await profileService.rejectProfileRequest(id);
      setSuccess(`Request ${action === 'approve' ? 'approved' : 'rejected'} successfully.`);
      setTimeout(() => setSuccess(''), 4000);
      await fetchRequests();
    } catch (err: any) {
      setError(err?.response?.data?.message || `Failed to ${action} request.`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Profile Change Requests</h1>
        <p className="text-sm text-slate-500 mt-1">Review and approve or reject user profile update requests</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg p-4 text-sm mb-4">
          <CheckCircle className="h-4 w-4" />
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm mb-4">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <Clock className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <p className="text-slate-500 text-sm">No pending profile change requests.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-white border border-slate-200 rounded-xl p-5">
              {/* User info */}
              <div className="flex items-start gap-4">
                <div className="bg-slate-100 rounded-full p-2.5 shrink-0">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-slate-800">{req.user?.firstName} {req.user?.lastName}</p>
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{req.user?.role}</span>
                    <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      <Clock className="h-3 w-3" /> Pending
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{req.user?.email} · Submitted {new Date(req.createdAt).toLocaleDateString()}</p>

                  {/* Before / After comparison */}
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {/* Current */}
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Current</p>
                      <div className="space-y-1 text-sm">
                        <p className="text-slate-700"><span className="text-slate-400 text-xs">Name: </span>{req.user?.firstName} {req.user?.middleName} {req.user?.lastName}</p>
                        <p className="text-slate-700"><span className="text-slate-400 text-xs">Phone: </span>{req.user?.phoneNumber}</p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="hidden sm:flex items-center justify-center absolute" style={{ left: '50%', transform: 'translateX(-50%)' }}>
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </div>

                    {/* Requested */}
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">Requested</p>
                      <div className="space-y-1 text-sm">
                        <p className="text-slate-700">
                          <span className="text-slate-400 text-xs">Name: </span>
                          <span className={req.firstName !== req.user?.firstName || req.lastName !== req.user?.lastName ? 'font-semibold text-blue-700' : ''}>
                            {req.firstName} {req.middleName} {req.lastName}
                          </span>
                        </p>
                        <p className="text-slate-700">
                          <span className="text-slate-400 text-xs">Phone: </span>
                          <span className={req.phoneNumber !== req.user?.phoneNumber ? 'font-semibold text-blue-700' : ''}>
                            {req.phoneNumber}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleAction(req.id, 'approve')}
                      disabled={!!actionLoading}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 disabled:opacity-60 transition-colors"
                    >
                      {actionLoading === `${req.id}-approve`
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <CheckCircle className="h-4 w-4" />
                      }
                      Approve & Apply
                    </button>
                    <button
                      onClick={() => handleAction(req.id, 'reject')}
                      disabled={!!actionLoading}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-60 transition-colors"
                    >
                      {actionLoading === `${req.id}-reject`
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <XCircle className="h-4 w-4" />
                      }
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
