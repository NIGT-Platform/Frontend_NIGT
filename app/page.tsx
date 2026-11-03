'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, MapPin, BarChart3, Users, ChevronRight, Truck, ShoppingBag, ShoppingCart, Package, ArrowRight, Tag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getFileUrl } from '@/lib/axios';
import { getProducts, Product } from '@/services/shop.service';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { WhatsAppInquiryButton, WhatsAppFloatingWidget, WhatsAppIcon, openWhatsAppChat } from '@/components/ui/WhatsAppButton';

function HeroSlider() {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const slides = [
    {
      src: '/hero1.jpg',
      caption: t.slide1Caption,
      sub: t.slide1Sub,
    },
    {
      src: '/hero2.jpg',
      caption: t.slide2Caption,
      sub: t.slide2Sub,
    },
    {
      src: '/hero3.jpg',
      caption: t.slide3Caption,
      sub: t.slide3Sub,
    },
    {
      src: '/logo.png',
      caption: t.slide4Caption,
      sub: t.slide4Sub,
      isLogo: true,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setAnimating(false);
      }, 600);
    }, 4500);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          {(slide as any).isLogo ? (
            <div className="relative w-full h-full bg-white flex items-center justify-center">
              <Image
                src={slide.src}
                alt={slide.caption}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-8"
              />
            </div>
          ) : (
            <Image
              src={slide.src}
              alt={slide.caption}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority={i === 0}
            />
          )}
          {!(slide as any).isLogo && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          )}
          <div
            className={`absolute bottom-0 left-0 right-0 p-6 transition-all duration-500 ${
              i === current && !animating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            } ${(slide as any).isLogo ? 'text-[#1a3f5c]' : 'text-white'}`}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-[#74C24E] mb-1">{t.nigtFleet}</p>
            <h3 className="text-xl font-bold">{slide.caption}</h3>
            <p className={`text-sm mt-0.5 ${(slide as any).isLogo ? 'text-slate-500' : 'text-slate-300'}`}>
              {slide.sub}
            </p>
          </div>
        </div>
      ))}

      <div className="absolute top-4 right-4 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? 'w-6 bg-[#74C24E]' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { t } = useLanguage();
  const [dbProducts, setDbProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts()
      .then((prods) => {
        if (prods && prods.length > 0) {
          setDbProducts(prods);
        }
      })
      .catch(() => {});
  }, []);

  const fallbackProducts = [
    {
      id: 'demo-1',
      name: t.showcaseTireName,
      category: { name: t.categoryTires },
      price: 18500,
      stockQty: 8,
      imageUrl: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=600&auto=format&fit=crop&q=80',
      description: t.showcaseTireDesc,
    },
    {
      id: 'demo-2',
      name: t.showcaseOilName,
      category: { name: t.categoryOil },
      price: 4900,
      stockQty: 24,
      imageUrl: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=600&auto=format&fit=crop&q=80',
      description: t.showcaseOilDesc,
    },
    {
      id: 'demo-3',
      name: t.showcaseBatteryName,
      category: { name: t.categoryElectrical },
      price: 13200,
      stockQty: 0,
      imageUrl: 'https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?w=600&auto=format&fit=crop&q=80',
      description: t.showcaseBatteryDesc,
    },
    {
      id: 'demo-4',
      name: t.showcaseFilterName,
      category: { name: t.categoryFilters },
      price: 1650,
      stockQty: 15,
      imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80',
      description: t.showcaseFilterDesc,
    },
  ];

  const displayedProducts = dbProducts.length > 0 ? dbProducts.slice(0, 8) : fallbackProducts;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-[#1a3f5c] font-extrabold text-xl tracking-tight">
                NIGT <span className="text-[#33A3DC]">Platform</span>
              </span>
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#about" className="text-slate-600 hover:text-[#33A3DC] font-medium transition-colors">
                {t.about}
              </a>
              <a href="#features" className="text-slate-600 hover:text-[#33A3DC] font-medium transition-colors">
                {t.features}
              </a>
              <a href="#store" className="flex items-center gap-1.5 text-slate-600 hover:text-[#74C24E] font-medium transition-colors">
                <ShoppingBag className="h-4 w-4 text-[#74C24E]" /> {t.autoStore}
              </a>
              <a href="#contact" className="text-slate-600 hover:text-[#33A3DC] font-medium transition-colors">
                {t.contact}
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <LanguageSwitcher />
              <Link href="/store">
                <Button variant="ghost" className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#1a3f5c]">
                  <ShoppingCart className="h-3.5 w-3.5 text-[#74C24E]" /> {t.openStore}
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost">{t.login}</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary">{t.register}</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section id="about" className="relative bg-gradient-to-br from-[#0e2a3d] via-[#1a3f5c] to-[#0b1f2e] overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#33A3DC]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#74C24E]/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* LEFT — Text */}
            <div className="flex flex-col items-start">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 mb-8 shadow-xl">
                <Image
                  src="/logo.png"
                  alt="NIGT Logo"
                  width={300}
                  height={120}
                  className="object-contain w-auto h-28"
                  priority
                />
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-5 leading-tight">
                {t.heroTitle}{' '}
                <span className="text-[#74C24E]">{t.heroSubtitle}</span>
              </h1>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                {t.heroDescription}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-3 mb-10">
                {[t.safe, t.efficient, t.connected, t.reliable].map((badge) => (
                  <span
                    key={badge}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 border border-white/20 text-white tracking-wide"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/register">
                  <button className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#74C24E] hover:bg-[#5ea83d] text-white font-semibold text-sm shadow-lg shadow-[#74C24E]/30 transition-all duration-200 hover:scale-105">
                    {t.getStarted} <ChevronRight className="h-4 w-4" />
                  </button>
                </Link>
                <Link href="/login">
                  <button className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-all duration-200">
                    {t.accessPortal}
                  </button>
                </Link>
              </div>
            </div>

            {/* RIGHT — Auto Slideshow */}
            <div className="h-[420px] md:h-[500px]">
              <HeroSlider />
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 22.5C1200 15 1320 0 1380 0H1440V60H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#74C24E]">{t.whyNigt}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a3f5c] mt-2">{t.featuresHeadline}</h2>
            <div className="w-20 h-1 bg-[#33A3DC] mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: t.feature1Title, desc: t.feature1Desc, color: '#33A3DC' },
              { icon: MapPin, title: t.feature2Title, desc: t.feature2Desc, color: '#74C24E' },
              { icon: BarChart3, title: t.feature3Title, desc: t.feature3Desc, color: '#33A3DC' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="bg-slate-50 border border-slate-100 p-8 rounded-2xl hover:shadow-lg transition-all duration-200 group hover:-translate-y-1"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-sm"
                  style={{ backgroundColor: `${color}18` }}
                >
                  <Icon className="h-7 w-7" style={{ color }} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Auto Parts & Accessories Store Section ── */}
      <section id="store" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#74C24E]/10 border border-[#74C24E]/20 text-[#74C24E] text-xs font-bold uppercase tracking-wider mb-3">
                <ShoppingBag className="h-3.5 w-3.5" /> {t.marketplaceBadge}
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a3f5c]">
                {t.storeHeadline}
              </h2>
              <p className="text-slate-500 mt-2 text-base max-w-2xl">
                {t.storeSubheadline}
              </p>
            </div>
            <Link href="/store">
              <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1a3f5c] hover:bg-[#122e43] text-white font-semibold text-sm transition-all shadow-md group">
                <ShoppingCart className="h-4 w-4 text-[#74C24E]" />
                {t.visitFullStore}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedProducts.map((item: any) => {
              const imgUrl = item.images?.[0] ? getFileUrl(item.images[0].imageUrl) : item.imageUrl || '';
              const isSoldOut = item.stockQty === 0;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
                >
                  {/* Photo area */}
                  <div className="relative aspect-square bg-slate-100 overflow-hidden">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Package className="h-12 w-12" />
                      </div>
                    )}

                    {/* SOLD OUT Overlay */}
                    {isSoldOut ? (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-red-600 text-white font-extrabold text-xs px-4 py-1.5 rounded-full shadow-lg tracking-wider animate-pulse">
                          {t.soldOut}
                        </span>
                      </div>
                    ) : (
                      <div className="absolute top-3 right-3">
                        <span className="bg-emerald-500/90 text-white font-semibold text-[11px] px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm">
                          {item.stockQty} {t.inStock}
                        </span>
                      </div>
                    )}

                    {/* Category pill */}
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-white/95 text-[#1a3f5c] font-bold text-[10px] px-2.5 py-1 rounded-md shadow-sm border border-slate-100 flex items-center gap-1">
                        <Tag className="h-2.5 w-2.5 text-[#74C24E]" />
                        {t.translateCategoryName(item.category?.name || 'Automotive')}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug mb-2 group-hover:text-[#33A3DC] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                          {t.price}
                        </span>
                        <span className="text-lg font-extrabold text-[#1a3f5c]">
                          {t.currency} {Number(item.price).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <WhatsAppInquiryButton
                          productName={item.name}
                          price={Number(item.price)}
                          sku={item.sku}
                          variant="compact"
                        />
                        <Link href={`/store/${item.id}`}>
                          <button
                            disabled={isSoldOut}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                              isSoldOut
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-[#74C24E] hover:bg-[#62a841] text-white shadow-sm'
                            }`}
                          >
                            <ShoppingCart className="h-3.5 w-3.5" />
                            {isSoldOut ? t.outOfStock : t.orderNow}
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Banner */}
          <div className="mt-12 bg-gradient-to-r from-[#1a3f5c] to-[#0e2a3d] rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <Truck className="h-7 w-7 text-[#74C24E]" />
              </div>
              <div>
                <h4 className="text-lg font-bold">{t.fastFleetDispatch}</h4>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  {t.fastFleetDispatchDesc}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => openWhatsAppChat(t.whatsAppGeneralMsg)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-sm font-bold shadow-md transition-all hover:scale-105"
              >
                <WhatsAppIcon className="h-4 w-4" />
                {t.askOnWhatsApp}
              </button>
              <Link href="/store">
                <button className="whitespace-nowrap px-6 py-3 rounded-xl bg-[#74C24E] hover:bg-[#62a841] text-white text-sm font-bold shadow-md transition-all hover:scale-105">
                  {t.browseFullCatalog}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── User Roles Section ── */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#33A3DC]">
            {t.platformUsers}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a3f5c] mt-2 mb-14">
            {t.whoIsThisFor}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: Truck,
                title: t.vehicleOwnersTitle,
                desc: t.vehicleOwnersDesc,
                linkText: t.joinAsOwner,
                color: '#33A3DC',
              },
              {
                icon: Users,
                title: t.driversTitle,
                desc: t.driversDesc,
                linkText: t.joinAsDriver,
                color: '#74C24E',
              },
            ].map(({ icon: Icon, title, desc, linkText, color }) => (
              <div
                key={title}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-200"
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm"
                  style={{ backgroundColor: `${color}18` }}
                >
                  <Icon className="h-10 w-10" style={{ color }} />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-[#1a3f5c]">{title}</h3>
                <p className="text-slate-500 leading-relaxed">{desc}</p>
                <Link
                  href="/register"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
                  style={{ color }}
                >
                  {linkText} <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="contact" className="bg-[#0e2a3d] text-slate-400 py-14 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Image
              src="/logo.png"
              alt="NIGT Logo"
              width={160}
              height={60}
              className="object-contain h-14 w-auto mb-4 rounded"
            />
            <p className="text-sm leading-relaxed">{t.movingTogether}</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t.quickLinks}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="hover:text-[#74C24E] transition-colors">
                  {t.login}
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#74C24E] transition-colors">
                  {t.register}
                </Link>
              </li>
              <li>
                <Link href="/store" className="hover:text-[#74C24E] transition-colors">
                  {t.autoStore}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t.contact}</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-[#74C24E]">✉</span> hadguab77@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#74C24E]">☏</span> +224 624 37 65 53
              </li>
              <li className="pt-2">
                <button
                  onClick={() => openWhatsAppChat(t.whatsAppGeneralMsg)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors text-xs font-semibold"
                >
                  <WhatsAppIcon className="h-4 w-4" /> {t.whatsAppSupport}
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-slate-800 text-xs text-center">
          © {new Date().getFullYear()} {t.allRightsReserved}
        </div>
      </footer>

      {/* Floating WhatsApp Chat Widget */}
      <WhatsAppFloatingWidget />
    </div>
  );
}
