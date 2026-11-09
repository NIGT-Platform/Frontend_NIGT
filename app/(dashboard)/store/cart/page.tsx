'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Trash2, Package, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { getFileUrl } from '@/lib/axios';
import { getCart, updateCartItem, removeCartItem, Cart } from '@/services/shop.service';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export default function CartPage() {
  const { t } = useLanguage();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const fetchCart = async () => {
    setLoading(true);
    try { setCart(await getCart()); }
    catch { setError(t.cartEmptyDesc); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
    } else {
      setIsLoggedIn(true);
      fetchCart();
    }
  }, []);

  const handleQuantityChange = async (itemId: string, newQty: number) => {
    if (newQty < 0) return;
    setUpdating(itemId);
    try {
      await updateCartItem(itemId, newQty);
      await fetchCart();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update quantity.');
      setTimeout(() => setError(''), 3000);
    } finally { setUpdating(null); }
  };

  const handleRemove = async (itemId: string) => {
    setUpdating(itemId);
    try {
      await removeCartItem(itemId);
      setCart((prev) => prev ? { ...prev, items: prev.items.filter((i) => i.id !== itemId) } : null);
    } catch { setError('Failed to remove item.'); }
    finally { setUpdating(null); }
  };

  const total = cart?.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) || 0;
  const itemCount = cart?.items.length || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/store">
            <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-[var(--color-primary)]" /> {t.shoppingCart}
            </h1>
            {cart && (
              <p className="text-sm text-slate-500">
                {itemCount} {itemCount === 1 ? t.itemSingular : t.itemPlural}
              </p>
            )}
          </div>
        </div>
        <LanguageSwitcher />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">{error}</div>
      )}

      {!isLoggedIn ? (
        <div className="bg-white rounded-2xl border border-slate-200 text-center py-16 px-6 shadow-sm max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 shadow-sm border border-emerald-100">
            <ShoppingCart className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Customer Cart</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Please register as a customer or log in to view items in your cart, track pricing, and complete your order.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/register/buyer?redirect=/store/cart">
              <button className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-sm transition-colors">
                Register as Buyer
              </button>
            </Link>
            <Link href="/login?redirect=/store/cart">
              <button className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl text-sm transition-colors">
                Log In
              </button>
            </Link>
          </div>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
        </div>
      ) : !cart || cart.items.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 text-center py-20 shadow-sm">
          <ShoppingCart className="mx-auto h-14 w-14 text-slate-300 mb-4" />
          <p className="text-lg font-semibold text-slate-700">{t.cartEmpty}</p>
          <p className="text-sm text-slate-400 mt-1 mb-6">{t.cartEmptyDesc}</p>
          <Link href="/store">
            <button className="bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90">
              {t.browseStore}
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {cart.items.map((item) => {
              const img = item.product.images?.find((i) => i.isPrimary) || item.product.images?.[0];
              return (
                <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex gap-4">
                  {/* Image */}
                  <div className="w-20 h-20 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden">
                    {img ? (
                      <img src={getFileUrl(img.imageUrl)} alt={item.product.name} className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-8 w-8 text-slate-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/store/${item.product.id}`}>
                      <p className="font-semibold text-slate-800 text-sm line-clamp-2 hover:text-[var(--color-primary)] transition-colors">
                        {item.product.name}
                      </p>
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {t.translateCategoryName(item.product.category?.name || '')}
                    </p>
                    <p className="text-[var(--color-primary)] font-bold text-sm mt-1">
                      {t.currency} {item.product.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity + Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => handleRemove(item.id)}
                      disabled={updating === item.id}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title={t.delete}
                    >
                      {updating === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                    <div>
                      <p className="text-right text-xs text-slate-500 mb-1">
                        {t.currency} {(item.product.price * item.quantity).toLocaleString()}
                      </p>
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={updating === item.id}
                          className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-100 transition-colors text-sm font-bold"
                        >−</button>
                        <span className="px-3 py-1.5 text-sm font-semibold border-x border-slate-200">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={updating === item.id || item.quantity >= item.product.stockQty}
                          className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-100 transition-colors text-sm font-bold disabled:opacity-40"
                        >+</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 sticky top-4">
              <h2 className="font-semibold text-slate-800">{t.orderSummary}</h2>
              <div className="space-y-2">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-slate-600">
                    <span className="truncate max-w-[160px]">{item.product.name} ×{item.quantity}</span>
                    <span className="font-medium text-slate-800">{t.currency} {(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-slate-900">
                <span>{t.total}</span>
                <span>{t.currency} {total.toLocaleString()}</span>
              </div>
              <Link href="/store/checkout">
                <button className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 shadow-sm transition-opacity">
                  {t.checkout} <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link href="/store">
                <button className="w-full text-center text-slate-500 text-sm hover:text-slate-800 transition-colors py-1">
                  {t.continueShopping}
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
