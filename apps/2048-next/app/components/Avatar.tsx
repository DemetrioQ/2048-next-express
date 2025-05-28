// components/Avatar.tsx
import Image from "next/image";
import Link from "next/link";
import { PublicUser } from "shared-2048-logic/types/User";

type AvatarProps = {
  user: PublicUser;
};
export default function Avatar({user} : AvatarProps) {
  const initial = user.email?.[0]?.toUpperCase() ?? "?";

  const avatarContent = user ? (
    <Image
      src={user.avatar.imageUrl}
      alt="User Avatar"
      width={35}
      height={35}
      className="rounded-full"
    />
  ) : (
    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-bold">
      {initial}
    </div>
  );

  return (
    <Link href="/profile" className="block rounded-full hover:opacity-80 transition">
      {avatarContent}
    </Link>
  );
}
