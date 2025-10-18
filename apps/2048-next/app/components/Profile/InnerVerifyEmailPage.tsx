'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';
import { verifyEmail } from '@/utils/api';

export default function InnerVerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(5);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Verification token missing.');
      return;
    }

    const handleVerifyEmail = async () => {
      try {
        const res = await verifyEmail(token);
        const text = await res.text();

        if (!res.ok) {
          setStatus('error');
          setMessage(text || 'Verification failed.');
        } else {
          setStatus('success');
          setMessage(text || 'Email verified successfully!');
        }
      } catch {
        setStatus('error');
        setMessage('An unexpected error occurred.');
      }
    };

    handleVerifyEmail();
  }, [searchParams]);

  useEffect(() => {
    if (status === 'success') {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            router.push('/?showLogin=true');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status, router]);

  return (
    <div className="max-w-md mx-auto mt-20 text-center p-6 border rounded shadow">
      {status === 'loading' && (
        <>
          <Loader className="mx-auto animate-spin h-8 w-8 mb-2" />
          <p>Verifying your email...</p>
        </>
      )}
      {status === 'success' && (
        <>
          <h1 className="text-xl font-semibold mb-2 text-green-600">✅ Email Verified</h1>
          <p className="mb-2">{message}</p>
          <p className="text-sm text-gray-500">
            Redirecting to login in {countdown} seconds...
          </p>
        </>
      )}
      {status === 'error' && (
        <>
          <h1 className="text-xl font-semibold mb-2 text-red-600">❌ Verification Failed</h1>
          <p>{message}</p>
        </>
      )}
    </div>
  );
}
