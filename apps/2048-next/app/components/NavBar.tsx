// app/components/Navbar.tsx

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import LogoutButton from './LogoutButton';
import Avatar from './Avatar';
import { useState } from 'react';
import LoginModal from './LoginModal';

export default function Navbar() {
    const { user, handleLogout } = useAuth();
    const [loginModalOpen, setLoginModalOpen] = useState(false);


    return (
        <nav className="flex justify-between items-center p-4 bg-gray-100 border-b">
            <Link href="/" className="text-xl font-bold">2048</Link>
            <div className="flex gap-4">
                {user ? (
                    <>
                        <Avatar user={user} />
                        <LogoutButton onLogout={handleLogout} />
                    </>

                ) : (
                    <>
                        <button onClick={() => {setLoginModalOpen(true) }} className="text-blue-500">Login</button>
                        <LoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />

                    </>
                )}
            </div>
        </nav>
    );
}
