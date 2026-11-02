'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { RoleGuard } from '@/components/auth/RoleGuard';
import {
  CheckCircle, XCircle, Loader2, ChevronDown, ChevronUp,
  User, Mail, Phone, Calendar, FileText, ShieldCheck, Clock,
  Search, Filter, AlertTriangle, UserCheck, ShieldAlert
} from 'lucide-react';
import { axiosInstance, getFileUrl } from '@/lib/axios';

interface DriverProfile {
  licenseNumber: string;
  licenseType: string;
  licenseExpiryDate: string;
  licenseDocumentUrl?: string;
}

interface AppUser {
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

function AdminUsersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'all' ? 'all' : 'pending';

  const [activeTab, setActiveTab] = useState<'pending' | 'all'>(initialTab);
  const [pendingUsers, setPendingUsers] = useState<AppUser[]>([]);
  const [allUsers, setAllUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filters for "All Users" tab
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Sub-filter for "Pending" tab
  const [pendingEmailFilter, setPendingEmailFilter] = useState<'ALL' | 'VERIFIED' | 'UNVERIFIED'>('ALL');

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl === 'all' || tabFromUrl === 'pending') {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pendingRes, allRes] = await Promise.all([
        axiosInstance.get('/admin/users/pending'),
        axiosInstance.get('/admin/users'),
      ]);
      setPendingUsers(pendingRes.data.users || []);
      setAllUsers(allRes.data.users || []);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load users. Please refresh the page.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject' | 'suspend') => {
    setActionLoading(`${id}-${action}`);
    setMessage(null);
    try {
      await axiosInstance.patch(`/admin/users/${id}/${action}`);
      const actionText = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'suspended';
      setMessage({ type: 'success', text: `User ${actionText} successfully.` });
      setExpandedId(null);
      await loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.response?.data?.message || `Failed to ${action} user.` });
    } finally {
      setActionLoading(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  // Filtered Pending list
  const filteredPendingUsers = pendingUsers.filter(u => {
    if (pendingEmailFilter === 'VERIFIED') return u.emailVerified;
    if (pendingEmailFilter === 'UNVERIFIED') return !u.emailVerified;
    return true;
  });

  // Filtered All Users list
  const filteredAllUsers = allUsers.filter(u => {
    const query = searchQuery.toLowerCase();
    const fullName = `${u.firstName} ${u.middleName || ''} ${u.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(query) || u.email.toLowerCase().includes(query) || u.phoneNumber.includes(query);
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.accountStatus === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <div className="space-y-6">
        {/* Page Title & Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
            <p className="text-slate-500 mt-1">Review pending registrations and manage user accounts.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full">
              {pendingUsers.length} Pending
            </span>
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              {allUsers.length} Total Users
            </span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => {
              setActiveTab('pending');
              router.replace('/admin/users?tab=pending');
            }}
            className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm border-b-2 transition-all ${
              activeTab === 'pending'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-sky-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Clock className="h-4 w-4" />
            Pending Approvals ({pendingUsers.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('all');
              router.replace('/admin/users?tab=all');
            }}
            className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm border-b-2 transition-all ${
              activeTab === 'all'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-sky-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            All Users ({allUsers.length})
          </button>
        </div>

        {/* Status Notification */}
        {message && (
          <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle className="h-4 w-4 flex-shrink-0" /> : <XCircle className="h-4 w-4 flex-shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
            <p className="text-sm text-slate-500">Loading users...</p>
          </div>
        ) : activeTab === 'pending' ? (
          /* ========================================================================= */
          /* PENDING APPROVALS TAB                                                     */
          /* ========================================================================= */
          <div className="space-y-4">
            {/* Filter Chips for Pending */}
            {pendingUsers.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pb-2">
                <span className="text-xs font-semibold text-slate-400 mr-1">Filter:</span>
                <button
                  onClick={() => setPendingEmailFilter('ALL')}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    pendingEmailFilter === 'ALL'
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  All Pending ({pendingUsers.length})
                </button>
                <button
                  onClick={() => setPendingEmailFilter('VERIFIED')}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    pendingEmailFilter === 'VERIFIED'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Email Verified ({pendingUsers.filter(u => u.emailVerified).length})
                </button>
                <button
                  onClick={() => setPendingEmailFilter('UNVERIFIED')}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    pendingEmailFilter === 'UNVERIFIED'
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Email Unverified ({pendingUsers.filter(u => !u.emailVerified).length})
                </button>
              </div>
            )}

            {filteredPendingUsers.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
                <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">No pending users</h3>
                <p className="text-slate-500 mt-1">There are no pending registrations matching this filter.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPendingUsers.map((user) => (
                  <div key={user.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                    {/* Header Summary Row */}
                    <div
                      className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                      onClick={() => toggleExpand(user.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-11 w-11 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-slate-800">{user.firstName} {user.middleName || ''} {user.lastName}</p>
                            {user.emailVerified ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                ✓ Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                ⏳ Email Pending
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500">{user.email} · {user.phoneNumber}</p>
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
                        <span className="text-xs font-medium text-[var(--color-primary)]">
                          {expandedId === user.id ? 'Hide Details' : 'View Details'}
                        </span>
                        {expandedId === user.id
                          ? <ChevronUp className="h-5 w-5 text-slate-400" />
                          : <ChevronDown className="h-5 w-5 text-slate-400" />
                        }
                      </div>
                    </div>

                    {/* Detailed Expandable Panel */}
                    {expandedId === user.id && (
                      <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-6 space-y-6">
                        {!user.emailVerified && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                            <span>This user has not yet verified their email address. You can still approve them or wait for verification.</span>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Personal Info */}
                          <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">User Profile</h3>
                            <div className="space-y-2.5">
                              <div className="flex items-center gap-3 text-sm">
                                <User className="h-4 w-4 text-[var(--color-primary)] flex-shrink-0" />
                                <span className="text-slate-500 w-28">Full Name</span>
                                <span className="font-semibold text-slate-800">{user.firstName} {user.middleName || ''} {user.lastName}</span>
                              </div>
                              <div className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-[var(--color-primary)] flex-shrink-0" />
                                <span className="text-slate-500 w-28">Email</span>
                                <span className="font-medium text-slate-800">{user.email}</span>
                              </div>
                              <div className="flex items-center gap-3 text-sm">
                                <Phone className="h-4 w-4 text-[var(--color-primary)] flex-shrink-0" />
                                <span className="text-slate-500 w-28">Phone</span>
                                <span className="font-medium text-slate-800">{user.phoneNumber}</span>
                              </div>
                              <div className="flex items-center gap-3 text-sm">
                                <Calendar className="h-4 w-4 text-[var(--color-primary)] flex-shrink-0" />
                                <span className="text-slate-500 w-28">Registered</span>
                                <span className="font-medium text-slate-800">{new Date(user.createdAt).toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-3 text-sm">
                                <ShieldCheck className="h-4 w-4 text-[var(--color-primary)] flex-shrink-0" />
                                <span className="text-slate-500 w-28">Email Status</span>
                                <span className={`font-semibold ${user.emailVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                                  {user.emailVerified ? 'Verified ✓' : 'Unverified ⏳'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Role Specific Details */}
                          <div>
                            {user.driverProfile ? (
                              <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Driver Credentials</h3>
                                <div className="space-y-2.5">
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
                                      <span className="text-slate-500 w-32">Document</span>
                                      <a
                                        href={getFileUrl(user.driverProfile.licenseDocumentUrl)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[var(--color-primary)] font-semibold hover:underline"
                                      >
                                        View Uploaded License ↗
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Account Details</h3>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 leading-relaxed">
                                  Registered as a <strong>Vehicle Owner</strong>. Upon approval, they can register vehicles, submit inspection documents, and manage assigned drivers.
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-slate-200">
                          <button
                            onClick={() => handleAction(user.id, 'approve')}
                            disabled={!!actionLoading}
                            className="flex items-center gap-2 px-6 py-2.5 bg-[#74C24E] hover:bg-[#62a841] text-white rounded-lg font-semibold text-sm transition-all disabled:opacity-60 shadow-sm"
                          >
                            {actionLoading === `${user.id}-approve`
                              ? <Loader2 className="h-4 w-4 animate-spin" />
                              : <CheckCircle className="h-4 w-4" />}
                            Approve Account
                          </button>
                          <button
                            onClick={() => handleAction(user.id, 'reject')}
                            disabled={!!actionLoading}
                            className="flex items-center gap-2 px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-sm transition-all disabled:opacity-60 shadow-sm"
                          >
                            {actionLoading === `${user.id}-reject`
                              ? <Loader2 className="h-4 w-4 animate-spin" />
                              : <XCircle className="h-4 w-4" />}
                            Reject Account
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* ALL USERS TAB                                                             */
          /* ========================================================================= */
          <div className="space-y-4">
            {/* Search and Filters Bar */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div className="flex gap-3">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <option value="ALL">All Roles</option>
                  <option value="VEHICLE_OWNER">Vehicle Owner</option>
                  <option value="DRIVER">Driver</option>
                  <option value="ADMIN">Admin</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="PENDING">Pending</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>

            {filteredAllUsers.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
                <User className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <h3 className="text-lg font-semibold text-slate-800">No users found</h3>
                <p className="text-slate-500 mt-1">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAllUsers.map((user) => (
                  <div key={user.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div
                      className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                      onClick={() => toggleExpand(user.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-11 w-11 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-slate-800">{user.firstName} {user.middleName || ''} {user.lastName}</p>
                            {/* Status Badge */}
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                              user.accountStatus === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : user.accountStatus === 'PENDING'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : user.accountStatus === 'SUSPENDED'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                              {user.accountStatus}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500">{user.email} · {user.phoneNumber}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {user.role.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-400 hidden md:block">
                          Registered: {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs font-medium text-[var(--color-primary)]">
                          {expandedId === user.id ? 'Hide' : 'Details'}
                        </span>
                        {expandedId === user.id
                          ? <ChevronUp className="h-5 w-5 text-slate-400" />
                          : <ChevronDown className="h-5 w-5 text-slate-400" />
                        }
                      </div>
                    </div>

                    {/* Detailed Row for All Users */}
                    {expandedId === user.id && (
                      <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-5 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400 block text-xs">User ID</span>
                            <span className="font-mono text-xs text-slate-700">{user.id}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-xs">Email Verified</span>
                            <span className={`font-semibold ${user.emailVerified ? 'text-emerald-600' : 'text-red-500'}`}>
                              {user.emailVerified ? 'Yes (Verified)' : 'No (Pending)'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-xs">Joined Date</span>
                            <span className="text-slate-700">{new Date(user.createdAt).toLocaleString()}</span>
                          </div>
                        </div>

                        {user.driverProfile && (
                          <div className="p-3 bg-violet-50/50 border border-violet-100 rounded-lg text-xs space-y-1">
                            <span className="font-bold text-violet-800">Driver License Details:</span>
                            <p>Number: <span className="font-mono font-semibold">{user.driverProfile.licenseNumber}</span> | Type: {user.driverProfile.licenseType} | Expiry: {new Date(user.driverProfile.licenseExpiryDate).toLocaleDateString()}</p>
                          </div>
                        )}

                        {/* Actions for All Users */}
                        {user.role !== 'ADMIN' && (
                          <div className="flex gap-2 pt-2 border-t border-slate-200">
                            {user.accountStatus === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleAction(user.id, 'approve')}
                                  disabled={!!actionLoading}
                                  className="px-4 py-1.5 bg-[#74C24E] hover:bg-[#62a841] text-white text-xs font-semibold rounded-md transition-colors"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleAction(user.id, 'reject')}
                                  disabled={!!actionLoading}
                                  className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-md transition-colors"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {user.accountStatus === 'ACTIVE' && (
                              <button
                                onClick={() => handleAction(user.id, 'suspend')}
                                disabled={!!actionLoading}
                                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-md transition-colors"
                              >
                                Suspend Account
                              </button>
                            )}
                            {user.accountStatus === 'SUSPENDED' && (
                              <button
                                onClick={() => handleAction(user.id, 'approve')}
                                disabled={!!actionLoading}
                                className="px-4 py-1.5 bg-[#74C24E] hover:bg-[#62a841] text-white text-xs font-semibold rounded-md transition-colors"
                              >
                                Reactivate Account
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-20">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
      </div>
    }>
      <AdminUsersContent />
    </Suspense>
  );
}
