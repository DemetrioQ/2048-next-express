'use client';

import { resendEmailVerification } from '@/utils/api';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const COOLDOWN_SECONDS = (Number(process.env.EMAIL_VALIDATION_COOLDOWN_IN_MINUTES) || 5) * 60;

export const ResendVerificationButton = () => {
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const lastSent = localStorage.getItem('lastVerificationEmailSent');
    if (lastSent) {
      const diff = Math.floor((Date.now() - parseInt(lastSent, 10)) / 1000);
      if (diff < COOLDOWN_SECONDS) {
        setCooldown(COOLDOWN_SECONDS - diff);
      }
    }
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleResend = async () => {
    setLoading(true);
    try {
      const res = await resendEmailVerification();
      toast.success('Verification email sent!');
      localStorage.setItem('lastVerificationEmailSent', Date.now().toString());
      setCooldown(COOLDOWN_SECONDS);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (<>
    {loading ? (
      <button
        onClick={handleResend}
        disabled={loading}
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Resend Verification Email'}
      </button>
    ) : (
      <button
        onClick={handleResend}
        disabled={cooldown > 0}
        className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
      >
        {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Verification Email'}
      </button>)
    }
  </>
  );
};
