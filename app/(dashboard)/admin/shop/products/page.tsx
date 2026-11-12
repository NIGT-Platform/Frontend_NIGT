'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Plus, Search, Pencil, Trash2, Loader2, AlertCircle, X, Image as ImageIcon, ToggleLeft, ToggleRight } from 'lucide-react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { getFileUrl } from '@/lib/axios';
import {
  adminGetProducts, adminGetCategories, adminDeleteProduct, adminUpdateProduct,
  Product, ProductCategory,
} from '@/services/shop.service';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        adminGetProducts({ search: search || undefined, categoryId: categoryId || undefined }),
        adminGetCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch { setError('Failed to load products.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [categoryId]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchData(); };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete product "${name}"? This cannot be undone.`)) return;
    try {
      await adminDeleteProduct(id);
      setProducts((p) => p.filter((x) => x.id !== id));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete product.');
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const updated = await adminUpdateProduct(product.id, { isActive: !product.isActive });
      setProducts((p) => p.map((x) => (x.id === updated.id ? updated : x)));
    } catch { setError('Failed to update product status.'); }
  };

  const primaryImage = (product: Product) =>
    product.images?.find((i) => i.isPrimary && !i.imageUrl?.includes('images.unsplash.com')) ||
    product.images?.find((i) => i.isPrimary) ||
    product.images?.[0];

  const getCategoryFallbackImage = (product: Product): string => {
    const cat = (product.category?.slug || product.category?.name || product.name || '').toLowerCase();
    if (cat.includes('oil') || cat.includes('fluid') || cat.includes('lubric')) {
      return 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=600&auto=format&fit=crop&q=80';
    }
    if (cat.includes('tire') || cat.includes('wheel') || cat.includes('tube')) {
      return 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=600&auto=format&fit=crop&q=80';
    }
    if (cat.includes('battery') || cat.includes('elect')) {
      return 'https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?w=600&auto=format&fit=crop&q=80';
    }
    if (cat.includes('brake') || cat.includes('bolt') || cat.includes('hardware')) {
      return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80';
    }
    return 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80';
  };

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Package className="h-6 w-6 text-[var(--color-primary)]" /> Products
            </h1>
            <p className="text-sm text-slate-500 mt-1">Manage your automotive parts catalog</p>
          </div>
          <Link href="/admin/shop/products/create">
            <button className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 shadow-sm">
              <Plus className="h-4 w-4" /> Add Product
            </button>
          </Link>
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
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700">
              Search
            </button>
          </form>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 text-center py-20">
            <Package className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <p className="text-slate-600 font-semibold">No products found</p>
            <p className="text-slate-400 text-sm mt-1">Try a different search or add a new product.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => {
              const img = primaryImage(product);
              const rawPath = img?.imageUrl || '';
              const imgUrl = rawPath ? getFileUrl(rawPath) : getCategoryFallbackImage(product);
              const isOutOfStock = product.stockQty === 0;
              return (
                <div key={product.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  {/* Image */}
                  <div className="relative aspect-square bg-slate-100">
                    <img
                      src={imgUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getCategoryFallbackImage(product);
                      }}
                    />
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">SOLD OUT</span>
                      </div>
                    )}
                    {!product.isActive && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-slate-700/80 text-white text-xs font-medium px-2 py-0.5 rounded">Inactive</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className="bg-white/90 text-slate-600 text-xs px-2 py-0.5 rounded border border-slate-200 shadow-sm">
                        {product.images?.length || 0} photo{product.images?.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2">{product.name}</p>
                    </div>
                    {product.category && (
                      <span className="text-xs text-[var(--color-primary)] font-medium mb-2">{product.category.name}</span>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-lg font-bold text-slate-900">GNF {product.price.toLocaleString()}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isOutOfStock ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {isOutOfStock ? 'Out of Stock' : `${product.stockQty} in stock`}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-auto pt-3 border-t border-slate-100">
                      <button
                        onClick={() => handleToggleActive(product)}
                        title={product.isActive ? 'Deactivate' : 'Activate'}
                        className="p-2 text-slate-400 hover:text-[var(--color-primary)] hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        {product.isActive ? <ToggleRight className="h-4 w-4 text-emerald-500" /> : <ToggleLeft className="h-4 w-4" />}
                      </button>
                      <Link href={`/admin/shop/products/${product.id}/edit`} className="flex-1">
                        <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors">
                          <Pencil className="h-3.5 w-3.5" /> Edit & Photos
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
