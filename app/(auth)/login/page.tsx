'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ShieldCheck, LogIn, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { authService } from '@/services/auth.service';

const loginSchema = z.object({
  emailOrPhone: z.string().min(1, 'Email or Phone Number is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState('');
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: '',
      password: '',
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setApiError('');
      const response = await authService.login(data);
      
      // Store token and user data
      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('userRole', response.user?.role || '');
      }
      
      // Redirect to a placeholder dashboard (we will build this later)
      router.push('/dashboard'); 
    } catch (error: any) {
      setApiError(error.response?.data?.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Subtle Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--color-primary)] rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-[var(--color-secondary)] rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[var(--color-primary)] mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>
        
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 border border-slate-100">
            <ShieldCheck className="h-8 w-8 text-[var(--color-primary)]" />
          </div>
          <h2 className="text-3xl font-extrabold text-[var(--color-primary)]">
            Access Portal
          </h2>
          <p className="mt-2 text-slate-600">
            Sign in to manage your account
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-sm sm:rounded-xl border border-slate-100 sm:px-10">
          <ErrorMessage message={apiError} />
          
          <form className="space-y-6 mt-2" onSubmit={handleSubmit(onSubmit)}>
            
            <FormField label="Email or Phone Number" required error={errors.emailOrPhone?.message}>
              <Input 
                {...register('emailOrPhone')} 
                placeholder="john@example.com or +251..." 
                error={!!errors.emailOrPhone} 
              />
            </FormField>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-slate-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <Link href="/forgot-password" className="text-sm font-medium text-[var(--color-secondary)] hover:text-amber-700">
                  Forgot password?
                </Link>
              </div>
              <PasswordInput 
                {...register('password')} 
                placeholder="••••••••" 
                error={!!errors.password} 
              />
              {errors.password?.message && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message as string}</p>
              )}
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
                <LogIn className="mr-2 h-4 w-4" /> Sign In
              </Button>
            </div>
          </form>
          
          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-sm text-slate-600">
              Don't have an account?{" "}
              <Link href="/register" className="font-medium text-[var(--color-secondary)] hover:text-amber-700">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
