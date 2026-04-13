// AccountInfoTab.tsx
import { useAuth } from '@/context/AuthContext';
import UsernamePrompt from '../UsernameModal';
import { ResendVerificationButton } from '../ResendVerificationButton';

export default function AccountInfoTab() {
    const { user } = useAuth();

    return (
        <>
            {user && !user.username && <UsernamePrompt />}

            <h2 className="text-lg font-semibold mb-2">Username</h2>
            <p className="mb-4">{user?.username}</p>

            <h2 className="text-lg font-semibold mb-2">Email</h2>
            <p className="mb-1">{user?.email}</p>

            <div className="mb-4 mt-2">
                <h3 className="text-sm font-semibold mb-1">Email Verification</h3>
                {user?.isVerified ? (
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">✓ Email verified</p>
                ) : (
                    <div className="p-3 rounded-md border border-yellow-400 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-600 dark:text-yellow-300">
                        <p className="text-sm font-medium mb-2">Your email is not verified. Please check your inbox or resend the verification email.</p>
                        <ResendVerificationButton />
                    </div>
                )}
            </div>

            <button className="mt-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">
                Edit Profile (coming soon)
            </button>
        </>
    );
}
