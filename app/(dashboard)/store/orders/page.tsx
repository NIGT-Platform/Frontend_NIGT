'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Loader2, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { getMyOrders, Order } from '@/services/shop.service';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-indigo-100 text-indigo-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function MyOrdersPage() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-[var(--color-primary)]" /> {t.myOrders}
          </h1>
          <p className="text-sm text-slate-500 mt-1">{t.orderHistoryDesc}</p>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link href="/store">
            <button className="text-sm text-[var(--color-primary)] hover:underline font-medium">
              {t.shopMore}
            </button>
          </Link>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">{error}</div>}

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 text-center py-20 shadow-sm">
          <Package className="mx-auto h-14 w-14 text-slate-300 mb-4" />
          <p className="text-lg font-semibold text-slate-700">{t.noOrdersYet}</p>
          <p className="text-sm text-slate-400 mt-1 mb-6">{t.noOrdersDesc}</p>
          <Link href="/store">
            <button className="bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90">
              {t.browseStore}
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const isExpanded = expandedId === order.id;
            const statusInfo = t.translateStatus(order.status);
            const count = order.items.length;

            return (
              <div key={order.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div
                  className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-slate-800">{order.referenceNumber}</p>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_COLORS[order.status] || 'bg-slate-100 text-slate-600'}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()} · {count} {count === 1 ? t.itemSingular : t.itemPlural}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{statusInfo.desc}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-slate-800">{t.currency} {order.totalAmount.toLocaleString()}</p>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-5 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.orderItems}</p>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between bg-white rounded-lg border border-slate-100 px-4 py-3">
                            <div>
                              <p className="text-sm font-medium text-slate-800">{item.productName}</p>
                              <p className="text-xs text-slate-500">{t.currency} {item.productPrice.toLocaleString()} × {item.quantity}</p>
                            </div>
                            <p className="text-sm font-bold text-slate-800">
                              {t.currency} {(item.productPrice * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{t.deliveryAddress}</p>
                      <p className="text-sm text-slate-700">{order.shippingAddress}</p>
                    </div>
                    {order.notes && (
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{t.orderNotes}</p>
                        <p className="text-sm text-slate-600 italic">{order.notes}</p>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                      <span className="text-sm font-semibold text-slate-700">{t.orderTotal}</span>
                      <span className="text-lg font-bold text-slate-900">{t.currency} {order.totalAmount.toLocaleString()}</span>
                    </div>
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
