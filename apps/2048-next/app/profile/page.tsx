// ProfilePage.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import AvatarSection from '@/components/Profile/Avatar/AvatarSection';
import ProfileTabs from '@/components/Profile/Tabs/ProfileTabs';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return <div className="p-6">You must be logged in to view this page.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <AvatarSection />
      <ProfileTabs />
    </div>
  );
}
