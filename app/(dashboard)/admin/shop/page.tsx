'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Tag, ShoppingCart, Package, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { adminGetProducts, adminGetCategories, adminGetOrders, Order } from '@/services/shop.service';
import { useLanguage } from '@/context/LanguageContext';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-indigo-100 text-indigo-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function AdminShopOverview() {
  const { t } = useLanguage();
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [p, c, o] = await Promise.all([
          adminGetProducts(),
          adminGetCategories(),
          adminGetOrders(),
        ]);
        setProductCount(p.length);
        setCategoryCount(c.length);
        setOrders(o);
      } catch {
        setError('Failed to load shop data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const pending = orders.filter((o) => o.status === 'PENDING').length;

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-[var(--color-primary)]" /> {t.adminShopTitle}
          </h1>
          <p className="text-sm text-slate-500 mt-1">{t.adminShopSubtitle}</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: t.totalProductsCount, value: productCount, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: t.category, value: categoryCount, icon: Tag, color: 'text-violet-600', bg: 'bg-violet-50' },
                { label: t.totalOrders, value: orders.length, icon: ShoppingCart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: t.statusPending, value: pending, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className={`${bg} rounded-lg p-2.5 w-fit mb-3`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{value}</p>
                  <p className="text-xs text-slate-500 mt-1">{label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: '/admin/shop/products', label: t.manageProducts, desc: 'Add, edit, delete products & upload photos', icon: Package },
                { href: '/admin/shop/categories', label: t.manageCategories, desc: 'Organize your product catalog', icon: Tag },
                { href: '/admin/shop/orders', label: t.viewAllOrders, desc: 'Process and update order statuses', icon: ShoppingCart },
              ].map(({ href, label, desc, icon: Icon }) => (
                <Link key={href} href={href}>
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-[var(--color-primary)] transition-all cursor-pointer group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-slate-100 group-hover:bg-[var(--color-primary)] rounded-lg p-2.5 transition-colors">
                        <Icon className="h-5 w-5 text-slate-600 group-hover:text-white transition-colors" />
                      </div>
                      <p className="font-semibold text-slate-800 text-sm">{label}</p>
                    </div>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                </Link>
              ))}
            </div>

            {orders.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                  <h2 className="font-semibold text-slate-800">{t.orderHistory}</h2>
                  <Link href="/admin/shop/orders" className="text-xs text-[var(--color-primary)] hover:underline font-medium">
                    {t.viewAllOrders} →
                  </Link>
                </div>
                <div className="divide-y divide-slate-100">
                  {orders.slice(0, 6).map((order) => {
                    const statusInfo = t.translateStatus(order.status);
                    return (
                      <div key={order.id} className="flex items-center justify-between px-5 py-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{order.referenceNumber}</p>
                          <p className="text-xs text-slate-500">
                            {order.buyer?.firstName} {order.buyer?.lastName} · {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-bold text-slate-800">{t.currency} {order.totalAmount.toLocaleString()}</p>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] || 'bg-slate-100 text-slate-600'}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </RoleGuard>
  );
}
