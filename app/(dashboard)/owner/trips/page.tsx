'use client';
import { useEffect, useState } from 'react';
import {
  Compass,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  FileCheck,
  User,
  Search,
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

export default function OwnerTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;
      const res = await tripService.getTrips(params);
      setTrips(res.trips);
    } catch (err: any) {
      setError('Failed to load trips for your fleet.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrips();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Fleet Trips & Monitoring</h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor live trips, driver progress, odometer readings, and delivery confirmations for your vehicles.
        </p>
      </div>

      {/* Filter & Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {['ALL', 'SCHEDULED', 'IN_TRANSIT', 'ARRIVED', 'DELIVERED', 'COMPLETED', 'CANCELLED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-72">
          <input
            type="text"
            placeholder="Search trip ref, plate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-slate-800 text-white rounded-lg text-xs font-medium hover:bg-slate-700"
          >
            Search
          </button>
        </form>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">{error}</div>
      ) : trips.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <Compass className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-base font-semibold text-slate-700">No trips found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Trips are automatically created when you assign a vehicle with an active driver to a transport job.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {trips.map((trip) => {
            const statusInfo = statusBadges[trip.status] || { label: trip.status, color: 'bg-slate-100 text-slate-700' };
            return (
              <div
                key={trip.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-[var(--color-primary)]/40 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-slate-900">{trip.referenceNumber}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    {trip.vehicle && (
                      <span className="flex items-center gap-1.5 font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
                        <Truck className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                        {trip.vehicle.plateNumber}
                      </span>
                    )}
                    {trip.driver && (
                      <span className="flex items-center gap-1.5 font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
                        <User className="h-3.5 w-3.5 text-blue-600" />
                        {trip.driver.firstName} {trip.driver.lastName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Route */}
                <div className="flex items-center gap-3 text-sm font-medium text-slate-800">
                  <MapPin className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>{trip.pickupLocation}</span>
                  <span className="text-slate-400 font-mono">⟶</span>
                  <MapPin className="h-4 w-4 text-red-600 flex-shrink-0" />
                  <span>{trip.destination}</span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg text-xs font-mono text-slate-700">
                  <div>
                    <span className="block text-[10px] text-slate-400 font-sans uppercase">Start KM</span>
                    <span className="font-bold">{trip.startingOdometer ?? 'Not started'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-sans uppercase">End KM</span>
                    <span className="font-bold">{trip.endingOdometer ?? 'In progress'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-sans uppercase">Total Distance</span>
                    <span className="font-bold text-[var(--color-primary)]">
                      {trip.distanceTravelled ? `${trip.distanceTravelled} km` : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-sans uppercase">Delivery Status</span>
                    <span className="font-bold text-emerald-700">
                      {trip.delivery ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Delivery details if delivered */}
                {trip.delivery && (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-xs text-emerald-900 flex flex-col sm:flex-row justify-between gap-2">
                    <div>
                      <span className="font-semibold">Recipient:</span> {trip.delivery.receiverName}{' '}
                      {trip.delivery.receiverPhone ? `(${trip.delivery.receiverPhone})` : ''}
                      {trip.delivery.notes && (
                        <p className="text-emerald-700 mt-1 italic">"{trip.delivery.notes}"</p>
                      )}
                    </div>
                    {trip.delivery.proofDocumentUrl && (
                      <a
                        href={trip.delivery.proofDocumentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-800 underline font-medium self-start sm:self-center hover:text-emerald-950 flex items-center gap-1"
                      >
                        <FileCheck className="h-3.5 w-3.5" /> View Proof Document
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
