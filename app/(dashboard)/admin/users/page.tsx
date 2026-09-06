'use client';
import { useEffect, useState } from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import {
  CheckCircle, XCircle, Loader2, ChevronDown, ChevronUp,
  User, Mail, Phone, Calendar, FileText, ShieldCheck, Clock
} from 'lucide-react';
import { axiosInstance } from '@/lib/axios';

interface DriverProfile {
  licenseNumber: string;
  licenseType: string;
  licenseExpiryDate: string;
  licenseDocumentUrl?: string;
}

interface PendingUser {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  accountStatus: string;
  emailVerified: boolean;
  createdAt: string;
  driverProfile?: DriverProfile;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/admin/users/pending');
      setUsers(res.data.users || []);
    } catch {
      setMessage({ type: 'error', text: 'Failed to load pending users.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setActionLoading(`${id}-${action}`);
    setMessage(null);
    try {
      await axiosInstance.patch(`/admin/users/${id}/${action}`);
      setMessage({ type: 'success', text: `User ${action === 'approve' ? 'approved' : 'rejected'} successfully.` });
      setExpandedId(null);
      fetchUsers();
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.response?.data?.message || `Failed to ${action} user.` });
    } finally {
      setActionLoading(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Pending Approvals</h1>
            <p className="text-slate-500 mt-1">Review user details and approve or reject new registrations.</p>
          </div>
          <span className="bg-amber-100 text-amber-700 text-sm font-semibold px-4 py-2 rounded-full">
            {users.length} Pending
          </span>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center p-20">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
            <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">All caught up!</h3>
            <p className="text-slate-500 mt-1">There are no pending registrations at this time.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Row Summary */}
                <div
                  className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  onClick={() => toggleExpand(user.id)}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="h-11 w-11 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{user.firstName} {user.middleName || ''} {user.lastName}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                      user.role === 'DRIVER'
                        ? 'bg-violet-50 text-violet-700 border-violet-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {user.role.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400 hidden md:block">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                    {expandedId === user.id
                      ? <ChevronUp className="h-5 w-5 text-slate-400" />
                      : <ChevronDown className="h-5 w-5 text-slate-400" />
                    }
                  </div>
                </div>

                {/* Expanded Detail Panel */}
                {expandedId === user.id && (
                  <div className="border-t border-slate-100 bg-slate-50/40 px-6 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Personal Info */}
                      <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Personal Information</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm">
                            <User className="h-4 w-4 text-[var(--color-primary)] flex-shrink-0" />
                            <span className="text-slate-500 w-24">Full Name</span>
                            <span className="font-medium text-slate-800">{user.firstName} {user.middleName || ''} {user.lastName}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <Mail className="h-4 w-4 text-[var(--color-primary)] flex-shrink-0" />
                            <span className="text-slate-500 w-24">Email</span>
                            <span className="font-medium text-slate-800">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <Phone className="h-4 w-4 text-[var(--color-primary)] flex-shrink-0" />
                            <span className="text-slate-500 w-24">Phone</span>
                            <span className="font-medium text-slate-800">{user.phoneNumber}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <Calendar className="h-4 w-4 text-[var(--color-primary)] flex-shrink-0" />
                            <span className="text-slate-500 w-24">Registered</span>
                            <span className="font-medium text-slate-800">{new Date(user.createdAt).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <ShieldCheck className="h-4 w-4 text-[var(--color-primary)] flex-shrink-0" />
                            <span className="text-slate-500 w-24">Email Verified</span>
                            <span className={`font-semibold ${user.emailVerified ? 'text-emerald-600' : 'text-red-500'}`}>
                              {user.emailVerified ? 'Yes ✓' : 'No ✗'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Driver-specific info */}
                      {user.driverProfile && (
                        <div>
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Driver License Information</h3>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                              <FileText className="h-4 w-4 text-violet-500 flex-shrink-0" />
                              <span className="text-slate-500 w-32">License No.</span>
                              <span className="font-medium text-slate-800 font-mono">{user.driverProfile.licenseNumber}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                              <FileText className="h-4 w-4 text-violet-500 flex-shrink-0" />
                              <span className="text-slate-500 w-32">License Type</span>
                              <span className="font-medium text-slate-800">{user.driverProfile.licenseType}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                              <Clock className="h-4 w-4 text-violet-500 flex-shrink-0" />
                              <span className="text-slate-500 w-32">Expiry Date</span>
                              <span className="font-medium text-slate-800">
                                {new Date(user.driverProfile.licenseExpiryDate).toLocaleDateString()}
                              </span>
                            </div>
                            {user.driverProfile.licenseDocumentUrl && (
                              <div className="flex items-center gap-3 text-sm">
                                <FileText className="h-4 w-4 text-violet-500 flex-shrink-0" />
                                <span className="text-slate-500 w-32">License Doc</span>
                                <a
                                  href={`http://localhost:5000${user.driverProfile.licenseDocumentUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[var(--color-primary)] hover:underline font-medium"
                                >
                                  View Document ↗
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Vehicle Owner — no extra info needed */}
                      {user.role === 'VEHICLE_OWNER' && !user.driverProfile && (
                        <div>
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Account Type</h3>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                            This user registered as a <strong>Vehicle Owner</strong>. They will be able to register and manage vehicles after approval.
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                      <button
                        onClick={() => handleAction(user.id, 'approve')}
                        disabled={!!actionLoading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)] text-white rounded-lg font-semibold text-sm transition-all disabled:opacity-60"
                      >
                        {actionLoading === `${user.id}-approve`
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <CheckCircle className="h-4 w-4" />}
                        Approve User
                      </button>
                      <button
                        onClick={() => handleAction(user.id, 'reject')}
                        disabled={!!actionLoading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-sm transition-all disabled:opacity-60"
                      >
                        {actionLoading === `${user.id}-reject`
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <XCircle className="h-4 w-4" />}
                        Reject User
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
