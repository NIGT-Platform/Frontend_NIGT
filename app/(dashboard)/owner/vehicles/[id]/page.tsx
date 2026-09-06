'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Truck, FileText, CheckCircle, Clock, XCircle, AlertTriangle, Upload, Loader2, Edit2, Save, X, UserPlus, UserMinus, History, User } from 'lucide-react';
import Link from 'next/link';
import { vehicleService, Vehicle, DocumentType, ApprovalStatus, CapacityUnit } from '@/services/vehicle.service';
import { assignmentService, VehicleAssignment } from '@/services/assignment.service';
import { UserProfile } from '@/services/profile.service';

const statusConfig: Record<ApprovalStatus, { label: string; color: string; icon: React.ElementType }> = {
  PENDING: { label: 'Pending Review', color: 'bg-amber-100 text-amber-700', icon: Clock },
  APPROVED: { label: 'Approved', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
  SUSPENDED: { label: 'Suspended', color: 'bg-slate-100 text-slate-600', icon: AlertTriangle },
};

const DOC_LABELS: Record<DocumentType, string> = {
  VEHICLE_REGISTRATION: 'Vehicle Registration',
  INSURANCE: 'Insurance Document',
  INSPECTION: 'Inspection Certificate',
};

export default function VehicleDetailPage() {
  const { id } = useParams() as { id: string };
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState<DocumentType | null>(null);
  const [editForm, setEditForm] = useState<{ brand: string; model: string; capacity: number; capacityUnit: CapacityUnit }>({
    brand: '',
    model: '',
    capacity: 0,
    capacityUnit: 'TON',
  });

  // Assignment State
  const [assignments, setAssignments] = useState<VehicleAssignment[]>([]);
  const [availableDrivers, setAvailableDrivers] = useState<UserProfile[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [assigning, setAssigning] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vehRes, assignRes, driversRes] = await Promise.all([
        vehicleService.getVehicleById(id),
        assignmentService.getVehicleAssignments(id),
        assignmentService.getAvailableDrivers()
      ]);
      setVehicle(vehRes.vehicle);
      setEditForm({
        brand: vehRes.vehicle.brand,
        model: vehRes.vehicle.model,
        capacity: vehRes.vehicle.capacity,
        capacityUnit: vehRes.vehicle.capacityUnit,
      });
      setAssignments(assignRes.assignments);
      setAvailableDrivers(driversRes.drivers);
    } catch (err) {
      setError('Vehicle not found or access denied.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleSave = async () => {
    if (!vehicle) return;
    setSaving(true);
    try {
      const res = await vehicleService.updateVehicle(id, editForm);
      setVehicle(res.vehicle);
      setEditing(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update vehicle.');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadDocument = async (docType: DocumentType, file: File) => {
    setUploadingDoc(docType);
    const formData = new FormData();
    formData.append('documentType', docType);
    formData.append('document', file);
    try {
      const res = await vehicleService.uploadDocument(id, formData);
      setVehicle(prev => prev ? { ...prev, documents: [...prev.documents, res.document] } : prev);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to upload document.');
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleAssignDriver = async () => {
    if (!selectedDriverId) return;
    setAssigning(true);
    setError('');
    try {
      await assignmentService.assignDriver(id, selectedDriverId);
      await fetchData(); // Refresh data to get new assignments and available drivers
      setSelectedDriverId('');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to assign driver.');
    } finally {
      setAssigning(false);
    }
  };

  const handleUnassignDriver = async (driverId: string) => {
    if (!confirm('Are you sure you want to unassign this driver?')) return;
    setAssigning(true);
    setError('');
    try {
      await assignmentService.unassignDriver(id, driverId);
      await fetchData();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to unassign driver.');
    } finally {
      setAssigning(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
    </div>
  );

  if (error || !vehicle) return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">{error || 'Vehicle not found.'}</div>
      <Link href="/owner/vehicles" className="mt-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="h-4 w-4" /> Back to My Vehicles
      </Link>
    </div>
  );

  const status = statusConfig[vehicle.approvalStatus];
  const StatusIcon = status.icon;
  const activeAssignment = assignments.find(a => a.status === 'ACTIVE');

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link href="/owner/vehicles" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to My Vehicles
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-slate-100 rounded-xl p-3">
              <Truck className="h-7 w-7 text-[var(--color-primary)]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{vehicle.brand} {vehicle.model}</h1>
              <p className="text-sm text-slate-500 font-mono">{vehicle.plateNumber}</p>
            </div>
          </div>
          <span className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full ${status.color}`}>
            <StatusIcon className="h-3.5 w-3.5" />
            {status.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vehicle Info Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800">Vehicle Information</h2>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <Edit2 className="h-3.5 w-3.5" /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="flex items-center gap-1 text-xs text-slate-500 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <X className="h-3.5 w-3.5" /> Cancel
                </button>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-1 text-xs text-white bg-[var(--color-primary)] px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
                  {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Save
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              { label: 'Type', value: vehicle.vehicleType },
              { label: 'Year', value: vehicle.manufacturingYear },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                <p className="font-medium text-slate-800">{value}</p>
              </div>
            ))}

            {/* Editable fields */}
            {editing ? (
              <>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Brand</p>
                  <input value={editForm.brand} onChange={e => setEditForm(p => ({ ...p, brand: e.target.value }))}
                    className="w-full text-sm bg-white border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Model</p>
                  <input value={editForm.model} onChange={e => setEditForm(p => ({ ...p, model: e.target.value }))}
                    className="w-full text-sm bg-white border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Capacity</p>
                  <input type="number" value={editForm.capacity} onChange={e => setEditForm(p => ({ ...p, capacity: Number(e.target.value) }))}
                    className="w-full text-sm bg-white border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Capacity Unit</p>
                  <select value={editForm.capacityUnit} onChange={e => setEditForm(p => ({ ...p, capacityUnit: e.target.value as any }))}
                    className="w-full text-sm bg-white border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]">
                    <option value="TON">TON</option>
                    <option value="KG">KG</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <p className="text-xs text-slate-500 mb-0.5">Brand</p>
                  <p className="font-medium text-slate-800">{vehicle.brand}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <p className="text-xs text-slate-500 mb-0.5">Model</p>
                  <p className="font-medium text-slate-800">{vehicle.model}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 col-span-2">
                  <p className="text-xs text-slate-500 mb-0.5">Capacity</p>
                  <p className="font-medium text-slate-800">{vehicle.capacity} {vehicle.capacityUnit}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Documents Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 h-fit">
          <h2 className="font-semibold text-slate-800 mb-4">Documents</h2>
          <div className="space-y-3">
            {(['VEHICLE_REGISTRATION', 'INSURANCE', 'INSPECTION'] as DocumentType[]).map(docType => {
              const uploaded = vehicle.documents.find(d => d.documentType === docType);
              return (
                <div key={docType} className={`flex items-center justify-between p-3 rounded-lg border ${uploaded ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    <FileText className={`h-5 w-5 ${uploaded ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <div>
                      <p className="text-sm font-medium text-slate-700">{DOC_LABELS[docType]}</p>
                      {uploaded && <p className="text-xs text-slate-400">Uploaded {new Date(uploaded.uploadedAt).toLocaleDateString()}</p>}
                    </div>
                  </div>
                  {uploaded ? (
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <label className="cursor-pointer">
                      <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleUploadDocument(docType, f); }} />
                      <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 border border-slate-300 bg-white rounded-lg hover:bg-slate-100 transition-colors text-slate-600">
                        {uploadingDoc === docType ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                        Upload
                      </span>
                    </label>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Driver Assignment Section */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <User className="h-5 w-5 text-[var(--color-primary)]" /> Driver Assignment
          </h2>
        </div>
        
        <div className="p-6">
          {/* Active Driver */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">Current Active Driver</h3>
            {activeAssignment ? (
              <div className="flex items-center justify-between bg-[var(--color-primary)] text-white p-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30 text-xl font-bold">
                    {activeAssignment.driver?.firstName[0]}{activeAssignment.driver?.lastName[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{activeAssignment.driver?.firstName} {activeAssignment.driver?.lastName}</p>
                    <p className="text-blue-100 text-sm font-mono">{activeAssignment.driver?.phoneNumber}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleUnassignDriver(activeAssignment.driverId)}
                  disabled={assigning}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors font-medium"
                >
                  {assigning ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserMinus className="h-4 w-4" />}
                  Unassign Driver
                </button>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-6 text-center">
                <p className="text-slate-500 mb-4">No driver is currently assigned to this vehicle.</p>
                {vehicle.approvalStatus === 'APPROVED' ? (
                  <div className="flex items-center justify-center gap-3 max-w-sm mx-auto">
                    <select 
                      value={selectedDriverId}
                      onChange={(e) => setSelectedDriverId(e.target.value)}
                      className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                    >
                      <option value="">Select a driver...</option>
                      {availableDrivers.map(d => (
                        <option key={d.id} value={d.id}>{d.firstName} {d.lastName} ({d.phoneNumber})</option>
                      ))}
                    </select>
                    <button 
                      onClick={handleAssignDriver}
                      disabled={!selectedDriverId || assigning}
                      className="flex items-center gap-2 px-4 py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)] text-white text-sm rounded-lg transition-colors font-medium disabled:opacity-50"
                    >
                      {assigning ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                      Assign
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg inline-block">
                    Vehicle must be approved by admin before a driver can be assigned.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Historical Assignments */}
          {assignments.length > (activeAssignment ? 1 : 0) && (
            <div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <History className="h-4 w-4" /> Assignment History
              </h3>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold">
                    <tr>
                      <th className="px-4 py-3">Driver Name</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Assigned Date</th>
                      <th className="px-4 py-3">Ended Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {assignments.filter(a => a.status === 'ENDED').map(a => (
                      <tr key={a.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-medium text-slate-800">{a.driver?.firstName} {a.driver?.lastName}</td>
                        <td className="px-4 py-3 text-slate-500 font-mono">{a.driver?.phoneNumber}</td>
                        <td className="px-4 py-3 text-slate-500">{new Date(a.assignedAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-slate-500">{a.endedAt ? new Date(a.endedAt).toLocaleDateString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
