import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, MapPin, BarChart3, Users, ChevronRight, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex-shrink-0 flex items-center">
              {/* Using your new logo */}
              <Image 
                src="/logo.png" 
                alt="NIGT Logo" 
                width={240} 
                height={90}
                className="object-contain h-24 w-auto"
                priority
              />
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#about" className="text-slate-600 hover:text-[var(--color-secondary)] font-medium transition-colors">About</a>
              <a href="#features" className="text-slate-600 hover:text-[var(--color-secondary)] font-medium transition-colors">Features</a>
              <a href="#contact" className="text-slate-600 hover:text-[var(--color-secondary)] font-medium transition-colors">Contact</a>
            </div>
            <div className="flex items-center space-x-4">
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

      {/* Hero Section */}
      <section id="about" className="relative bg-[var(--color-primary)] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-500 via-[var(--color-primary)] to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Smarter Transportation <span className="text-[var(--color-secondary)]">Operations</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10">
              A centralized platform for managing NIGT transportation operations, drivers, vehicles, trips, and operational activities with real-time tracking and comprehensive reporting.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)] text-white">
                  Get Started <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-[var(--color-primary)]">
                  Access Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits / Features Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[var(--color-primary)]">Why choose NIGT?</h2>
            <div className="w-24 h-1 bg-[var(--color-secondary)] mx-auto mt-4 rounded-full"></div>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
              Built for reliability and scale, our platform connects vehicle owners and drivers to maximize efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-slate-50 group-hover:bg-[var(--color-primary)] transition-colors text-[var(--color-primary)] group-hover:text-[var(--color-secondary)] rounded-lg flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Safe & Secure</h3>
              <p className="text-slate-600">Strict verification processes for all drivers and vehicles to ensure maximum safety on every trip.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-slate-50 group-hover:bg-[var(--color-primary)] transition-colors text-[var(--color-primary)] group-hover:text-[var(--color-secondary)] rounded-lg flex items-center justify-center mb-6">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Connected Logistics</h3>
              <p className="text-slate-600">Real-time GPS tracking and trip monitoring keeps operations smooth and predictable.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-slate-50 group-hover:bg-[var(--color-primary)] transition-colors text-[var(--color-primary)] group-hover:text-[var(--color-secondary)] rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Efficient Reporting</h3>
              <p className="text-slate-600">Comprehensive dashboards and analytics for vehicle owners and platform administrators.</p>
            </div>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-20 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-12">Who is this platform for?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <Truck className="h-10 w-10 text-[var(--color-secondary)]" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-[var(--color-primary)]">Vehicle Owners</h3>
              <p className="text-slate-600 text-center leading-relaxed">Register your fleet, assign drivers, and track your vehicle operations and earnings in real-time.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <Users className="h-10 w-10 text-[var(--color-secondary)]" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-[var(--color-primary)]">Drivers</h3>
              <p className="text-slate-600 text-center leading-relaxed">Manage your assigned trips, log your kilometers, and report delivery statuses directly from the field.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[var(--color-primary)] text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center text-white mb-4">
               <Image 
                src="/logo.png" 
                alt="NIGT Logo" 
                width={180} 
                height={70}
                className="object-contain h-16 w-auto rounded-md" 
              />
            </div>
            <p className="text-sm mt-4">Moving together. Delivering excellence.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/login" className="hover:text-[var(--color-secondary)] transition-colors">Login</Link></li>
              <li><Link href="/register" className="hover:text-[var(--color-secondary)] transition-colors">Register</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center"><span className="text-[var(--color-secondary)] mr-2">✉</span> support@nigt-platform.com</li>
              <li className="flex items-center"><span className="text-[var(--color-secondary)] mr-2">☏</span> +251 900 00 00 00</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-sm text-center">
          &copy; {new Date().getFullYear()} NIGT Transportation Operations. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
