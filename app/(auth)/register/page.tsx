'use client';
import Link from 'next/link';
import { Truck, Users, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export default function RegisterSelectionPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between sm:top-8 sm:left-8 sm:right-8">
        <Link href="/" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:text-[var(--color-primary)] shadow-sm transition-all group">
          <ArrowLeft className="mr-2 h-4 w-4 text-slate-400 group-hover:text-[var(--color-primary)] transition-colors" /> 
          {t.backToHome}
        </Link>
        <LanguageSwitcher />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 mt-12 sm:mt-0">
        <h2 className="mt-2 text-center text-3xl font-extrabold text-[var(--color-primary)]">
          {t.registerTitle}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {t.registerSubtitle}
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-0">
          
          {/* Vehicle Owner Card */}
          <Link href="/register/vehicle-owner" className="block group">
            <div className="bg-white rounded-xl shadow-sm border-2 border-slate-100 p-8 text-center hover:border-[var(--color-secondary)] hover:shadow-md transition-all h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-50 group-hover:text-[var(--color-secondary)] text-slate-400 transition-colors">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2">{t.asVehicleOwner}</h3>
              <p className="text-sm text-slate-500">{t.asOwnerDesc}</p>
            </div>
          </Link>

          {/* Driver Card */}
          <Link href="/register/driver" className="block group">
            <div className="bg-white rounded-xl shadow-sm border-2 border-slate-100 p-8 text-center hover:border-[var(--color-secondary)] hover:shadow-md transition-all h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-50 group-hover:text-[var(--color-secondary)] text-slate-400 transition-colors">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2">{t.asDriver}</h3>
              <p className="text-sm text-slate-500">{t.asDriverDesc}</p>
            </div>
          </Link>

        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600">
            {t.alreadyHaveAccount}{' '}
            <Link href="/login" className="font-medium text-[var(--color-primary)] hover:underline">
              {t.loginHere}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
