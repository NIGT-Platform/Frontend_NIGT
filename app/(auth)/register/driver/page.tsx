'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Users, Upload, FileCheck2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { authService } from '@/services/auth.service';

const driverSchema = z.object({
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
  confirmPassword: z.string(),
  licenseNumber: z.string().min(1, 'License number is required'),
  licenseType: z.enum(['CLASS_A', 'CLASS_B', 'CLASS_C', 'CLASS_D', 'CLASS_E']),
  licenseExpiryDate: z.string().refine((date) => {
    const expiry = new Date(date);
    return expiry > new Date();
  }, 'License has expired or date is invalid'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type DriverFormValues = z.infer<typeof driverSchema>;

export default function DriverRegistration() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      licenseNumber: '',
      licenseType: 'CLASS_B',
      licenseExpiryDate: ''
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data: DriverFormValues) => {
    if (!selectedFile) {
      setApiError('Please upload a copy of your Driver License.');
      return;
    }

    try {
      setApiError('');
      
      const formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('middleName', data.middleName);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      formData.append('phoneNumber', data.phoneNumber);
      formData.append('password', data.password);
      formData.append('confirmPassword', data.confirmPassword);
      formData.append('licenseNumber', data.licenseNumber);
      formData.append('licenseType', data.licenseType);
      formData.append('licenseExpiryDate', data.licenseExpiryDate);
      formData.append('licenseDocument', selectedFile);

      await authService.registerDriver(formData);
      
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
      <div className="max-w-xl mx-auto">
        <Link href="/register" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[var(--color-primary)] mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Role Selection
        </Link>
        
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4 text-[var(--color-secondary)]">
            <Users className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-[var(--color-primary)]">
            Driver Registration
          </h2>
          <p className="mt-2 text-slate-600">
            Join the platform and start managing your trips
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-sm rounded-xl border border-slate-100 sm:px-10">
          <ErrorMessage message={apiError} />
          
          <form className="space-y-6 mt-4" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Personal Details Section */}
            <div className="border-b border-slate-200 pb-4 mb-4">
              <h3 className="text-lg font-medium text-slate-900 mb-4">1. Personal Details</h3>
              <div className="space-y-4">
                <FormField label="First Name" required error={errors.firstName?.message}>
                  <Input {...register('firstName')} placeholder="First name" error={!!errors.firstName} />
                </FormField>

                <FormField label="Middle Name" required error={errors.middleName?.message}>
                  <Input {...register('middleName')} placeholder="Middle name" error={!!errors.middleName} />
                </FormField>
                  
                <FormField label="Last Name" required error={errors.lastName?.message}>
                  <Input {...register('lastName')} placeholder="Last name" error={!!errors.lastName} />
                </FormField>
              </div>
            </div>

            {/* Account Details Section */}
            <div className="border-b border-slate-200 pb-4 mb-4">
              <h3 className="text-lg font-medium text-slate-900 mb-4">2. Account Details</h3>
              <div className="space-y-4">
                <FormField label="Email Address" required error={errors.email?.message}>
                  <Input type="email" {...register('email')} placeholder="john@example.com" error={!!errors.email} />
                </FormField>

                <FormField label="Phone Number" required error={errors.phoneNumber?.message}>
                  <Input type="tel" {...register('phoneNumber')} placeholder="+251..." error={!!errors.phoneNumber} />
                </FormField>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Password" required error={errors.password?.message}>
                    <PasswordInput {...register('password')} placeholder="••••••••" error={!!errors.password} />
                  </FormField>

                  <FormField label="Confirm Password" required error={errors.confirmPassword?.message}>
                    <PasswordInput {...register('confirmPassword')} placeholder="••••••••" error={!!errors.confirmPassword} />
                  </FormField>
                </div>
              </div>
            </div>

            {/* License Details Section */}
            <div className="pb-2">
              <h3 className="text-lg font-medium text-slate-900 mb-4">3. License Details</h3>
              <div className="space-y-4">
                <FormField label="License Number" required error={errors.licenseNumber?.message}>
                  <Input {...register('licenseNumber')} placeholder="DL-12345678" error={!!errors.licenseNumber} />
                </FormField>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="License Type" required error={errors.licenseType?.message}>
                    <select
                      {...register('licenseType')}
                      className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="CLASS_A">Class A</option>
                      <option value="CLASS_B">Class B</option>
                      <option value="CLASS_C">Class C</option>
                      <option value="CLASS_D">Class D</option>
                      <option value="CLASS_E">Class E</option>
                    </select>
                  </FormField>

                  <FormField label="Expiry Date" required error={errors.licenseExpiryDate?.message}>
                    <Input type="date" {...register('licenseExpiryDate')} error={!!errors.licenseExpiryDate} />
                  </FormField>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Upload License Document <span className="text-red-500">*</span></label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:border-[var(--color-secondary)] transition-colors cursor-pointer" onClick={() => document.getElementById('file-upload')?.click()}>
                    <div className="space-y-1 text-center">
                      {selectedFile ? (
                        <div className="flex flex-col items-center">
                          <FileCheck2 className="mx-auto h-12 w-12 text-green-500" />
                          <p className="mt-2 text-sm text-slate-700 font-medium">{selectedFile.name}</p>
                          <p className="text-xs text-slate-500">Click to change file</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto h-12 w-12 text-slate-400" />
                          <div className="flex text-sm text-slate-600 justify-center mt-2">
                            <span className="relative cursor-pointer bg-white rounded-md font-medium text-[var(--color-secondary)] hover:text-amber-600 focus-within:outline-none">
                              <span>Upload a file</span>
                            </span>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">PNG, JPG, PDF up to 5MB</p>
                        </>
                      )}
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
                Complete Registration
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
