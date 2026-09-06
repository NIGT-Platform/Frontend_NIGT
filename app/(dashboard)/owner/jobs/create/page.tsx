'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Calendar, MapPin, AlertCircle, Loader2 } from 'lucide-react';
import { jobService, JobPriority } from '@/services/job.service';

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    pickupLocation: '',
    destination: '',
    loadDescription: '',
    loadType: 'General Cargo',
    loadWeight: '',
    loadUnit: 'TON' as 'TON' | 'KG',
    itemCount: '',
    customerName: '',
    customerPhone: '',
    plannedPickupDate: '',
    expectedDeliveryDate: '',
    priority: 'MEDIUM' as JobPriority,
    specialInstructions: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.pickupLocation || !formData.destination || !formData.loadDescription) {
      setError('Please fill in all required fields (pickup, destination, load description).');
      return;
    }

    const weightNum = parseFloat(formData.loadWeight);
    if (isNaN(weightNum) || weightNum <= 0) {
      setError('Load weight must be a valid positive number.');
      return;
    }

    setLoading(true);

    try {
      await jobService.createJob({
        pickupLocation: formData.pickupLocation,
        destination: formData.destination,
        loadDescription: formData.loadDescription,
        loadType: formData.loadType,
        loadWeight: weightNum,
        loadUnit: formData.loadUnit,
        itemCount: formData.itemCount ? parseInt(formData.itemCount) : undefined,
        customerName: formData.customerName || undefined,
        customerPhone: formData.customerPhone || undefined,
        plannedPickupDate: formData.plannedPickupDate || undefined,
        expectedDeliveryDate: formData.expectedDeliveryDate || undefined,
        priority: formData.priority,
        specialInstructions: formData.specialInstructions || undefined,
      });

      router.push('/owner/jobs');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create transport job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/owner/jobs"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Transport Jobs
      </Link>

      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-6">
          <div className="bg-blue-50 text-[var(--color-primary)] p-3 rounded-lg">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Create Transport Job</h1>
            <p className="text-sm text-slate-500">Post a new freight request for dispatch and tracking</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Route Info */}
          <div>
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[var(--color-primary)]" /> Route Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Pickup Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modjo Dry Port, Yard 3"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Destination <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Addis Ababa, Kality Terminal"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm"
                />
              </div>
            </div>
          </div>

          {/* Cargo / Load Info */}
          <div className="pt-4 border-t border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Package className="h-4 w-4 text-[var(--color-primary)]" /> Cargo & Load Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Load Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 500 Bags of Wheat / Industrial Steel Rods"
                  value={formData.loadDescription}
                  onChange={(e) => setFormData({ ...formData, loadDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Load Type</label>
                <select
                  value={formData.loadType}
                  onChange={(e) => setFormData({ ...formData, loadType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm bg-white"
                >
                  <option value="General Cargo">General Cargo</option>
                  <option value="Bulk Grain">Bulk Grain</option>
                  <option value="Construction Materials">Construction Materials</option>
                  <option value="Heavy Machinery">Heavy Machinery</option>
                  <option value="Perishables / Food">Perishables / Food</option>
                  <option value="Hazardous / Chemicals">Hazardous / Chemicals</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as JobPriority })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm bg-white"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent (Express)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Weight <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    placeholder="e.g. 24.5"
                    value={formData.loadWeight}
                    onChange={(e) => setFormData({ ...formData, loadWeight: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm"
                  />
                  <select
                    value={formData.loadUnit}
                    onChange={(e) => setFormData({ ...formData, loadUnit: e.target.value as 'TON' | 'KG' })}
                    className="w-24 px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm bg-white"
                  >
                    <option value="TON">TON</option>
                    <option value="KG">KG</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Item / Package Count (optional)</label>
                <input
                  type="number"
                  placeholder="e.g. 50"
                  value={formData.itemCount}
                  onChange={(e) => setFormData({ ...formData, itemCount: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm"
                />
              </div>
            </div>
          </div>

          {/* Schedule & Customer */}
          <div className="pt-4 border-t border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[var(--color-primary)]" /> Schedule & Customer Contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Planned Pickup Date</label>
                <input
                  type="datetime-local"
                  value={formData.plannedPickupDate}
                  onChange={(e) => setFormData({ ...formData, plannedPickupDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Expected Delivery Date</label>
                <input
                  type="datetime-local"
                  value={formData.expectedDeliveryDate}
                  onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Customer / Consignee Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ethiopian Trading Enterprises"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Customer Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. +251 911 234567"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Special Handling Instructions</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Fragile materials; cover with tarpaulin against rain."
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <Link href="/owner/jobs">
              <button
                type="button"
                className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 shadow-sm"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Posting Job...' : 'Create Transport Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
