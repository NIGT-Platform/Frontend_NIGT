'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, MapPin, Loader2, CheckCircle, Package } from 'lucide-react';
import { getFileUrl } from '@/lib/axios';
import { getCart, placeOrder, Cart } from '@/services/shop.service';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export default function CheckoutPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    getCart()
      .then(setCart)
      .catch(() => setError(t.cartEmptyDesc))
      .finally(() => setLoading(false));
  }, [t.cartEmptyDesc]);

  const total = cart?.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) || 0;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.trim()) { setError(t.shippingAddressRequired); return; }
    if (!cart || cart.items.length === 0) { setError(t.cartEmpty); return; }
    setPlacing(true); setError('');
    try {
      const order = await placeOrder(shippingAddress.trim(), notes.trim() || undefined);
      setSuccess(`${t.orderSuccess} (${order.referenceNumber})`);
      setTimeout(() => router.push('/store/orders'), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to place order. Please try again.');
    } finally { setPlacing(false); }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/store/cart">
            <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{t.checkoutTitle}</h1>
            <p className="text-sm text-slate-500">{t.completeOrder}</p>
          </div>
        </div>
        <LanguageSwitcher />
      </div>

      {success && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-5">
          <CheckCircle className="h-6 w-6 flex-shrink-0" />
          <div>
            <p className="font-semibold">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handlePlaceOrder} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[var(--color-primary)]" /> {t.deliveryDetails}
            </h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t.shippingAddress} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                rows={4}
                required
                placeholder={t.shippingAddressPlaceholder}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t.specialInstructions}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder={t.specialInstructionsPlaceholder}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={placing || !shippingAddress.trim() || !!success}
              className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-60 shadow-sm transition-opacity"
            >
              {placing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
              {placing ? t.placingOrder : `${t.placeOrder} · ${t.currency} ${total.toLocaleString()}`}
            </button>
          </form>
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 sticky top-4">
            <h2 className="font-semibold text-slate-800">{t.orderItems}</h2>
            <div className="space-y-3">
              {cart?.items.map((item) => {
                const img = item.product.images?.find((i) => i.isPrimary) || item.product.images?.[0];
                return (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-12 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden">
                      {img ? (
                        <img src={getFileUrl(img.imageUrl)} alt="" className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : <div className="w-full h-full flex items-center justify-center"><Package className="h-5 w-5 text-slate-300" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-800 line-clamp-2">{item.product.name}</p>
                      <p className="text-xs text-slate-500">×{item.quantity} · {t.currency} {item.product.price.toLocaleString()}</p>
                    </div>
                    <p className="text-xs font-bold text-slate-800 whitespace-nowrap">
                      {t.currency} {(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-slate-900">
              <span>{t.total}</span>
              <span>{t.currency} {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
