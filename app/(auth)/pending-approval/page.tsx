import Link from 'next/link';
import { Clock, ArrowLeft, MailCheck, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-sm sm:rounded-xl sm:px-10 border border-slate-100 text-center relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]" />

          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-amber-50 mb-6 border-4 border-white shadow-sm ring-1 ring-amber-100">
            <Clock className="h-10 w-10 text-[var(--color-secondary)] animate-pulse" />
          </div>
          
          <h2 className="text-3xl font-extrabold text-[var(--color-primary)] mb-2">
            Registration Submitted
          </h2>
          
          <p className="text-slate-500 text-sm mb-8">
            Your application is currently under review by our administration team.
          </p>

          <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-100">
            <h3 className="font-semibold text-slate-800 mb-4 text-left border-b border-slate-200 pb-2">What happens next?</h3>
            <ul className="text-sm text-slate-600 text-left space-y-4">
              <li className="flex items-start">
                <div className="bg-blue-100 p-1.5 rounded-md mr-3 mt-0.5">
                  <MailCheck className="h-4 w-4 text-blue-600" />
                </div>
                <span>
                  <strong className="block text-slate-800">1. Verify Email</strong>
                  Please check your inbox and verify your email address to secure your account.
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-amber-100 p-1.5 rounded-md mr-3 mt-0.5">
                  <ShieldCheck className="h-4 w-4 text-[var(--color-secondary)]" />
                </div>
                <span>
                  <strong className="block text-slate-800">2. Admin Review</strong>
                  Our admin team will review your submitted documents (like your Driver's License) to ensure everything is correct.
                </span>
              </li>
            </ul>
          </div>

          <p className="text-xs text-slate-400 mb-8 px-4">
            Approval usually takes 1-2 business days. Thank you for your patience! You will receive an email once you are fully approved.
          </p>

          <Link href="/" className="w-full block">
            <Button variant="outline" className="w-full flex items-center justify-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Return to Homepage
            </Button>
          </Link>

        </div>
      </div>
    </div>
  );
}
