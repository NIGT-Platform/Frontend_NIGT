'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Package, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { getFileUrl } from '@/lib/axios';
import { getProduct, addToCart, Product } from '@/services/shop.service';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { WhatsAppInquiryButton, WhatsAppFloatingWidget, WhatsAppIcon } from '@/components/ui/WhatsAppButton';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { t } = useLanguage();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [cartError, setCartError] = useState('');

  useEffect(() => {
    getProduct(id)
      .then((p) => {
        setProduct(p);
        const primaryIdx = p.images.findIndex((i) => i.isPrimary);
        if (primaryIdx > 0) setSelectedImageIndex(primaryIdx);
      })
      .catch(() => setError(t.noProductsFound))
      .finally(() => setLoading(false));
  }, [id, t.noProductsFound]);

  const handleAddToCart = async () => {
    if (!product || product.stockQty === 0) return;
    setAdding(true); setCartError('');
    try {
      await addToCart(product.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 3000);
    } catch (err: any) {
      setCartError(err?.response?.data?.message || 'Failed to add to cart.');
    } finally { setAdding(false); }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 mb-2" />
          <p>{error || t.noProductsFound}</p>
          <Link href="/store">
            <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm">{t.backToStore}</button>
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stockQty === 0;
  const maxQty = Math.min(product.stockQty, 10);
  const selectedImage = product.images[selectedImageIndex];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/store">
          <button className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm transition-colors">
            <ArrowLeft className="h-4 w-4" /> {t.backToStore}
          </button>
        </Link>
        <LanguageSwitcher />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-3">
          {/* Main Image */}
          <div className="relative aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            {selectedImage ? (
              <img
                src={getFileUrl(selectedImage.imageUrl)}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-20 w-20 text-slate-300" />
              </div>
            )}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-red-600 text-white text-lg font-extrabold px-6 py-2 rounded-full shadow-xl tracking-wider animate-pulse">
                  {t.soldOut}
                </span>
              </div>
            )}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex((i) => (i - 1 + product.images.length) % product.images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-sm transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 text-slate-700" />
                </button>
                <button
                  onClick={() => setSelectedImageIndex((i) => (i + 1) % product.images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-sm transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-slate-700" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/30' : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img
                    src={getFileUrl(img.imageUrl)}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          {product.category && (
            <span className="text-xs uppercase tracking-wider text-[var(--color-primary)] font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              {t.translateCategoryName(product.category.name)}
            </span>
          )}
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">{product.name}</h1>

          {product.sku && (
            <p className="text-xs text-slate-400 font-mono">{t.skuLabel}: {product.sku}</p>
          )}

          <p className="text-3xl font-extrabold text-slate-900">{t.currency} {product.price.toLocaleString()}</p>

          <div>
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 text-sm font-bold px-3.5 py-1.5 rounded-full">
                {t.outOfStock}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-sm font-semibold px-3.5 py-1.5 rounded-full">
                {t.inStock} · {product.stockQty} {t.leftInStock}
              </span>
            )}
          </div>

          <div className="prose prose-sm text-slate-600 max-w-none pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t.productDescription}</h4>
            <p className="whitespace-pre-line leading-relaxed">{product.description}</p>
          </div>

          {!isOutOfStock && (
            <div className="flex items-center gap-3 pt-2">
              <label className="text-sm font-medium text-slate-700">{t.quantity}:</label>
              <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 transition-colors font-bold"
                >−</button>
                <span className="px-4 py-2 text-sm font-semibold text-slate-800 border-x border-slate-300">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 transition-colors font-bold"
                >+</button>
              </div>
              <span className="text-xs text-slate-400">{t.maxStockLimit} {maxQty}</span>
            </div>
          )}

          {cartError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">{cartError}</div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            {/* WhatsApp Buy & Inquire button */}
            <WhatsAppInquiryButton
              productName={product.name}
              price={product.price}
              sku={product.sku}
              className="w-full"
            />

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || adding}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                  isOutOfStock ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : added ? 'bg-emerald-600 text-white'
                  : 'bg-[var(--color-primary)] text-white hover:opacity-90 shadow-sm'
                }`}
              >
                {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
                {isOutOfStock ? t.outOfStock : added ? t.addedToCart : t.addToCart}
              </button>
              <Link href="/store/cart">
                <button className="px-5 py-3 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                  {t.viewCart}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <WhatsAppFloatingWidget />
    </div>
  );
}
