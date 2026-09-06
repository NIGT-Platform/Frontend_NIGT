'use client';
import { useEffect, useState } from 'react';
import {
  Compass,
  Play,
  CheckCircle,
  Truck,
  MapPin,
  Clock,
  Gauge,
  FileCheck,
  AlertCircle,
  Loader2,
  Package,
} from 'lucide-react';
import { tripService, Trip, TripStatus } from '@/services/trip.service';

const statusBadges: Record<TripStatus, { label: string; color: string }> = {
  SCHEDULED: { label: 'Scheduled', color: 'bg-amber-100 text-amber-800' },
  STARTED: { label: 'Started', color: 'bg-blue-100 text-blue-800' },
  IN_TRANSIT: { label: 'In Transit', color: 'bg-indigo-100 text-indigo-800' },
  ARRIVED: { label: 'Arrived at Destination', color: 'bg-purple-100 text-purple-800' },
  DELIVERED: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-800' },
  COMPLETED: { label: 'Completed', color: 'bg-emerald-200 text-emerald-950' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
};

export default function DriverTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Start Trip Modal
  const [startTripModal, setStartTripModal] = useState<Trip | null>(null);
  const [startingOdo, setStartingOdo] = useState('');
  const [startLoading, setStartLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Confirm Delivery Modal
  const [deliveryModal, setDeliveryModal] = useState<Trip | null>(null);
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [deliveryLoading, setDeliveryLoading] = useState(false);

  // Complete Trip Modal
  const [completeModal, setCompleteModal] = useState<Trip | null>(null);
  const [endingOdo, setEndingOdo] = useState('');
  const [completeLoading, setCompleteLoading] = useState(false);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await tripService.getTrips();
      setTrips(res.trips);
    } catch (err: any) {
      setError('Failed to load your assigned trips.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // Handler: Start Trip
  const handleStartSubmit = async () => {
    if (!startTripModal) return;
    const odoNum = parseFloat(startingOdo);
    if (isNaN(odoNum) || odoNum < 0) {
      setModalError('Please enter a valid starting odometer reading.');
      return;
    }
    setStartLoading(true);
    setModalError('');
    try {
      await tripService.startTrip(startTripModal.id, odoNum);
      setStartTripModal(null);
      setStartingOdo('');
      fetchTrips();
    } catch (err: any) {
      setModalError(err?.response?.data?.message || 'Failed to start trip.');
    } finally {
      setStartLoading(false);
    }
  };

  // Handler: Mark Arrived
  const handleMarkArrived = async (tripId: string) => {
    try {
      await tripService.updateTripStatus(tripId, 'ARRIVED');
      fetchTrips();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update status');
    }
  };

  // Handler: Record Delivery
  const handleDeliverySubmit = async () => {
    if (!deliveryModal || !receiverName.trim()) {
      setModalError('Receiver name is required.');
      return;
    }
    setDeliveryLoading(true);
    setModalError('');
    try {
      const fd = new FormData();
      fd.append('receiverName', receiverName);
      if (receiverPhone) fd.append('receiverPhone', receiverPhone);
      if (deliveryNotes) fd.append('notes', deliveryNotes);
      if (proofFile) fd.append('proof', proofFile);

      await tripService.recordDelivery(deliveryModal.id, fd);
      setDeliveryModal(null);
      setReceiverName('');
      setReceiverPhone('');
      setDeliveryNotes('');
      setProofFile(null);
      fetchTrips();
    } catch (err: any) {
      setModalError(err?.response?.data?.message || 'Failed to confirm delivery.');
    } finally {
      setDeliveryLoading(false);
    }
  };

  // Handler: Complete Trip
  const handleCompleteSubmit = async () => {
    if (!completeModal) return;
    const odoNum = parseFloat(endingOdo);
    if (isNaN(odoNum) || odoNum < 0) {
      setModalError('Please enter a valid ending odometer reading.');
      return;
    }
    if (completeModal.startingOdometer && odoNum < completeModal.startingOdometer) {
      setModalError(
        `Ending odometer (${odoNum} km) cannot be less than starting odometer (${completeModal.startingOdometer} km).`
      );
      return;
    }
    setCompleteLoading(true);
    setModalError('');
    try {
      await tripService.completeTrip(completeModal.id, odoNum);
      setCompleteModal(null);
      setEndingOdo('');
      fetchTrips();
    } catch (err: any) {
      setModalError(err?.response?.data?.message || 'Failed to complete trip.');
    } finally {
      setCompleteLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Assigned Trips</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track active journeys, record odometer readings, and confirm deliveries.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">{error}</div>
      ) : trips.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <Compass className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-base font-semibold text-slate-700">No trips assigned yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            When a vehicle owner or admin schedules a transport job for you, it will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {trips.map((trip) => {
            const statusInfo = statusBadges[trip.status] || { label: trip.status, color: 'bg-slate-100 text-slate-700' };
            return (
              <div
                key={trip.id}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-[var(--color-primary)]/40 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-base text-slate-900">{trip.referenceNumber}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  {trip.vehicle && (
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-lg w-fit">
                      <Truck className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                      <span>
                        {trip.vehicle.plateNumber} ({trip.vehicle.brand} {trip.vehicle.model})
                      </span>
                    </div>
                  )}
                </div>

                {/* Route */}
                <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] uppercase font-bold text-slate-400">Pickup Origin</p>
                      <p className="text-sm font-semibold text-slate-800">{trip.pickupLocation}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] uppercase font-bold text-slate-400">Destination</p>
                      <p className="text-sm font-semibold text-slate-800">{trip.destination}</p>
                    </div>
                  </div>
                </div>

                {/* Job / Cargo details */}
                {trip.job && (
                  <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-600 flex flex-wrap gap-4 mb-4">
                    <span>
                      📦 <strong>Cargo:</strong> {trip.job.loadDescription}
                    </span>
                    <span>
                      ⚖️ <strong>Weight:</strong> {trip.job.loadWeight} {trip.job.loadUnit}
                    </span>
                    {trip.job.customerName && (
                      <span>
                        👤 <strong>Receiver:</strong> {trip.job.customerName}{' '}
                        {trip.job.customerPhone ? `(${trip.job.customerPhone})` : ''}
                      </span>
                    )}
                  </div>
                )}

                {/* Metrics / Odometer Summary if started */}
                {(trip.startingOdometer !== null || trip.endingOdometer !== null) && (
                  <div className="grid grid-cols-3 gap-2 py-3 px-4 bg-blue-50/60 rounded-lg text-xs text-slate-700 mb-4 font-mono">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-sans">Start Odometer</span>
                      <span className="font-bold">{trip.startingOdometer ?? '—'} km</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-sans">End Odometer</span>
                      <span className="font-bold">{trip.endingOdometer ?? '—'} km</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-sans">Total Distance</span>
                      <span className="font-bold text-[var(--color-primary)]">
                        {trip.distanceTravelled ? `${trip.distanceTravelled} km` : 'In Progress'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 justify-end pt-2">
                  {trip.status === 'SCHEDULED' && (
                    <button
                      onClick={() => {
                        setStartTripModal(trip);
                        setStartingOdo('');
                        setModalError('');
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 shadow-sm"
                    >
                      <Play className="h-3.5 w-3.5" /> Start Journey
                    </button>
                  )}

                  {['STARTED', 'IN_TRANSIT'].includes(trip.status) && (
                    <>
                      <button
                        onClick={() => handleMarkArrived(trip.id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700 shadow-sm"
                      >
                        <MapPin className="h-3.5 w-3.5" /> Mark Arrived
                      </button>
                      <button
                        onClick={() => {
                          setDeliveryModal(trip);
                          setReceiverName(trip.job?.customerName || '');
                          setReceiverPhone(trip.job?.customerPhone || '');
                          setDeliveryNotes('');
                          setProofFile(null);
                          setModalError('');
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 shadow-sm"
                      >
                        <FileCheck className="h-3.5 w-3.5" /> Confirm Delivery
                      </button>
                    </>
                  )}

                  {trip.status === 'ARRIVED' && (
                    <button
                      onClick={() => {
                        setDeliveryModal(trip);
                        setReceiverName(trip.job?.customerName || '');
                        setReceiverPhone(trip.job?.customerPhone || '');
                        setDeliveryNotes('');
                        setProofFile(null);
                        setModalError('');
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 shadow-sm"
                    >
                      <FileCheck className="h-3.5 w-3.5" /> Confirm Delivery
                    </button>
                  )}

                  {trip.status === 'DELIVERED' && (
                    <button
                      onClick={() => {
                        setCompleteModal(trip);
                        setEndingOdo('');
                        setModalError('');
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-xs font-semibold hover:opacity-90 shadow-sm"
                    >
                      <CheckCircle className="h-3.5 w-3.5" /> Complete Trip & Log Final KM
                    </button>
                  )}

                  {trip.status === 'COMPLETED' && (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full">
                      <CheckCircle className="h-4 w-4" /> Trip Fully Completed & Verified
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Start Trip Modal */}
      {startTripModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-800">Start Journey</h3>
            <p className="text-xs text-slate-500">
              Trip {startTripModal.referenceNumber}. Enter current odometer reading before departing.
            </p>

            {modalError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">{modalError}</div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Starting Odometer Reading (km) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Gauge className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  required
                  placeholder="e.g. 15420.0"
                  value={startingOdo}
                  onChange={(e) => setStartingOdo(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStartTripModal(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={startLoading || !startingOdo}
                onClick={handleStartSubmit}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50"
              >
                {startLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {startLoading ? 'Starting...' : 'Confirm & Depart'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delivery Modal */}
      {deliveryModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-800">Confirm Cargo Delivery</h3>
            <p className="text-xs text-slate-500">Record recipient signature and delivery handover.</p>

            {modalError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">{modalError}</div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Receiver Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Abebe Bekele"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Receiver Phone</label>
                <input
                  type="text"
                  placeholder="e.g. +251 911 000000"
                  value={receiverPhone}
                  onChange={(e) => setReceiverPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. All 500 bags delivered in good condition"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Proof of Delivery Photo / Document (optional)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeliveryModal(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deliveryLoading || !receiverName.trim()}
                onClick={handleDeliverySubmit}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {deliveryLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {deliveryLoading ? 'Saving...' : 'Confirm Delivery'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Trip Modal */}
      {completeModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-800">Complete Trip</h3>
            <p className="text-xs text-slate-500">
              Enter final odometer reading to calculate total distance travelled for trip {completeModal.referenceNumber}.
            </p>

            {modalError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">{modalError}</div>
            )}

            <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600">
              Starting Odometer: <strong>{completeModal.startingOdometer ?? '0'} km</strong>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Final Ending Odometer (km) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Gauge className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  step="0.1"
                  min={completeModal.startingOdometer || 0}
                  required
                  placeholder="e.g. 15740.0"
                  value={endingOdo}
                  onChange={(e) => setEndingOdo(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCompleteModal(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={completeLoading || !endingOdo}
                onClick={handleCompleteSubmit}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {completeLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {completeLoading ? 'Finalizing...' : 'Complete Trip'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
