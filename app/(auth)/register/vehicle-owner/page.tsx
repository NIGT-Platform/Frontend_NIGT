'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Truck } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { authService } from '@/services/auth.service';

const ownerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  middleName: z.string().min(1, 'Middle name is required'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().startsWith('+', 'Must start with +').min(11, 'Must be at least 11 characters').regex(/^[0-9+]+$/, 'Must contain only numbers and +'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Must contain at least one special character'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type OwnerFormValues = z.infer<typeof ownerSchema>;

export default function VehicleOwnerRegistration() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string>('');
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<OwnerFormValues>({
    resolver: zodResolver(ownerSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: OwnerFormValues) => {
    try {
      setApiError('');
      await authService.registerVehicleOwner({
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
        confirmPassword: data.confirmPassword
      });
      
      // Redirect to verification or pending approval page after success
      router.push('/pending-approval');
    } catch (error: any) {
      const errorMsg = error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat().join(", ")
        : error.response?.data?.message || 'Registration failed. Please try again.';
      setApiError(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Link href="/register" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[var(--color-primary)] mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Role Selection
        </Link>
        
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4 text-[var(--color-secondary)]">
            <Truck className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-[var(--color-primary)]">
            Vehicle Owner Registration
          </h2>
          <p className="mt-2 text-slate-600">
            Create your account to start managing your fleet
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-sm rounded-xl border border-slate-100 sm:px-10">
          <ErrorMessage message={apiError} />
          
          <form className="space-y-5 mt-4" onSubmit={handleSubmit(onSubmit)}>
            <FormField label="First Name" required error={errors.firstName?.message}>
              <Input {...register('firstName')} placeholder="First name" error={!!errors.firstName} />
            </FormField>

            <FormField label="Middle Name" required error={errors.middleName?.message}>
              <Input {...register('middleName')} placeholder="Middle name" error={!!errors.middleName} />
            </FormField>
              
            <FormField label="Last Name" required error={errors.lastName?.message}>
              <Input {...register('lastName')} placeholder="Last name" error={!!errors.lastName} />
            </FormField>

            <FormField label="Email Address" required error={errors.email?.message}>
              <Input type="email" {...register('email')} placeholder="john@example.com" error={!!errors.email} />
            </FormField>

            <FormField label="Phone Number" required error={errors.phoneNumber?.message}>
              <Input type="tel" {...register('phoneNumber')} placeholder="+251..." error={!!errors.phoneNumber} />
            </FormField>

            <FormField label="Password" required error={errors.password?.message}>
              <PasswordInput {...register('password')} placeholder="••••••••" error={!!errors.password} />
            </FormField>

            <FormField label="Confirm Password" required error={errors.confirmPassword?.message}>
              <PasswordInput {...register('confirmPassword')} placeholder="••••••••" error={!!errors.confirmPassword} />
            </FormField>

            <div className="pt-2">
              <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
                Create Account
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-[var(--color-secondary)] hover:text-[var(--color-secondary-hover)]">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
