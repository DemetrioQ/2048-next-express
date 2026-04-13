// /context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getMe, loginWithOAuth, logout, registerUser, loginUser } from '@/utils/api';
import { PublicUser } from 'shared-2048-logic/types/User'


interface AuthContextType {
    user: PublicUser | null;
    setUser: React.Dispatch<React.SetStateAction<PublicUser | null>>;
    loading: boolean;
    login: (credentials: { email: string; password: string }) => Promise<void>;
    handleOAuth: (provider: 'google' | 'github', onClose: () => void, successAlert: () => void) => void;
    handleLogout: () => void;
    register: (data: { email: string; username: string; password: string }) => Promise<void>;
    refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<PublicUser | null>(null);
    const [loading, setLoading] = useState(true);

    const register = async (data: {
        email: string;
        username: string;
        password: string;
    }) => {

        await registerUser(data);
    };

    const login = async (credentials: { email: string; password: string }) => {
        const response = await loginUser(credentials);
        setUser(response.user); 
    };


    const handleOAuth = (provider: 'google' | 'github', onClose: () => void, successAlert: () => void) => {
        loginWithOAuth(
            provider,
            async (user: PublicUser) => {
                try {
                    setUser(user);
                    onClose();
                    successAlert();
                } catch (err) {
                    console.error('Failed to fetch user after OAuth:', err);

                }
            },
            () => {
                console.error('OAuth login failed or canceled.');
            }
        );
    };

    const handleLogout = () => {
        logout();
        setUser(null);
        return;

    };


    const refreshUser = () => {
        setLoading(true);
        getMe().then((data) => {
            if (data?.user) setUser(data.user);
        }).catch((rq) => {
            setUser(null);
            console.log(rq);
        })
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        try {
            console.log('[AuthProvider] useEffect called');
            refreshUser();
        }
        catch (err: unknown) {
            console.log(err);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, handleOAuth, register, handleLogout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};





export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
