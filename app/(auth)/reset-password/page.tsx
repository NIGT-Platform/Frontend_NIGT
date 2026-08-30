'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ShieldAlert, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { authService } from '@/services/auth.service';

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [apiError, setApiError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' }
  });

  // If no token is present, we immediately show an error state
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-10 px-4 shadow-sm sm:rounded-xl sm:px-10 border border-slate-100 text-center">
            <ShieldAlert className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-[var(--color-primary)]">Invalid Reset Link</h2>
            <p className="text-slate-500 mt-2">The password reset link is invalid or missing the security token.</p>
            <div className="mt-8">
              <Link href="/forgot-password" className="w-full block">
                <Button className="w-full">Request New Link</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: ResetPasswordValues) => {
    try {
      setApiError('');
      await authService.resetPassword({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      setIsSuccess(true);
    } catch (error: any) {
      setApiError(error.response?.data?.message || 'Failed to reset password. The link might be expired or already used.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Subtle Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[var(--color-primary)] rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        
        <div className="bg-white py-8 px-6 shadow-sm sm:rounded-xl border border-slate-100 sm:px-10">
          
          {isSuccess ? (
            <div className="text-center animate-in fade-in zoom-in duration-500">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-50 mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-primary)]">Password Reset!</h2>
              <p className="mt-3 text-slate-500 text-sm">
                Your password has been changed successfully. You can now log in with your new password.
              </p>
              <div className="mt-8">
                <Link href="/login" className="w-full block">
                  <Button className="w-full">Go to Login</Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[var(--color-primary)]">
                  Create New Password
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Please enter your new strong password below.
                </p>
              </div>

              <ErrorMessage message={apiError} />
              
              <form className="space-y-6 mt-2" onSubmit={handleSubmit(onSubmit)}>
                
                <FormField label="New Password" required error={errors.password?.message}>
                  <PasswordInput 
                    {...register('password')} 
                    placeholder="••••••••" 
                    error={!!errors.password} 
                  />
                </FormField>
                
                <FormField label="Confirm New Password" required error={errors.confirmPassword?.message}>
                  <PasswordInput 
                    {...register('confirmPassword')} 
                    placeholder="••••••••" 
                    error={!!errors.confirmPassword} 
                  />
                </FormField>

                <div className="pt-2">
                  <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
                    Save New Password
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-[var(--color-secondary)]" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
