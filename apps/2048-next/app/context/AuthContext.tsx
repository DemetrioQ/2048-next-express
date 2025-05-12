// /context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getMe } from '@/utils/api';

interface User {
    _id: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        try {
            getMe().then((data) => {
                if (data.user) setUser(data.user);
            }).catch((rq) => console.log(rq));
        }
        catch (err: any) {
            // console.log(err);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
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
