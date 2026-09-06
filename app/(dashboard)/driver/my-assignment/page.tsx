'use client';
import { useEffect, useState } from 'react';
import { Truck, CheckCircle, Clock, XCircle, AlertTriangle, Key, User, Phone, Loader2 } from 'lucide-react';
import { assignmentService, VehicleAssignment } from '@/services/assignment.service';

export default function MyAssignmentPage() {
  const [assignment, setAssignment] = useState<VehicleAssignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    assignmentService.getMyAssignment()
      .then(res => setAssignment(res.assignment))
      .catch(() => setError('Failed to load your assignment.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
    </div>
  );

  if (error) return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">{error}</div>
    </div>
  );

  if (!assignment) return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
        <Key className="mx-auto h-12 w-12 text-slate-300 mb-4" />
        <h2 className="text-lg font-semibold text-slate-800">No Active Assignment</h2>
        <p className="text-slate-500 text-sm mt-2">You are currently not assigned to drive any vehicle.</p>
        <p className="text-slate-500 text-sm mt-1">Vehicle owners can assign you using your profile information.</p>
      </div>
    </div>
  );

  const v = assignment.vehicle;
  const owner = v?.owner;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Vehicle Assignment</h1>
        <p className="text-sm text-slate-500 mt-1">You are currently assigned as the driver for this vehicle.</p>
      </div>

      <div className="bg-[var(--color-primary)] rounded-xl p-6 text-white shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-4 rounded-xl">
            <Truck className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{v?.brand} {v?.model}</h2>
            <p className="text-blue-100 font-mono mt-1 text-lg">{v?.plateNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold mb-1">Status</p>
          <span className="flex items-center gap-1.5 text-sm bg-emerald-500 text-white px-3 py-1 rounded-full font-medium shadow-sm">
            <CheckCircle className="h-4 w-4" /> Active Driver
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vehicle Specs */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Vehicle Specifications</h3>
          <div className="space-y-4">
            <div className="flex justify-between pb-3 border-b border-slate-100">
              <span className="text-slate-500 text-sm">Type</span>
              <span className="font-medium text-slate-800">{v?.vehicleType}</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-slate-100">
              <span className="text-slate-500 text-sm">Year</span>
              <span className="font-medium text-slate-800">{v?.manufacturingYear}</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-slate-100">
              <span className="text-slate-500 text-sm">Capacity</span>
              <span className="font-medium text-slate-800">{v?.capacity} {v?.capacityUnit}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-500 text-sm">Assigned Since</span>
              <span className="font-medium text-slate-800">{new Date(assignment.assignedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Owner Info */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Owner Contact</h3>
          {owner ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3 text-sm">
                <div className="bg-slate-100 p-2 rounded-lg">
                  <User className="h-4 w-4 text-[var(--color-primary)]" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-0.5">Name</p>
                  <p className="font-medium text-slate-800">{owner.firstName} {owner.lastName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="bg-slate-100 p-2 rounded-lg">
                  <Phone className="h-4 w-4 text-[var(--color-primary)]" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-0.5">Phone Number</p>
                  <p className="font-medium text-slate-800">{owner.phoneNumber}</p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 italic">
                  Contact the vehicle owner if you need to end this assignment or report an issue.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 text-sm">Owner information is unavailable.</p>
          )}
        </div>
      </div>
    </div>
  );
}
