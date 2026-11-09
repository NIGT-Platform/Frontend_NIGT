'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  ExternalLink,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { getFileUrl } from '@/lib/axios';
import {
  getAdminHeroSlides,
  createHeroSlide,
  deleteHeroSlide,
  HeroSlide,
} from '@/services/heroSlide.service';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export default function AdminHeroSlidesPage() {
  const { t } = useLanguage();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [subCaption, setSubCaption] = useState('');
  const [order, setOrder] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchSlides = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAdminHeroSlides();
      setSlides(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load hero slides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image file to upload.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('image', file);
      if (caption.trim()) formData.append('caption', caption.trim());
      if (subCaption.trim()) formData.append('subCaption', subCaption.trim());
      formData.append('order', String(order || 0));

      await createHeroSlide(formData);
      setSuccess('Hero slide added successfully! It is now live on the landing page.');

      // Reset form
      setFile(null);
      setPreviewUrl('');
      setCaption('');
      setSubCaption('');
      setOrder(0);
      if (fileInputRef.current) fileInputRef.current.value = '';

      // Refresh list
      await fetchSlides();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to upload hero slide. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this slide from the landing page?')) return;
    setDeletingId(id);
    setError('');
    try {
      await deleteHeroSlide(id);
      setSlides((prev) => prev.filter((s) => s.id !== id));
      setSuccess('Slide removed successfully.');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete slide.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Sparkles className="h-5 w-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              Landing Page Hero Cards
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Upload custom banner images to display in the animated hero card on the main homepage
          </p>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm"
          >
            Preview Landing Page <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-center gap-3 text-sm">
          <AlertCircle className="h-5 w-5 flex-shrink-0" /> {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 flex items-center gap-3 text-sm font-semibold">
          <CheckCircle className="h-5 w-5 flex-shrink-0 text-emerald-600" /> {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5 sticky top-20">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Plus className="h-5 w-5 text-emerald-600" /> Add New Hero Slide
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Slide Photo <span className="text-red-500">*</span>
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                    previewUrl
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-slate-300 hover:border-slate-400 bg-slate-50'
                  }`}
                >
                  {previewUrl ? (
                    <div className="space-y-2">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg shadow-sm"
                      />
                      <p className="text-xs text-slate-500">Click to choose a different photo</p>
                    </div>
                  ) : (
                    <div className="py-6 space-y-2">
                      <Upload className="mx-auto h-8 w-8 text-slate-400" />
                      <p className="text-sm font-semibold text-slate-700">Click to upload image</p>
                      <p className="text-xs text-slate-400">PNG, JPG, WEBP up to 10MB</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Main Headline / Caption
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Heavy Duty Mining Fleet & Spare Parts"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              {/* Sub-caption */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Sub-caption / Details
                </label>
                <input
                  type="text"
                  value={subCaption}
                  onChange={(e) => setSubCaption(e.target.value)}
                  placeholder="e.g. Reliable logistics and fast delivery across Guinea"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <span className="text-[11px] text-slate-400">Slides are ordered from lowest to highest.</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-opacity disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Uploading to Cloud...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" /> Add to Landing Page Card
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Existing Slides List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">
              Active Animated Cards ({slides.length})
            </h2>
            <button
              onClick={fetchSlides}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              Refresh List
            </button>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-[var(--color-primary)]" />
              <p className="text-sm text-slate-500 mt-2">Loading slides...</p>
            </div>
          ) : slides.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <ImageIcon className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="font-bold text-slate-700">No Custom Slides Yet</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                The landing page is currently displaying the default built-in fleet photos.
                Use the form on the left to upload your own custom branded card!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {slides.map((slide) => {
                const imgUrl = getFileUrl(slide.imageUrl);
                return (
                  <div
                    key={slide.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-video bg-slate-100 overflow-hidden">
                      <img
                        src={imgUrl}
                        alt={slide.caption || 'Hero Slide'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                      <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        Order: {slide.order}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm line-clamp-1">
                          {slide.caption || 'No Headline'}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                          {slide.subCaption || 'No sub-caption provided'}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Live
                        </span>
                        <button
                          onClick={() => handleDelete(slide.id)}
                          disabled={deletingId === slide.id}
                          className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 p-1 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                        >
                          {deletingId === slide.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
