'use client';

import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'sonner';
import Navbar from './NavBar';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-[#faf8ef]">
                <Navbar />
                {children}
                <Toaster position="top-right" richColors />
            </div>
        </AuthProvider>
    );
}
