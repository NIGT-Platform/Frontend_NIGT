'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Users, Truck, Key, Clock, CheckCircle, FileEdit, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { axiosInstance } from '@/lib/axios';

interface DashboardStats {
  users: { total: number; pending: number; owners: number; drivers: number };
  vehicles: { total: number; pending: number; approved: number };
  assignments: { active: number };
  requests: { pendingProfiles: number };
}

function StatCard({
  title, value, subtitle, icon: Icon, color, href, alert
}: {
  title: string; value: number; subtitle?: string; icon: React.ElementType;
  color: string; href?: string; alert?: boolean;
}) {
  const card = (
    <div className={`relative bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all duration-200 group overflow-hidden ${alert && value > 0 ? 'border-amber-300' : 'border-slate-200'}`}>
      {/* Background accent */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-200 ${color}`} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-4xl font-bold text-slate-800 mt-2 tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={`h-6 w-6`} style={{ color: 'currentColor' }} />
        </div>
      </div>

      {alert && value > 0 && (
        <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-amber-600">
          <AlertTriangle className="h-3.5 w-3.5" />
          Requires your attention
        </div>
      )}

      {href && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <span className="text-xs font-medium text-[var(--color-primary)] group-hover:underline">
            View details →
          </span>
        </div>
      )}
    </div>
  );

  return href ? <Link href={href}>{card}</Link> : card;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [role, setRole] = useState('');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState('Admin');

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('/admin/stats');
      setStats(res.data.stats);
    } catch (err: any) {
      console.error('Failed to load dashboard stats:', err);
      if (err?.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else {
        setError('Unable to load dashboard statistics. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setRole(userRole || '');
    if (user?.firstName) setUserName(user.firstName);

    if (userRole === 'ADMIN') {
      fetchStats();
    } else {
      // Non-admin users get redirected
      if (userRole === 'DRIVER') router.push('/driver/my-assignment');
      else if (userRole === 'VEHICLE_OWNER') router.push('/owner/vehicles');
      else router.push('/login');
    }
  }, [router]);

  if (loading && !stats) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <Loader2 className="animate-spin h-8 w-8 text-[var(--color-primary)]" />
      <p className="text-sm text-slate-500">Loading dashboard...</p>
    </div>
  );

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{greeting}, {userName} 👋</h1>
          <p className="text-slate-500 text-sm mt-1">
            Here's what's happening in the NIGT platform today.
          </p>
        </div>
        <div className="text-right text-xs text-slate-400">
          <p>{now.toLocaleDateString('en-US', { weekday: 'long' })}</p>
          <p className="font-medium text-slate-600">{now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3">
          <p className="text-red-700 font-medium text-sm">{error}</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={fetchStats}
              className="px-4 py-2 bg-[var(--color-primary)] text-white text-xs font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                router.push('/login');
              }}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Log In Again
            </button>
          </div>
        </div>
      )}

      {stats && (
        <>
          {/* Primary Stats */}
          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                title="Total Users"
                value={stats.users.total}
                subtitle={`${stats.users.owners} owners · ${stats.users.drivers} drivers`}
                icon={Users}
                color="bg-[#33A3DC] text-[#33A3DC]"
                href="/admin/users?tab=all"
              />
              <StatCard
                title="Total Vehicles"
                value={stats.vehicles.total}
                subtitle={`${stats.vehicles.approved} approved`}
                icon={Truck}
                color="bg-[#74C24E] text-[#74C24E]"
                href="/admin/vehicles"
              />
              <StatCard
                title="Active Assignments"
                value={stats.assignments.active}
                subtitle="Drivers currently on duty"
                icon={Key}
                color="bg-violet-500 text-violet-500"
              />
              <StatCard
                title="Pending Approvals"
                value={stats.users.pending + stats.vehicles.pending}
                subtitle={`${stats.users.pending} users · ${stats.vehicles.pending} vehicles`}
                icon={Clock}
                color="bg-amber-500 text-amber-500"
                alert
                href="/admin/users?tab=pending"
              />
            </div>
          </div>

          {/* Action Items */}
          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Action Required</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                title="Pending Users"
                value={stats.users.pending}
                subtitle="Awaiting account approval"
                icon={Users}
                color="bg-amber-400 text-amber-400"
                href="/admin/users?tab=pending"
                alert
              />
              <StatCard
                title="Pending Vehicles"
                value={stats.vehicles.pending}
                subtitle="Awaiting vehicle approval"
                icon={Truck}
                color="bg-orange-400 text-orange-400"
                href="/admin/vehicles"
                alert
              />
              <StatCard
                title="Profile Requests"
                value={stats.requests.pendingProfiles}
                subtitle="Awaiting profile change approval"
                icon={FileEdit}
                color="bg-blue-400 text-blue-400"
                href="/admin/profile-requests"
                alert
              />
            </div>
          </div>

          {/* Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[var(--color-primary)]" /> Fleet Summary
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Total Vehicles', value: stats.vehicles.total, color: 'bg-slate-200' },
                  { label: 'Approved', value: stats.vehicles.approved, color: 'bg-[#74C24E]' },
                  { label: 'Pending Review', value: stats.vehicles.pending, color: 'bg-amber-400' },
                  { label: 'Active Drivers', value: stats.assignments.active, color: 'bg-[#33A3DC]' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                      <span className="text-slate-600">{item.label}</span>
                    </div>
                    <span className="font-semibold text-slate-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[var(--color-secondary)]" /> User Breakdown
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Total Users', value: stats.users.total, color: 'bg-slate-200' },
                  { label: 'Vehicle Owners', value: stats.users.owners, color: 'bg-[#74C24E]' },
                  { label: 'Drivers', value: stats.users.drivers, color: 'bg-[#33A3DC]' },
                  { label: 'Pending Approval', value: stats.users.pending, color: 'bg-amber-400' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                      <span className="text-slate-600">{item.label}</span>
                    </div>
                    <span className="font-semibold text-slate-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
