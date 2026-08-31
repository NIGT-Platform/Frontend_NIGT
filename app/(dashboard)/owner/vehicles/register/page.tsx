'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Truck, Upload, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { vehicleService, RegisterVehicleData, DocumentType } from '@/services/vehicle.service';

const VEHICLE_TYPES = ['TRUCK', 'VAN', 'TRAILER', 'OTHER'] as const;
const CAPACITY_UNITS = ['TON', 'KG'] as const;
const DOCUMENT_TYPES: { value: DocumentType; label: string; required: boolean }[] = [
  { value: 'VEHICLE_REGISTRATION', label: 'Vehicle Registration', required: true },
  { value: 'INSURANCE', label: 'Insurance Document', required: true },
  { value: 'INSPECTION', label: 'Inspection Certificate', required: false },
];

export default function RegisterVehiclePage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [vehicleId, setVehicleId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState<Record<string, 'idle' | 'uploading' | 'done'>>({
    VEHICLE_REGISTRATION: 'idle',
    INSURANCE: 'idle',
    INSPECTION: 'idle',
  });

  const [form, setForm] = useState<RegisterVehicleData>({
    plateNumber: '',
    vehicleType: 'TRUCK',
    brand: '',
    model: '',
    manufacturingYear: new Date().getFullYear(),
    capacity: 0,
    capacityUnit: 'TON',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'manufacturingYear' || name === 'capacity' ? Number(value) : value,
    }));
  };

  const handleSubmitVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await vehicleService.registerVehicle(form);
      setVehicleId(res.vehicle.id);
      setStep(2);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to register vehicle. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocument = async (docType: DocumentType, file: File) => {
    setUploadProgress(prev => ({ ...prev, [docType]: 'uploading' }));
    const formData = new FormData();
    formData.append('documentType', docType);
    formData.append('document', file);
    try {
      await vehicleService.uploadDocument(vehicleId, formData);
      setUploadProgress(prev => ({ ...prev, [docType]: 'done' }));
    } catch (err: any) {
      setUploadProgress(prev => ({ ...prev, [docType]: 'idle' }));
      setError(err?.response?.data?.message || `Failed to upload ${docType} document.`);
    }
  };

  const allRequiredUploaded = DOCUMENT_TYPES.filter(d => d.required).every(
    d => uploadProgress[d.value] === 'done'
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/owner/vehicles" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to My Vehicles
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Register a Vehicle</h1>
        <p className="text-sm text-slate-500 mt-1">Fill in the details below to register your vehicle for approval.</p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-3 mb-8">
        {[{ n: 1, label: 'Vehicle Info' }, { n: 2, label: 'Upload Documents' }].map(({ n, label }) => (
          <div key={n} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            step === n ? 'bg-[var(--color-primary)] text-white' : step > n ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
          }`}>
            {step > n ? <CheckCircle className="h-4 w-4" /> : <span>{n}</span>}
            {label}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm mb-6">{error}</div>
      )}

      {/* Step 1: Vehicle Info */}
      {step === 1 && (
        <form onSubmit={handleSubmitVehicle} className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Plate Number *</label>
              <input
                name="plateNumber"
                value={form.plateNumber}
                onChange={handleChange}
                placeholder="e.g. ABC-1234"
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Type *</label>
              <select name="vehicleType" value={form.vehicleType} onChange={handleChange} required
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                {VEHICLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Manufacturing Year *</label>
              <input
                name="manufacturingYear"
                type="number"
                value={form.manufacturingYear}
                onChange={handleChange}
                min={1950}
                max={new Date().getFullYear() + 1}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Brand *</label>
              <input name="brand" value={form.brand} onChange={handleChange} placeholder="e.g. Volvo" required
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Model *</label>
              <input name="model" value={form.model} onChange={handleChange} placeholder="e.g. FH16" required
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Capacity *</label>
              <input name="capacity" type="number" value={form.capacity || ''} onChange={handleChange} placeholder="e.g. 20" min={0.1} step="0.1" required
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Capacity Unit *</label>
              <select name="capacityUnit" value={form.capacityUnit} onChange={handleChange} required
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                {CAPACITY_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Truck className="h-4 w-4" />}
            {loading ? 'Registering...' : 'Register & Continue to Documents'}
          </button>
        </form>
      )}

      {/* Step 2: Document Upload */}
      {step === 2 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <p className="text-sm text-slate-600 mb-2">
            Upload the required documents for your vehicle. Your vehicle will be reviewed by an Admin after submission.
          </p>

          {DOCUMENT_TYPES.map(({ value, label, required }) => {
            const status = uploadProgress[value];
            return (
              <div key={value} className={`border rounded-xl p-4 transition-colors ${
                status === 'done' ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{label}</p>
                    <p className="text-xs text-slate-500">{required ? 'Required' : 'Optional'} · JPEG, PNG or PDF · Max 5MB</p>
                  </div>
                  {status === 'done' && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                </div>

                {status !== 'done' && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadDocument(value, file);
                      }}
                    />
                    <span className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg border transition-colors ${
                      status === 'uploading'
                        ? 'border-blue-200 bg-blue-50 text-blue-600 cursor-wait'
                        : 'border-slate-300 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}>
                      {status === 'uploading' ? (
                        <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading...</>
                      ) : (
                        <><Upload className="h-3.5 w-3.5" /> Choose File</>
                      )}
                    </span>
                  </label>
                )}
              </div>
            );
          })}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => router.push('/owner/vehicles')}
              disabled={!allRequiredUploaded}
              className="flex-1 bg-[var(--color-primary)] text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {allRequiredUploaded ? 'Done — View My Vehicles' : 'Please upload required documents'}
            </button>
          </div>
          {!allRequiredUploaded && (
            <button onClick={() => router.push('/owner/vehicles')} className="w-full text-center text-xs text-slate-400 hover:text-slate-600 py-1 transition-colors">
              Skip for now (you can upload later)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
