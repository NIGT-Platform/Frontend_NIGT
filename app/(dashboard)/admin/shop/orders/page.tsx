'use client';
import { useEffect, useState } from 'react';
import { ShoppingCart, Loader2, AlertCircle, ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { adminGetOrders, adminUpdateOrderStatus, Order, OrderStatus } from '@/services/shop.service';

const STATUS_OPTIONS: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-indigo-100 text-indigo-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [pendingStatus, setPendingStatus] = useState<Record<string, OrderStatus>>({});

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await adminGetOrders({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        search: search || undefined,
      });
      setOrders(data);
    } catch { setError('Failed to load orders.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchOrders(); };

  const handleStatusUpdate = async (orderId: string) => {
    const newStatus = pendingStatus[orderId];
    if (!newStatus) return;
    setUpdatingId(orderId);
    try {
      const updated = await adminUpdateOrderStatus(orderId, newStatus);
      setOrders((o) => o.map((x) => (x.id === updated.id ? updated : x)));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update order.');
    } finally { setUpdatingId(null); }
  };

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-[var(--color-primary)]" /> Shop Orders
          </h1>
          <p className="text-sm text-slate-500 mt-1">Review, process, and update all customer orders</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
            <button onClick={() => setError('')} className="ml-auto"><X className="h-4 w-4" /></button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by order ref or buyer..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700">Search</button>
          </form>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="ALL">All Statuses</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 text-center py-20">
            <ShoppingCart className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <p className="text-slate-500 text-sm">No orders found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const isExpanded = expandedId === order.id;
              const currentPending = pendingStatus[order.id] || order.status;
              return (
                <div key={order.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div
                    className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-semibold text-slate-800">{order.referenceNumber}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {order.buyer?.firstName} {order.buyer?.lastName} · {order.buyer?.email}
                        </p>
                        <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-slate-800">GNF {order.totalAmount.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] || 'bg-slate-100 text-slate-600'}`}>
                        {order.status}
                      </span>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50/50 p-5 space-y-4">
                      {/* Shipping Address */}
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Shipping Address</p>
                        <p className="text-sm text-slate-700">{order.shippingAddress}</p>
                        {order.notes && <p className="text-xs text-slate-500 mt-1 italic">Note: {order.notes}</p>}
                      </div>

                      {/* Items */}
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Order Items</p>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between bg-white rounded-lg border border-slate-100 px-4 py-3">
                              <div>
                                <p className="text-sm font-medium text-slate-800">{item.productName}</p>
                                <p className="text-xs text-slate-500">GNF {item.productPrice.toLocaleString()} × {item.quantity}</p>
                              </div>
                              <p className="text-sm font-bold text-slate-800">
                                GNF {(item.productPrice * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Status Update */}
                      <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                        <label className="text-sm font-medium text-slate-700">Update Status:</label>
                        <select
                          value={currentPending}
                          onChange={(e) => setPendingStatus((p) => ({ ...p, [order.id]: e.target.value as OrderStatus }))}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        >
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button
                          onClick={() => handleStatusUpdate(order.id)}
                          disabled={updatingId === order.id || currentPending === order.status}
                          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-60"
                        >
                          {updatingId === order.id ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}

