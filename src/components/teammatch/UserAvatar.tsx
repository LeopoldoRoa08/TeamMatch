import { useCurrentUser } from "@/lib/UserContext";

interface UserAvatarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-20 w-20 text-2xl",
};

const ringMap = {
  sm: "ring-2",
  md: "ring-2",
  lg: "ring-4",
};

export function UserAvatar({ size = "md", className = "", onClick }: UserAvatarProps) {
  const { avatarUrl, initials } = useCurrentUser();
  const sizeClass = sizeMap[size];
  const ringClass = ringMap[size];

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt="Avatar"
        onClick={onClick}
        className={`${sizeClass} rounded-full object-cover ${ringClass} ring-primary/30 shadow-soft ${onClick ? "cursor-pointer active:scale-95 transition-transform" : ""} ${className}`}
      />
    );
  }

  return (
    <div
      onClick={onClick}
      className={`${sizeClass} grid place-items-center rounded-full gradient-primary font-bold text-secondary shadow-soft ${ringClass} ring-primary/30 ${onClick ? "cursor-pointer active:scale-95 transition-transform" : ""} ${className}`}
    >
      {initials}
    </div>
  );
}
