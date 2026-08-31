'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role === 'ADMIN') {
      router.push('/admin/users');
    } else if (role === 'DRIVER') {
      router.push('/profile');
    } else if (role === 'VEHICLE_OWNER') {
      router.push('/owner/vehicles');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="animate-spin h-8 w-8 text-[var(--color-primary)]" />
    </div>
  );
}
