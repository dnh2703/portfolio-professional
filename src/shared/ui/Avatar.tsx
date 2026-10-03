import Image from "next/image";

import { cn } from "@/shared/lib";

const sources = {
  logo: "/avatar.png",
  chat: "/avatar-chat.png",
} as const;

export type AvatarProps = {
  /** Diameter in px. */
  size: number;
  /** `logo` for the site identity, `chat` for the assistant (nose toned to skin). */
  variant?: keyof typeof sources;
  /** Leave empty when a visible name sits next to the avatar. */
  alt?: string;
  /** Set for the above-the-fold instance (header logo). */
  preload?: boolean;
  className?: string;
};

/**
 * Johnny's avatar, always on the cream disc. The images live in `public/` (`avatar.png`,
 * `avatar-chat.png`) so the real exports can replace the placeholders without code changes.
 */
export function Avatar({ size, variant = "logo", alt = "", preload, className }: AvatarProps) {
  return (
    <span
      className={cn("inline-flex shrink-0 overflow-hidden rounded-full bg-fg", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={sources[variant]}
        alt={alt}
        width={size}
        height={size}
        preload={preload}
        className="size-full object-cover"
      />
    </span>
  );
}
