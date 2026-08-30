'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, UserCircle, Save } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().min(11, 'Phone number is too short').startsWith('+', 'Must start with +'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    // Load existing user data from localStorage for simplicity
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        reset({
          firstName: user.firstName || '',
          middleName: user.middleName || '',
          lastName: user.lastName || '',
          phoneNumber: user.phoneNumber || '',
        });
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }
    setLoading(false);
  }, [reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setApiError('');
      setSuccessMsg('');
      const token = localStorage.getItem('accessToken');
      
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(data),
      });
      
      const resData = await res.json();
      
      if (!res.ok || !resData.success) {
        setApiError(resData.message || 'Failed to update profile');
        return;
      }
      
      // Update local storage with new data
      localStorage.setItem('user', JSON.stringify(resData.user));
      setSuccessMsg('Profile updated successfully!');
      
    } catch (error: any) {
      setApiError('An unexpected error occurred. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin h-8 w-8 text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <div className="bg-[var(--color-primary)] p-3 rounded-xl text-white shadow-sm">
          <UserCircle className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-500 mt-1">Manage your personal information and settings.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 sm:p-8">
          
          <ErrorMessage message={apiError} />
          {successMsg && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
              {successMsg}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="First Name" required error={errors.firstName?.message}>
                <Input {...register('firstName')} error={!!errors.firstName} />
              </FormField>
              
              <FormField label="Middle Name" error={errors.middleName?.message}>
                <Input {...register('middleName')} error={!!errors.middleName} />
              </FormField>

              <FormField label="Last Name" required error={errors.lastName?.message}>
                <Input {...register('lastName')} error={!!errors.lastName} />
              </FormField>

              <FormField label="Phone Number" required error={errors.phoneNumber?.message}>
                <Input {...register('phoneNumber')} error={!!errors.phoneNumber} />
              </FormField>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button type="submit" isLoading={isSubmitting}>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
}
