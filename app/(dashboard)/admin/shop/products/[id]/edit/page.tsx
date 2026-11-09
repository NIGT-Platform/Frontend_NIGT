'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Loader2, AlertCircle, Save, Upload, Trash2, Star, Image as ImageIcon, Check,
} from 'lucide-react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { getFileUrl } from '@/lib/axios';
import {
  adminGetProducts, adminUpdateProduct, adminGetCategories, adminAddProductImage,
  adminDeleteProductImage, adminSetPrimaryProductImage, Product, ProductCategory,
} from '@/services/shop.service';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    categoryId: '', name: '', description: '', price: '', stockQty: '', sku: '', isActive: true,
  });

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageIsPrimary, setImageIsPrimary] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState('');

  const loadProduct = async () => {
    try {
      const [allProducts, cats] = await Promise.all([adminGetProducts(), adminGetCategories()]);
      const p = allProducts.find((x) => x.id === id);
      if (!p) { setError('Product not found.'); setLoading(false); return; }
      setProduct(p);
      setCategories(cats);
      setForm({
        categoryId: p.categoryId,
        name: p.name,
        description: p.description,
        price: String(p.price),
        stockQty: String(p.stockQty),
        sku: p.sku || '',
        isActive: p.isActive,
      });
    } catch { setError('Failed to load product.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadProduct(); }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') setForm((f) => ({ ...f, [name]: (e.target as HTMLInputElement).checked }));
    else setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      const updated = await adminUpdateProduct(id, {
        categoryId: form.categoryId,
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stockQty: Number(form.stockQty),
        sku: form.sku.trim() || undefined,
        isActive: form.isActive,
      });
      setProduct(updated);
      setSuccess('Product updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update product.');
    } finally { setSaving(false); }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageError('');
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
    setUploading(true); setImageError('');
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('isPrimary', String(imageIsPrimary));
      await adminAddProductImage(id, formData);
      setImageFile(null); setImagePreview(null); setImageIsPrimary(false);
      await loadProduct();
    } catch (err: any) {
      setImageError(err?.response?.data?.message || 'Failed to upload image.');
    } finally { setUploading(false); }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await adminDeleteProductImage(imageId);
      await loadProduct();
    } catch { setError('Failed to delete image.'); }
  };

  const handleSetPrimary = async (imageId: string) => {
    try {
      await adminSetPrimaryProductImage(id, imageId);
      await loadProduct();
      setSuccess('Primary photo updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to set primary image.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/shop/products">
            <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Edit Product</h1>
            <p className="text-sm text-slate-500">{product?.name}</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg p-4 text-sm">
            <Check className="h-4 w-4 flex-shrink-0" /> {success}
          </div>
        )}

        {/* Product Form */}
        <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-slate-800 mb-2">Product Details</h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select name="categoryId" value={form.categoryId} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price (GNF)</label>
              <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity</label>
              <input name="stockQty" type="number" min="0" value={form.stockQty} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">SKU (optional)</label>
            <input name="sku" value={form.sku} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="isActive" name="isActive" checked={form.isActive} onChange={handleChange} className="h-4 w-4 rounded border-slate-300" />
            <label htmlFor="isActive" className="text-sm text-slate-700">Active (visible in store)</label>
          </div>

          <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        {/* Image Management */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2"><ImageIcon className="h-5 w-5 text-slate-500" /> Product Photos</h2>

          {/* Existing Images */}
          {product?.images && product.images.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {product.images.map((img) => (
                <div key={img.id} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square bg-slate-100">
                  <img
                    src={getFileUrl(img.imageUrl)}
                    alt="Product"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  {img.isPrimary && (
                    <div className="absolute top-1 left-1">
                      <span className="bg-[var(--color-primary)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Star className="h-2.5 w-2.5 fill-white" /> Primary
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    {!img.isPrimary && (
                      <button
                        onClick={() => handleSetPrimary(img.id)}
                        title="Set as primary photo"
                        className="p-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-sm"
                      >
                        <Star className="h-3.5 w-3.5 fill-white" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      title="Delete photo"
                      className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-200 rounded-lg py-8 text-center">
              <ImageIcon className="mx-auto h-10 w-10 text-slate-300 mb-2" />
              <p className="text-sm text-slate-500">No photos yet. Upload the first one below.</p>
            </div>
          )}

          {/* Upload new image */}
          <div className="border-t border-slate-100 pt-4 space-y-4">
            <p className="text-sm font-medium text-slate-700">Upload New Photo</p>

            <div className="flex gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg py-4 cursor-pointer hover:border-[var(--color-primary)] transition-colors text-slate-500 hover:text-[var(--color-primary)] text-sm">
                <Upload className="h-4 w-4" />
                {imageFile ? imageFile.name : 'Choose image file'}
                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              </label>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-lg border border-slate-200" />
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPrimary"
                checked={imageIsPrimary}
                onChange={(e) => setImageIsPrimary(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              <label htmlFor="isPrimary" className="text-sm text-slate-700 flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-amber-400" /> Set as primary (main) photo
              </label>
            </div>

            {imageError && <p className="text-red-600 text-xs">{imageError}</p>}

            <button
              onClick={handleImageUpload}
              disabled={!imageFile || uploading}
              className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 disabled:opacity-60"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </button>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}

