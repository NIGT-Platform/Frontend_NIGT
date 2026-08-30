'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { authService } from '@/services/auth.service';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Verification token is missing from the URL.');
      return;
    }

    const verifyToken = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus('success');
      } catch (error: any) {
        setStatus('error');
        setErrorMessage(error.response?.data?.message || 'Verification failed. The token may be invalid or expired.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-4 shadow-sm sm:rounded-xl sm:px-10 border border-slate-100 text-center">
          
          {status === 'loading' && (
            <div className="flex flex-col items-center">
              <Loader2 className="h-16 w-16 text-[var(--color-secondary)] animate-spin mb-6" />
              <h2 className="text-2xl font-bold text-[var(--color-primary)]">Verifying Email...</h2>
              <p className="text-slate-500 mt-2">Please wait a moment while we verify your account securely.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
              <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-[var(--color-primary)]">Email Verified!</h2>
              <p className="text-slate-500 mt-3 text-sm">Your email has been successfully verified. You can now log into your account dashboard.</p>
              <div className="mt-8 w-full">
                <Link href="/login" className="w-full block">
                  <Button className="w-full" size="lg">Continue to Login</Button>
                </Link>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
              <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <XCircle className="h-12 w-12 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-primary)]">Verification Failed</h2>
              <p className="text-slate-500 mt-3 text-sm">{errorMessage}</p>
              <div className="mt-8 w-full space-y-3">
                <Link href="/register" className="w-full block">
                  <Button variant="outline" className="w-full" size="lg">Back to Registration</Button>
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-[var(--color-secondary)]" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
