'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, MapPin, BarChart3, Users, ChevronRight, Truck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const slides = [
  {
    src: '/hero1.jpg',
    caption: 'On the Road, Every Day',
    sub: 'Powering long-haul transportation across the country.',
  },
  {
    src: '/hero2.jpg',
    caption: 'Fleet Management at Scale',
    sub: 'Centrally manage hundreds of vehicles with ease.',
  },
  {
    src: '/hero3.jpg',
    caption: 'Trusted Drivers, Verified',
    sub: 'Every driver on the platform is screened and approved.',
  },
  {
    src: '/logo.png',
    caption: 'NIGT Transportation',
    sub: 'Moving Together. Delivering Excellence.',
    isLogo: true,
  },
];

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % slides.length);
        setAnimating(false);
      }, 600);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            i === current
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-105'
          }`}
        >
          {(slide as any).isLogo ? (
            // Logo slide — white background
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
          {/* Gradient overlay for caption — only on photo slides */}
          {!(slide as any).isLogo && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          )}
          {/* Caption */}
          <div className={`absolute bottom-0 left-0 right-0 p-6 transition-all duration-500 ${
            i === current && !animating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          } ${
            (slide as any).isLogo ? 'text-[#1a3f5c]' : 'text-white'
          }`}>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#74C24E] mb-1">NIGT Fleet</p>
            <h3 className="text-xl font-bold">{slide.caption}</h3>
            <p className={`text-sm mt-0.5 ${ (slide as any).isLogo ? 'text-slate-500' : 'text-slate-300' }`}>{slide.sub}</p>
          </div>
        </div>
      ))}

      {/* Dot indicators */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-[#74C24E]' : 'w-2 bg-white/50 hover:bg-white/80'}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-[#1a3f5c] font-extrabold text-xl tracking-tight">NIGT <span className="text-[#33A3DC]">Platform</span></span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#about" className="text-slate-600 hover:text-[#33A3DC] font-medium transition-colors">About</a>
              <a href="#features" className="text-slate-600 hover:text-[#33A3DC] font-medium transition-colors">Features</a>
              <a href="#contact" className="text-slate-600 hover:text-[#33A3DC] font-medium transition-colors">Contact</a>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary">Register</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section id="about" className="relative bg-gradient-to-br from-[#0e2a3d] via-[#1a3f5c] to-[#0b1f2e] overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#33A3DC]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#74C24E]/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* LEFT — Logo card + Text */}
            <div className="flex flex-col items-start">
              {/* Logo badge */}
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
                Smarter Transportation{' '}
                <span className="text-[#74C24E]">Operations</span>
              </h1>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                A centralized platform for managing NIGT transportation operations, drivers, vehicles, and activities — all in one place.
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-3 mb-10">
                {['Safe', 'Efficient', 'Connected', 'Reliable'].map(badge => (
                  <span key={badge} className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 border border-white/20 text-white tracking-wide">
                    {badge}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/register">
                  <button className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#74C24E] hover:bg-[#5ea83d] text-white font-semibold text-sm shadow-lg shadow-[#74C24E]/30 transition-all duration-200 hover:scale-105">
                    Get Started <ChevronRight className="h-4 w-4" />
                  </button>
                </Link>
                <Link href="/login">
                  <button className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-all duration-200">
                    Access Portal
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
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 22.5C1200 15 1320 0 1380 0H1440V60H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#74C24E]">Why NIGT?</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a3f5c] mt-2">Built for Transportation Excellence</h2>
            <div className="w-20 h-1 bg-[#33A3DC] mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: 'Safe & Secure', desc: 'Strict verification for all drivers and vehicles ensures maximum safety on every trip.', color: '#33A3DC' },
              { icon: MapPin, title: 'Connected Logistics', desc: 'Real-time tracking and trip monitoring keeps operations smooth and predictable.', color: '#74C24E' },
              { icon: BarChart3, title: 'Efficient Reporting', desc: 'Comprehensive dashboards and analytics for vehicle owners and administrators.', color: '#33A3DC' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-slate-50 border border-slate-100 p-8 rounded-2xl hover:shadow-lg transition-all duration-200 group hover:-translate-y-1">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-sm" style={{ backgroundColor: `${color}18` }}>
                  <Icon className="h-7 w-7" style={{ color }} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── User Roles Section ── */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#33A3DC]">Platform Users</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a3f5c] mt-2 mb-14">Who is this for?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Truck, title: 'Vehicle Owners', desc: 'Register your fleet, assign certified drivers, and track your vehicles and operations from a single dashboard.', color: '#33A3DC' },
              { icon: Users, title: 'Professional Drivers', desc: 'Manage assigned trips, view your vehicle assignments, and stay connected with your fleet owner in real-time.', color: '#74C24E' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-200">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm" style={{ backgroundColor: `${color}18` }}>
                  <Icon className="h-10 w-10" style={{ color }} />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-[#1a3f5c]">{title}</h3>
                <p className="text-slate-500 leading-relaxed">{desc}</p>
                <Link href="/register" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline" style={{ color }}>
                  Join as {title.split(' ')[0]} <ChevronRight className="h-4 w-4" />
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
            <Image src="/logo.png" alt="NIGT Logo" width={160} height={60} className="object-contain h-14 w-auto mb-4 rounded" />
            <p className="text-sm leading-relaxed">Moving together. Delivering excellence.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="hover:text-[#74C24E] transition-colors">Login</Link></li>
              <li><Link href="/register" className="hover:text-[#74C24E] transition-colors">Register</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><span className="text-[#74C24E]">✉</span> support@nigt-platform.com</li>
              <li className="flex items-center gap-2"><span className="text-[#74C24E]">☏</span> +251 900 00 00 00</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-slate-800 text-xs text-center">
          © {new Date().getFullYear()} NIGT Transportation Operations Management. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
