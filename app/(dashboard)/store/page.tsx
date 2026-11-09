'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, Package, Loader2, AlertCircle, ShoppingBag } from 'lucide-react';
import { getFileUrl } from '@/lib/axios';
import { getCategories, getProducts, addToCart, Product, ProductCategory } from '@/services/shop.service';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { WhatsAppInquiryButton, WhatsAppFloatingWidget } from '@/components/ui/WhatsAppButton';

export default function StorePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(typeof window !== 'undefined' && !!localStorage.getItem('accessToken'));
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        getProducts({ categoryId: selectedCategory || undefined, search: search || undefined }),
        getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch { setError(t.noProductsDesc); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [selectedCategory]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchData(); };

  const handleAddToCart = async (product: Product) => {
    if (product.stockQty === 0) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      router.push(`/register/buyer?redirect=${encodeURIComponent('/store')}`);
      return;
    }
    setAddingId(product.id);
    try {
      await addToCart(product.id, 1);
      setCartCount((c) => c + 1);
      setAddedId(product.id);
      setTimeout(() => setAddedId(null), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to add to cart.');
      setTimeout(() => setError(''), 3000);
    } finally { setAddingId(null); }
  };

  const primaryImage = (product: Product) =>
    product.images?.find((i) => i.isPrimary) || product.images?.[0];

  const getCategoryFallbackImage = (product: Product): string => {
    const cat = (product.category?.slug || product.category?.name || product.name || '').toLowerCase();
    if (cat.includes('oil') || cat.includes('fluid') || cat.includes('lubric') || cat.includes('ዘይቲ')) {
      return 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=600&auto=format&fit=crop&q=80';
    }
    if (cat.includes('tire') || cat.includes('wheel') || cat.includes('tube') || cat.includes('ጎማ')) {
      return 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=600&auto=format&fit=crop&q=80';
    }
    if (cat.includes('battery') || cat.includes('elect') || cat.includes('ባትሪ')) {
      return 'https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?w=600&auto=format&fit=crop&q=80';
    }
    if (cat.includes('brake') || cat.includes('bolt') || cat.includes('hardware')) {
      return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80';
    }
    return 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">{t.storeTitle}</h1>
          <p className="text-sm text-slate-500 mt-1">{t.storeSubtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link href="/store/cart">
            <button className="relative flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 shadow-sm transition-opacity">
              <ShoppingCart className="h-4 w-4" />
              {t.cart}
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </Link>
        </div>
      </div>

      {/* Guest Buyer Registration Banner */}
      {!isLoggedIn && (
        <div className="bg-gradient-to-r from-emerald-600 to-[#1a3f5c] text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
              <ShoppingBag className="h-6 w-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Buying parts, oils, or tires for your truck?</h3>
              <p className="text-xs text-white/80">Register as a Customer / Buyer in 30 seconds for instant online ordering and dispatch.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link href="/register/buyer?redirect=/store" className="flex-1 sm:flex-none">
              <button className="w-full px-4 py-2 bg-white text-emerald-800 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors shadow-sm whitespace-nowrap">
                Register as Buyer
              </button>
            </Link>
            <Link href="/login?redirect=/store" className="flex-1 sm:flex-none">
              <button className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors border border-white/20 whitespace-nowrap">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <button type="submit" className="px-5 py-2.5 bg-[#1a3f5c] hover:bg-[#122e43] text-white rounded-xl text-sm font-semibold transition-colors">
            {t.searchButton}
          </button>
        </form>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${selectedCategory === '' ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
        >
          {t.allCategories}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${selectedCategory === cat.id ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
          >
            {t.translateCategoryName(cat.name)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 text-center py-20 shadow-sm">
          <Package className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <p className="text-slate-700 font-bold text-base">{t.noProductsFound}</p>
          <p className="text-slate-400 text-sm mt-1">{t.noProductsDesc}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const img = primaryImage(product);
            const rawPath = img?.imageUrl || '';
            const isDeadUpload = rawPath.startsWith('uploads/') || rawPath.startsWith('/uploads/');
            const imgUrl = (!rawPath || isDeadUpload) ? getCategoryFallbackImage(product) : getFileUrl(rawPath);
            const isOutOfStock = product.stockQty === 0;
            const isAdded = addedId === product.id;
            return (
              <div key={product.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <Link href={`/store/${product.id}`} className="block">
                  <div className="relative aspect-square bg-slate-100 overflow-hidden">
                    <img
                      src={imgUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getCategoryFallbackImage(product);
                      }}
                    />
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-red-600 text-white text-xs font-extrabold px-4 py-1.5 rounded-full shadow-lg tracking-wider animate-pulse">
                          {t.soldOut}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4 flex flex-col flex-1">
                  {product.category && (
                    <span className="text-[11px] text-[var(--color-primary)] font-bold uppercase tracking-wider mb-1">
                      {t.translateCategoryName(product.category.name)}
                    </span>
                  )}
                  <Link href={`/store/${product.id}`}>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 hover:text-[#33A3DC] transition-colors leading-snug mb-2">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between mb-3 mt-auto pt-2">
                    <p className="text-lg font-extrabold text-slate-900">{t.currency} {product.price.toLocaleString()}</p>
                    {!isOutOfStock && (
                      <span className="text-xs text-slate-400 font-medium">{product.stockQty} {t.leftInStock}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    {/* WhatsApp Inquiry Button */}
                    <WhatsAppInquiryButton
                      productName={product.name}
                      price={product.price}
                      sku={product.sku}
                      variant="compact"
                    />

                    {/* Add to Cart button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={isOutOfStock || addingId === product.id}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isOutOfStock
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[var(--color-primary)] text-white hover:opacity-90 shadow-sm'
                      }`}
                    >
                      {addingId === product.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ShoppingCart className="h-3.5 w-3.5" />
                      )}
                      {isOutOfStock ? t.outOfStock : isAdded ? t.addedToCart : t.addToCart}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating WhatsApp chat widget */}
      <WhatsAppFloatingWidget />
    </div>
  );
}
