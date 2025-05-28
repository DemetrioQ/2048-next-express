'use client';

import { resendEmailVerification } from '@/utils/api';
import { useState } from 'react';
import { toast } from 'sonner';

export const ResendVerificationButton = () => {
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    try {
const res = await resendEmailVerification();
      toast.success('Verification email sent!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleResend}
      disabled={loading}
      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? 'Sending...' : 'Resend Verification Email'}
    </button>
  );
};
