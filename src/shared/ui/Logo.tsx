import { cn } from "@/shared/lib";

import { Avatar } from "./Avatar";

export type LogoProps = {
  /** Avatar diameter in px. */
  avatarSize?: number;
  /** Preload the avatar image when the logo is above the fold. */
  preload?: boolean;
  className?: string;
};

/**
 * Logo lockup: avatar on the cream disc, "Johnny" in Geist 500, "Dang" in Instrument Serif italic
 * and an accent dot. Not a link by itself; wrap it in one where it navigates.
 */
export function Logo({ avatarSize = 28, preload, className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-title text-fg", className)}>
      <Avatar size={avatarSize} preload={preload} />
      <span className="leading-none">
        <span className="font-medium tracking-tight">Johnny</span>{" "}
        <span className="font-serif italic">Dang</span>
        <span aria-hidden="true" className="ms-0.5 inline-block size-1.5 rounded-full bg-accent" />
      </span>
    </span>
  );
}
