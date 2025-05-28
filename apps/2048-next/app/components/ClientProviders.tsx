'use client';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Toaster } from 'sonner';
import Navbar from './NavBar';
import GlobalLoadingOverlay from './GlobalLoadingOverlay';
import UsernamePrompt from '@/components/Profile/UsernameModal';

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
    <AuthProvider>
      <InnerApp>{children}</InnerApp>
    </AuthProvider>
  );
}
