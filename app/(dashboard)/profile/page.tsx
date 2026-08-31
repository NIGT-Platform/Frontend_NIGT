'use client';
import { useEffect, useRef, useState } from 'react';
import {
  UserCircle, Edit2, X, Save, Camera, Loader2,
  CheckCircle, Clock, XCircle, ShieldCheck, Mail, Phone, Calendar
} from 'lucide-react';
import { profileService, UserProfile, ProfileChangeRequest } from '@/services/profile.service';

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrator',
  VEHICLE_OWNER: 'Vehicle Owner',
  DRIVER: 'Driver',
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: 'Active', color: 'text-emerald-600 bg-emerald-50' },
  PENDING: { label: 'Pending Approval', color: 'text-amber-600 bg-amber-50' },
  REJECTED: { label: 'Rejected', color: 'text-red-600 bg-red-50' },
  SUSPENDED: { label: 'Suspended', color: 'text-slate-600 bg-slate-100' },
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [pendingRequest, setPendingRequest] = useState<ProfileChangeRequest | null>(null);
  const [lastRequest, setLastRequest] = useState<ProfileChangeRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editForm, setEditForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phoneNumber: '',
  });

  const fetchProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setUser(data.user);
      setPendingRequest(data.pendingRequest);
      setLastRequest(data.lastRequest);
      setEditForm({
        firstName: data.user.firstName,
        middleName: data.user.middleName || '',
        lastName: data.user.lastName,
        phoneNumber: data.user.phoneNumber,
      });
    } catch {
      setError('Failed to load profile. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    setError('');
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await profileService.uploadProfileImage(formData);
      setUser(prev => prev ? { ...prev, profileImageUrl: res.profileImageUrl } : prev);
      setSuccess('Profile picture updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to upload image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await profileService.submitEditRequest(editForm);
      setSuccess('Profile change request submitted! Awaiting admin approval.');
      setEditing(false);
      await fetchProfile(); // refresh to show pending request
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit changes.');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () => {
    if (!user) return '?';
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
    </div>
  );

  if (!user) return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">{error}</div>
    </div>
  );

  const statusCfg = STATUS_CONFIG[user.accountStatus] || STATUS_CONFIG.PENDING;

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Success/Error messages */}
      {success && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg p-4 text-sm">
          <CheckCircle className="h-4 w-4 shrink-0" />
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">{error}</div>
      )}

      {/* Pending Request Banner */}
      {pendingRequest && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <Clock className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Profile Change Pending Approval</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Your requested changes are being reviewed by an admin. You cannot submit another request until this one is resolved.
            </p>
            <div className="mt-2 text-xs text-amber-700 space-y-0.5">
              <p>→ Name: <strong>{pendingRequest.firstName} {pendingRequest.middleName} {pendingRequest.lastName}</strong></p>
              <p>→ Phone: <strong>{pendingRequest.phoneNumber}</strong></p>
            </div>
          </div>
        </div>
      )}

      {/* Last Request Rejected Banner */}
      {!pendingRequest && lastRequest?.status === 'REJECTED' && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">Previous Change Request Was Rejected</p>
            <p className="text-xs text-red-600 mt-0.5">You can submit a new request if needed.</p>
          </div>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">

        {/* Avatar Section */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 px-6 pt-8 pb-16 relative">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-[var(--color-primary)] flex items-center justify-center">
                {user.profileImageUrl ? (
                  <img
                    src={`http://localhost:5000${user.profileImageUrl}`}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-white">{getInitials()}</span>
                )}
              </div>
              {/* Camera button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="absolute bottom-0 right-0 bg-white border border-slate-200 rounded-full p-1.5 shadow hover:bg-slate-50 transition-colors disabled:opacity-60"
              >
                {uploadingImage
                  ? <Loader2 className="h-3.5 w-3.5 text-slate-600 animate-spin" />
                  : <Camera className="h-3.5 w-3.5 text-slate-600" />
                }
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }}
              />
            </div>
            <h1 className="mt-3 text-xl font-bold text-white">{user.firstName} {user.lastName}</h1>
            <p className="text-slate-300 text-sm">{ROLE_LABELS[user.role] || user.role}</p>
          </div>
        </div>

        {/* Info Section */}
        <div className="-mt-6 mx-6 mb-6 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">

          {/* Status Badge */}
          <div className="flex justify-between items-center">
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusCfg.color}`}>
              {statusCfg.label}
            </span>
            {!editing && !pendingRequest && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Edit2 className="h-3.5 w-3.5" /> Request Edit
              </button>
            )}
          </div>

          {!editing ? (
            /* View Mode */
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <UserCircle className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="text-slate-500 w-24 shrink-0">Full Name</span>
                <span className="font-medium text-slate-800">{user.firstName} {user.middleName} {user.lastName}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="text-slate-500 w-24 shrink-0">Email</span>
                <span className="font-medium text-slate-800">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="text-slate-500 w-24 shrink-0">Phone</span>
                <span className="font-medium text-slate-800">{user.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <ShieldCheck className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="text-slate-500 w-24 shrink-0">Role</span>
                <span className="font-medium text-slate-800">{ROLE_LABELS[user.role] || user.role}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="text-slate-500 w-24 shrink-0">Member Since</span>
                <span className="font-medium text-slate-800">
                  {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <form onSubmit={handleSubmitEdit} className="space-y-4">
              <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3 border border-slate-100">
                ℹ️ Your changes will be submitted for admin review. They won't take effect until approved.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">First Name *</label>
                  <input value={editForm.firstName} onChange={e => setEditForm(p => ({ ...p, firstName: e.target.value }))} required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Middle Name</label>
                  <input value={editForm.middleName} onChange={e => setEditForm(p => ({ ...p, middleName: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Last Name *</label>
                  <input value={editForm.lastName} onChange={e => setEditForm(p => ({ ...p, lastName: e.target.value }))} required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Phone Number *</label>
                  <input value={editForm.phoneNumber} onChange={e => setEditForm(p => ({ ...p, phoneNumber: e.target.value }))} required
                    placeholder="+251..." className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setEditing(false)}
                  className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors">
                  <X className="h-4 w-4" /> Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[var(--color-primary)] text-white text-sm rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? 'Submitting...' : 'Submit for Approval'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
