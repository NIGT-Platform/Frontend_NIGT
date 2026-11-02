'use client';
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const DEFAULT_WHATSAPP_NUMBER = '224624376553'; // Admin WhatsApp number: +224 624 37 65 53

export function getWhatsAppNumber(): string {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) {
    return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER.replace(/[^0-9]/g, '');
  }
  return DEFAULT_WHATSAPP_NUMBER;
}

export function openWhatsAppChat(message: string) {
  const number = getWhatsAppNumber();
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${number}?text=${encoded}`;
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

export const WhatsAppIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.67 7.74C8.47 7.74 8.17 7.81 7.91 8.08C7.65 8.35 6.92 9.04 6.92 10.45C6.92 11.86 7.95 13.22 8.09 13.41C8.24 13.61 10.08 16.43 12.91 17.65C13.59 17.94 14.11 18.11 14.53 18.25C15.21 18.46 15.82 18.43 16.31 18.36C16.86 18.28 17.99 17.67 18.23 17.01C18.46 16.34 18.46 15.77 18.39 15.65C18.32 15.53 18.12 15.46 17.82 15.31C17.52 15.16 16.06 14.44 15.79 14.34C15.52 14.24 15.32 14.19 15.12 14.49C14.92 14.79 14.36 15.46 14.19 15.65C14.02 15.84 13.85 15.86 13.55 15.71C13.25 15.56 12.28 15.25 11.13 14.23C10.24 13.43 9.64 12.45 9.47 12.15C9.3 11.85 9.45 11.69 9.6 11.54C9.74 11.41 9.91 11.18 10.06 11.01C10.21 10.84 10.26 10.71 10.36 10.51C10.46 10.31 10.41 10.14 10.34 10C10.26 9.85 9.7 8.48 9.46 7.93C9.24 7.39 9.01 7.46 8.84 7.45C8.68 7.45 8.48 7.45 8.67 7.74Z" />
  </svg>
);

interface ProductInquiryProps {
  productName: string;
  price: number;
  sku?: string;
  className?: string;
  variant?: 'primary' | 'outline' | 'compact';
}

export function WhatsAppInquiryButton({
  productName,
  price,
  sku,
  className = '',
  variant = 'primary',
}: ProductInquiryProps) {
  const { t } = useLanguage();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = t.whatsAppInquiryMsg(productName, price, sku);
    openWhatsAppChat(msg);
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        title={t.askOnWhatsApp}
        className={`p-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white shadow-sm transition-transform hover:scale-105 active:scale-95 flex items-center justify-center ${className}`}
      >
        <WhatsAppIcon className="h-4 w-4" />
      </button>
    );
  }

  if (variant === 'outline') {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-semibold text-xs sm:text-sm transition-all duration-200 active:scale-95 ${className}`}
      >
        <WhatsAppIcon className="h-4 w-4" />
        <span>{t.askOnWhatsApp}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 ${className}`}
    >
      <WhatsAppIcon className="h-5 w-5" />
      <span>{t.buyViaWhatsApp}</span>
    </button>
  );
}

export function WhatsAppFloatingWidget() {
  const { t } = useLanguage();

  const handleChat = () => {
    openWhatsAppChat(t.whatsAppGeneralMsg);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center group">
      <div className="hidden group-hover:block mr-3 bg-white px-3.5 py-2 rounded-xl shadow-xl border border-slate-100 text-xs text-slate-800 font-medium whitespace-nowrap animate-in fade-in slide-in-from-right-3 duration-200">
        <div className="flex items-center gap-1.5 font-bold text-[#1a3f5c] mb-0.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          NIGT Parts Support
        </div>
        {t.chatWithSupport}
      </div>

      <button
        onClick={handleChat}
        aria-label="Chat with NIGT on WhatsApp"
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ring-4 ring-white"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </button>
    </div>
  );
}

