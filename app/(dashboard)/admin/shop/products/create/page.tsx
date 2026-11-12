'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, AlertCircle, Save, Plus, Check, Upload, Image as ImageIcon } from 'lucide-react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { adminCreateProduct, adminDeleteProduct, adminGetCategories, adminCreateCategory, adminAddProductImage, ProductCategory } from '@/services/shop.service';

export default function CreateProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Inline category creation state
  const [showNewCat, setShowNewCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [catCreating, setCatCreating] = useState(false);
  const [catError, setCatError] = useState('');

  // Photo upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
    adminGetCategories()
      .then((cats) => {
        setCategories(cats);
        if (cats.length === 0) {
          setShowNewCat(true);
        }
      })
      .catch(() => setError('Failed to load categories.'));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm((f) => ({ ...f, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return;
    setCatCreating(true);
    setCatError('');
    try {
      const slug = newCatName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const created = await adminCreateCategory(newCatName.trim(), slug);
      setCategories((prev) => [...prev, created]);
      setForm((f) => ({ ...f, categoryId: created.id }));
      setNewCatName('');
      setShowNewCat(false);
    } catch (err: any) {
      setCatError(err?.response?.data?.message || 'Failed to create category.');
    } finally {
      setCatCreating(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId || !form.name || !form.price || !form.stockQty) {
      setError('Please fill in all required fields including selecting a category.');
      return;
    }
    setLoading(true);
    setError('');
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

      // If a photo was selected, upload it immediately as the primary photo
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('isPrimary', 'true');
        try {
          await adminAddProductImage(product.id, formData);
        } catch (imgErr: any) {
          // Roll back product creation so no duplicate product without its photo is left behind
          await adminDeleteProduct(product.id).catch(() => {});
          throw imgErr;
        }
      }

      router.push('/admin/shop/products');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create product.');
    } finally {
      setLoading(false);
    }
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
            <p className="text-sm text-slate-500">Fill in the product details and select a photo</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          {/* Category Selector & Quick Creator */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-slate-700">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewCat(!showNewCat)}
                  className="text-xs text-[var(--color-primary)] hover:underline font-medium flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> {showNewCat ? 'Hide' : '+ New Category'}
                </button>
                <span className="text-slate-300">|</span>
                <Link
                  href="/admin/shop/categories"
                  className="text-xs text-slate-500 hover:text-slate-700 hover:underline"
                  target="_blank"
                >
                  Manage Categories
                </Link>
              </div>
            </div>

            {/* Quick Category Add Input */}
            {showNewCat && (
              <div className="mb-3 p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <p className="text-xs font-semibold text-slate-700">Create New Category:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateCategory();
                      }
                    }}
                    placeholder="e.g. Tires & Wheels, Batteries, Brakes..."
                    className="flex-1 px-3 py-1.5 rounded-md border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
                  />
                  <button
                    type="button"
                    disabled={catCreating || !newCatName.trim()}
                    onClick={handleCreateCategory}
                    className="px-3 py-1.5 bg-[var(--color-primary)] text-white text-xs font-medium rounded-md hover:opacity-90 disabled:opacity-50 flex items-center gap-1"
                  >
                    {catCreating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                    Create
                  </button>
                </div>
                {catError && <p className="text-xs text-red-600">{catError}</p>}
              </div>
            )}

            {categories.length === 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 space-y-1.5">
                <p className="font-semibold">⚠️ No categories found in database.</p>
                <p>Type a category name above and click <strong>Create</strong> to add your first category.</p>
              </div>
            ) : (
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
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
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Price (GNF) <span className="text-red-500">*</span>
              </label>
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
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
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

          {/* Product Photo */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Product Photo (optional)
            </label>
            <div className="flex items-center gap-4">
              <label className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg py-4 cursor-pointer hover:border-[var(--color-primary)] transition-colors text-slate-500 hover:text-[var(--color-primary)] text-sm">
                <Upload className="h-4 w-4" />
                {imageFile ? imageFile.name : 'Click to select product image'}
                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              </label>
              {imagePreview && (
                <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
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
            <label htmlFor="isActive" className="text-sm text-slate-700">
              Active (visible in store)
            </label>
          </div>

          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <Link href="/admin/shop/products" className="flex-1">
              <button
                type="button"
                className="w-full px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
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
