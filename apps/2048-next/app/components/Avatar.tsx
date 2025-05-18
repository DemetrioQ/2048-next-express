import Image from "next/image";

interface AvatarProps {
  user: {
    email: string;
    avatarUrl?: string;
  };
}

export default function Avatar({ user }: AvatarProps) {
  const initial = user.email?.[0]?.toUpperCase() ?? "?";

  return user.avatarUrl ? (
    <Image
      src={user.avatarUrl}
      alt="User Avatar"
      width={35}
      height={35}
      className="rounded-full"
    />
  ) : (
    <div className="w-8 h-8 rounded-fullte flex items-center justify-center font-bold">
      {initial}
    </div>
  );
}
