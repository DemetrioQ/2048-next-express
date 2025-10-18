'use client';

import { Suspense } from 'react';
import InnerVerifyEmailPage from '../components/Profile/InnerVerifyEmailPage';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InnerVerifyEmailPage />
    </Suspense>
  );
}
