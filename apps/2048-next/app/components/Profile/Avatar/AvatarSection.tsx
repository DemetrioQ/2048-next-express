

// AvatarSection.tsx
import { useState } from 'react';
import CropUploadModal from '@/components/Profile/Avatar/CropUploadModal';
import { useAuth } from '@/context/AuthContext';

export default function AvatarSection() {
    const { user, refreshUser } = useAuth();
    const [modalOpen, setModalOpen] = useState(false);

    if (!user) return null;

    return (
        <>
            <div className="flex flex-col items-center mb-8 relative group cursor-pointer w-fit mx-auto"
                onClick={() => setModalOpen(true)}>
                {user.avatar.imageUrl ? (
                    <img
                        src={user.avatar.imageUrl}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full object-cover transition-opacity"
                    />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-3xl font-bold">
                        {user.email?.[0]?.toUpperCase()}
                    </div>
                )}
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity px-2 text-white text-center text-xs">
                    Click to edit picture
                </div>
            </div>

            <CropUploadModal
                open={modalOpen}
                setOpen={setModalOpen}
                onComplete={async (url, fileKey) => {
                    //call update avatar url
                    await refreshUser?.();
                }}
            />
        </>
    );
}
