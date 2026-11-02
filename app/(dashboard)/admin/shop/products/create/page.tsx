'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, AlertCircle, Save } from 'lucide-react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { adminCreateProduct, adminGetCategories, ProductCategory } from '@/services/shop.service';

export default function CreateProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    categoryId: '',
    name: '',
    description: '',
    price: '',
    stockQty: '',
    sku: '',
    isActive: true,
  });

  useEffect(() => {
    adminGetCategories().then(setCategories).catch(() => setError('Failed to load categories.'));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm((f) => ({ ...f, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId || !form.name || !form.price || !form.stockQty) {
      setError('Please fill in all required fields.'); return;
    }
    setLoading(true); setError('');
    try {
      const product = await adminCreateProduct({
        categoryId: form.categoryId,
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stockQty: Number(form.stockQty),
        sku: form.sku.trim() || undefined,
        isActive: form.isActive,
      });
      router.push(`/admin/shop/products/${product.id}/edit`);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create product.');
    } finally { setLoading(false); }
  };

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/shop/products">
            <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Add New Product</h1>
            <p className="text-sm text-slate-500">Fill in the details, then add photos on the next step</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category <span className="text-red-500">*</span></label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="">Select a category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Product Name <span className="text-red-500">*</span></label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Bridgestone Truck Tire 295/80R22.5"
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description <span className="text-red-500">*</span></label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the product — brand, specs, compatibility, etc."
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price (ETB) <span className="text-red-500">*</span></label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 4500"
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity <span className="text-red-500">*</span></label>
              <input
                name="stockQty"
                type="number"
                min="0"
                value={form.stockQty}
                onChange={handleChange}
                placeholder="e.g. 10"
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">SKU (optional)</label>
            <input
              name="sku"
              value={form.sku}
              onChange={handleChange}
              placeholder="e.g. BRD-295-80-R225"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] font-mono"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-[var(--color-primary)]"
            />
            <label htmlFor="isActive" className="text-sm text-slate-700">Active (visible in store)</label>
          </div>

          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <Link href="/admin/shop/products" className="flex-1">
              <button type="button" className="w-full px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {loading ? 'Creating...' : 'Create & Add Photos'}
            </button>
          </div>
        </form>
      </div>
    </RoleGuard>
  );
}
