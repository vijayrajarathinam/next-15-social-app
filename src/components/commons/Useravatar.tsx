import Image from "next/image";
import AvatarPlaceholdeer from "@/assets/avatar-placeholder.png";
import { cn } from "@/lib/utils";

interface UseravatarProps {
  avatarUrl: string | null | undefined;
  size?: number;
  className?: string;
}
export default function Useravatar({
  avatarUrl,
  className,
  size,
}: UseravatarProps) {
  return (
    <Image
      width={size ?? 48}
      height={size ?? 48}
      alt="user profile picture"
      src={avatarUrl || AvatarPlaceholdeer}
      className={cn(
        "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
        className,
      )}
    />
  );
}
