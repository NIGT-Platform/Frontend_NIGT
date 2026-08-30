'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { KeyRound, ArrowLeft, MailCheck } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { authService } from '@/services/auth.service';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [apiError, setApiError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' }
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      setApiError('');
      await authService.forgotPassword(data.email);
      setIsSuccess(true);
    } catch (error: any) {
      setApiError(error.response?.data?.message || 'Failed to send reset link. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Subtle Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--color-primary)] rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/login" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[var(--color-primary)] mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
        </Link>
        
        <div className="bg-white py-8 px-6 shadow-sm sm:rounded-xl border border-slate-100 sm:px-10">
          
          {isSuccess ? (
            <div className="text-center animate-in fade-in zoom-in duration-500">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-50 mb-6">
                <MailCheck className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-primary)]">Check your email</h2>
              <p className="mt-3 text-slate-500 text-sm">
                If an account exists for that email, we have sent password reset instructions. 
              </p>
              <div className="mt-8">
                <Link href="/login" className="w-full block">
                  <Button variant="outline" className="w-full">Return to login</Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 border border-slate-100">
                  <KeyRound className="h-8 w-8 text-[var(--color-secondary)]" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-primary)]">
                  Forgot Password?
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  No worries, we'll send you reset instructions.
                </p>
              </div>

              <ErrorMessage message={apiError} />
              
              <form className="space-y-6 mt-2" onSubmit={handleSubmit(onSubmit)}>
                
                <FormField label="Email Address" required error={errors.email?.message}>
                  <Input 
                    type="email"
                    {...register('email')} 
                    placeholder="john@example.com" 
                    error={!!errors.email} 
                  />
                </FormField>

                <div className="pt-2">
                  <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
                    Reset Password
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
