// /context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getMe, loginWithOAuth } from '@/utils/api';
import { PublicUser } from 'shared-2048-logic/types/User'



interface AuthContextType {
    user: PublicUser | null;
    setUser: React.Dispatch<React.SetStateAction<PublicUser | null>>;
    handleOAuth: (provider: 'google' | 'github', onClose : () => void )  => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<PublicUser | null>(null);

    const handleOAuth = (provider: 'google' | 'github', onClose : () => void ) => {
    loginWithOAuth(
      provider,
      async (user: PublicUser) => {
        try {
            setUser(user);
            onClose();
        } catch (err) {
          console.error('Failed to fetch user after OAuth:', err);
        }
      },
      () => {
        console.error('OAuth login failed or canceled.');
      }
    );
  };

    useEffect(() => {
        try {
            getMe().then((data) => {
                if (data?.user) setUser(data.user);
            }).catch((rq) => console.log(rq));
        }
        catch (err: any) {
            console.log(err);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, handleOAuth }}>
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
