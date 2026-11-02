'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Users, LayoutDashboard, UserCircle, LogOut, ShieldCheck, Menu, X, Truck, FileEdit, Key, Package, Compass, ShoppingBag, ShoppingCart, Tag, Store, Receipt } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();
  const [role, setRole] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setRole(localStorage.getItem('userRole') || '');
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const isPublicStore = pathname === '/store' || (pathname.startsWith('/store/') && !pathname.includes('/cart') && !pathname.includes('/checkout') && !pathname.includes('/orders'));

  const navItems = [
    { name: t.navDashboard, href: '/dashboard', icon: LayoutDashboard, show: !!role },
    // Admin nav items
    { name: t.navUsers, href: '/admin/users', icon: Users, show: role === 'ADMIN' },
    { name: t.navVehicles, href: '/admin/vehicles', icon: Truck, show: role === 'ADMIN' },
    { name: t.navJobs, href: '/admin/jobs', icon: Package, show: role === 'ADMIN' },
    { name: t.navTrips, href: '/admin/trips', icon: Compass, show: role === 'ADMIN' },
    { name: t.navProfileRequests, href: '/admin/profile-requests', icon: FileEdit, show: role === 'ADMIN' },
    // Admin Shop Management
    { name: t.navShopOverview, href: '/admin/shop', icon: ShoppingBag, show: role === 'ADMIN' },
    { name: t.navProducts, href: '/admin/shop/products', icon: Package, show: role === 'ADMIN' },
    { name: t.navCategories, href: '/admin/shop/categories', icon: Tag, show: role === 'ADMIN' },
    { name: t.navShopOrders, href: '/admin/shop/orders', icon: ShoppingCart, show: role === 'ADMIN' },
    // Vehicle Owner nav items
    { name: t.navMyVehicles, href: '/owner/vehicles', icon: Truck, show: role === 'VEHICLE_OWNER' },
    { name: t.navJobs, href: '/owner/jobs', icon: Package, show: role === 'VEHICLE_OWNER' },
    { name: t.navTrips, href: '/owner/trips', icon: Compass, show: role === 'VEHICLE_OWNER' },
    // Driver nav items
    { name: t.navMyAssignment, href: '/driver/my-assignment', icon: Key, show: role === 'DRIVER' },
    { name: t.navMyTrips, href: '/driver/trips', icon: Compass, show: role === 'DRIVER' },
    // E-Commerce Store for Buyers (Vehicle Owner, Driver, and Admin preview)
    { name: t.navAutoStore, href: '/store', icon: Store, show: true },
    { name: t.navMyCart, href: '/store/cart', icon: ShoppingCart, show: role === 'VEHICLE_OWNER' || role === 'DRIVER' },
    { name: t.navMyOrders, href: '/store/orders', icon: Receipt, show: role === 'VEHICLE_OWNER' || role === 'DRIVER' },
    // Guest items if not logged in
    { name: t.navLoginToOrder, href: '/login', icon: Key, show: !role },
    { name: t.navHome, href: '/', icon: LayoutDashboard, show: !role },
    // Common
    { name: t.navProfile, href: '/profile', icon: UserCircle, show: !!role },
  ];

  const layoutContent = (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <ShieldCheck className="h-6 w-6 text-[var(--color-primary)]" />
          <span className="font-bold text-[var(--color-primary)]">NIGT</span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-lg text-slate-600 hover:bg-slate-100">
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <Link href="/" className="p-6 hidden md:flex items-center space-x-3">
            <ShieldCheck className="h-8 w-8 text-[var(--color-primary)]" />
            <div>
              <span className="text-xl font-bold text-[var(--color-primary)] block">NIGT</span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block">
                {t.platformTitle}
              </span>
            </div>
          </Link>
          
          <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
            {navItems.filter(item => item.show).map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                  <div className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-[var(--color-primary)] text-white shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}>
                    <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-200 space-y-2">
            <div className="hidden md:block pb-1">
              <LanguageSwitcher />
            </div>
            {role ? (
              <button 
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5 text-red-500" />
                {t.navSignOut}
              </button>
            ) : (
              <Link href="/login" className="flex items-center w-full px-3 py-2 text-sm font-medium text-[var(--color-primary)] rounded-lg hover:bg-emerald-50 transition-colors">
                <Key className="mr-3 h-5 w-5" />
                {t.navSignIn}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto flex flex-col h-screen">
        {/* Desktop Top Header Bar */}
        <header className="hidden md:flex bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3.5 items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.platformTitle}
            </span>
            {role && (
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {role === 'ADMIN' ? 'Admin' : role === 'VEHICLE_OWNER' ? 'Vehicle Owner' : 'Driver'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {role && (
              <Link href="/profile" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-medium">
                <UserCircle className="h-5 w-5 text-slate-400" />
                <span>{t.navProfile}</span>
              </Link>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );

  if (isPublicStore) {
    return layoutContent;
  }

  return (
    <ProtectedRoute>
      {layoutContent}
    </ProtectedRoute>
  );
}
