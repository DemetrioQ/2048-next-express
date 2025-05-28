// AccountInfoTab.tsx
import { useAuth } from '@/context/AuthContext';
import UsernamePrompt from '../UsernameModal';

export default function AccountInfoTab() {
    const { user } = useAuth();

    return (
        <>
            {user && !user.username && <UsernamePrompt />}

            <h2 className="text-lg font-semibold mb-2">Username</h2>
            <p className="mb-4">{user?.username}</p>

            <h2 className="text-lg font-semibold mb-2">Email</h2>
            <p className="mb-4">{user?.email}</p>

            <button className="mt-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">
                Edit Profile (coming soon)
            </button>
        </>
    );
}
