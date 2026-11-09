'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, ShoppingBag, CheckCircle, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { authService } from '@/services/auth.service';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

const buyerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(6, 'Please enter a valid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type BuyerFormValues = z.infer<typeof buyerSchema>;

function BuyerRegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/store';
  const { t } = useLanguage();
  
  const [apiError, setApiError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BuyerFormValues>({
    resolver: zodResolver(buyerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: BuyerFormValues) => {
    try {
      setApiError('');
      const response = await authService.registerBuyer({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        phoneNumber: data.phoneNumber.trim(),
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      // Auto-login buyer immediately
      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('userRole', response.user.role || 'BUYER');
        }
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(redirectUrl);
      }, 1200);
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.errors
          ? Object.values(error.response.data.errors).flat().join(', ')
          : error.response?.data?.message || 'Registration failed. Please try again.';
      setApiError(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/register"
            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[var(--color-primary)] transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Role Selection
          </Link>
          <LanguageSwitcher />
        </div>

        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 text-emerald-600 shadow-sm border border-emerald-100">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-[var(--color-primary)]">
            Customer / Buyer Registration
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Create an instant account to buy truck spare parts, motor oils, and accessories
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-sm rounded-xl border border-slate-100 sm:px-10">
          <ErrorMessage message={apiError} />

          {success && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-4 flex items-center gap-3 text-sm font-semibold animate-pulse">
              <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              Account created successfully! Redirecting you to shop...
            </div>
          )}

          <form className="space-y-4 mt-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="First Name" required error={errors.firstName?.message}>
                <Input {...register('firstName')} placeholder="John" error={!!errors.firstName} />
              </FormField>

              <FormField label="Last Name" required error={errors.lastName?.message}>
                <Input {...register('lastName')} placeholder="Doe" error={!!errors.lastName} />
              </FormField>
            </div>

            <FormField label="Email Address" required error={errors.email?.message}>
              <Input
                {...register('email')}
                type="email"
                placeholder="john.doe@example.com"
                error={!!errors.email}
              />
            </FormField>

            <FormField
              label="Phone Number"
              required
              error={errors.phoneNumber?.message}
            >
              <Input
                {...register('phoneNumber')}
                placeholder="+224..."
                error={!!errors.phoneNumber}
              />
            </FormField>

            <FormField label="Password" required error={errors.password?.message}>
              <PasswordInput
                {...register('password')}
                placeholder="At least 6 characters"
                error={!!errors.password}
              />
            </FormField>

            <FormField label="Confirm Password" required error={errors.confirmPassword?.message}>
              <PasswordInput
                {...register('confirmPassword')}
                placeholder="Confirm your password"
                error={!!errors.confirmPassword}
              />
            </FormField>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 text-base shadow-sm"
              >
                Create Customer Account & Continue
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center border-t border-slate-100 pt-5">
            <p className="text-sm text-slate-500">
              Already registered?{' '}
              <Link
                href={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
                className="font-medium text-[var(--color-primary)] hover:underline"
              >
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BuyerRegistrationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
      <BuyerRegistrationForm />
    </Suspense>
  );
}
