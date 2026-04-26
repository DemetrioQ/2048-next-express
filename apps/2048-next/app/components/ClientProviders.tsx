'use client';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Toaster } from 'sonner';
import { MotionConfig } from 'framer-motion';
import Navbar from './NavBar';
import GlobalLoadingOverlay from './GlobalLoadingOverlay';
import UsernamePrompt from '@/components/Profile/UsernameModal';
import ErrorBoundary from './ErrorBoundary';
import GlobalErrorListener from './GlobalErrorListener';

function InnerApp({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth();

  return (
    <>
      {loading && <GlobalLoadingOverlay />}
      <div className="min-h-screen bg-[#faf8ef]">
        <Navbar />
        {children}
        {user && !user.username && <UsernamePrompt />}
        <Toaster position="top-right" richColors />
      </div>
    </>
  );
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <GlobalErrorListener />
      <MotionConfig reducedMotion="user">
        <AuthProvider>
          <InnerApp>{children}</InnerApp>
        </AuthProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}
