'use client';
import { useEffect, useState } from 'react';
import { Tag, Plus, Pencil, Trash2, Loader2, Check, X, AlertCircle } from 'lucide-react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import {
  adminGetCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory, ProductCategory,
} from '@/services/shop.service';

function toSlug(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addName, setAddName] = useState('');
  const [addSlug, setAddSlug] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setCategories(await adminGetCategories());
    } catch { setError('Failed to load categories.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) return;
    setAddLoading(true); setAddError('');
    try {
      await adminCreateCategory(addName.trim(), addSlug || toSlug(addName));
      setAddName(''); setAddSlug('');
      await fetchCategories();
    } catch (err: any) {
      setAddError(err?.response?.data?.message || 'Failed to create category.');
    } finally { setAddLoading(false); }
  };

  const handleEdit = async (id: string) => {
    if (!editName.trim()) return;
    setEditLoading(true);
    try {
      await adminUpdateCategory(id, editName.trim(), editSlug || toSlug(editName));
      setEditId(null);
      await fetchCategories();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update category.');
    } finally { setEditLoading(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete category "${name}"? This cannot be undone.`)) return;
    try {
      await adminDeleteCategory(id);
      await fetchCategories();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete category.');
    }
  };

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Tag className="h-6 w-6 text-[var(--color-primary)]" /> Product Categories
          </h1>
          <p className="text-sm text-slate-500 mt-1">Organize your product catalog into categories</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
            <button onClick={() => setError('')} className="ml-auto"><X className="h-4 w-4" /></button>
          </div>
        )}

        {/* Add Category Form */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Plus className="h-4 w-4" /> Add New Category</h2>
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                value={addName}
                onChange={(e) => { setAddName(e.target.value); setAddSlug(toSlug(e.target.value)); }}
                placeholder="Category name (e.g. Engine Oil)"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>
            <div className="flex-1">
              <input
                value={addSlug}
                onChange={(e) => setAddSlug(e.target.value)}
                placeholder="Slug (auto-generated)"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={addLoading || !addName.trim()}
              className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
            >
              {addLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add Category
            </button>
          </form>
          {addError && <p className="text-red-600 text-xs mt-2">{addError}</p>}
        </div>

        {/* Categories List */}
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--color-primary)]" />
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 text-center py-16">
            <Tag className="mx-auto h-10 w-10 text-slate-300 mb-3" />
            <p className="text-slate-500 text-sm">No categories yet. Add your first category above.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
            {categories.map((cat) => (
              <div key={cat.id} className="p-4">
                {editId === cat.id ? (
                  <div className="flex gap-2">
                    <input
                      value={editName}
                      onChange={(e) => { setEditName(e.target.value); setEditSlug(toSlug(e.target.value)); }}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                    <input
                      value={editSlug}
                      onChange={(e) => setEditSlug(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                    <button
                      onClick={() => handleEdit(cat.id)}
                      disabled={editLoading}
                      className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                      {editLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    </button>
                    <button onClick={() => setEditId(null)} className="p-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">{cat.name}</p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">/{cat.slug}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {cat._count && (
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                          {cat._count.products} products
                        </span>
                      )}
                      <button
                        onClick={() => { setEditId(cat.id); setEditName(cat.name); setEditSlug(cat.slug); }}
                        className="p-2 text-slate-400 hover:text-[var(--color-primary)] hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
