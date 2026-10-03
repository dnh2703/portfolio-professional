import { Avatar } from "@/shared/ui";
import { cn } from "@/shared/lib";

/** `dark` is the live launcher on the dark site; `light` sits on cream grounds at 56 or 40 px. */
type Variant = "dark-64" | "light-56" | "light-40";

const variants: Record<
  Variant,
  { disc: string; image: number; badge: string; dot: string | null; gap: string }
> = {
  "dark-64": {
    disc: "size-16 bg-fg",
    image: 56,
    badge: "-top-1.25 -right-1.75 h-7 min-w-7 border-3 border-bg",
    dot: "size-1",
    gap: "gap-0.75",
  },
  "light-56": {
    disc: "size-14 border-2 border-bg bg-paper",
    image: 48,
    badge: "-top-1.25 -right-1.5 h-6 min-w-6 border-3 border-fg",
    dot: "size-0.75",
    gap: "gap-0.5",
  },
  "light-40": {
    disc: "size-10 border-2 border-bg bg-paper",
    image: 34,
    badge: "-top-1 -right-1.25 h-4 min-w-4 border-2 border-fg",
    dot: null,
    gap: "",
  },
};

export type LauncherAvatarProps = {
  variant?: Variant;
  /** Animates the badge dots while a reply is being typed. */
  typing?: boolean;
  /** Shows the count instead of the dots when above 0. */
  unread?: number;
};

/**
 * The chat avatar on its disc with the orange badge ("Chat launcher · states" board). Purely
 * visual: the launcher button carries the accessible name, typing and unread state.
 */
export function LauncherAvatar({ variant = "dark-64", typing, unread = 0 }: LauncherAvatarProps) {
  const style = variants[variant];
  const dots = style.dot && unread === 0;

  return (
    <span aria-hidden="true" className="relative block">
      <span
        className={cn("flex items-center justify-center overflow-hidden rounded-full", style.disc)}
      >
        <Avatar size={style.image} variant="chat" />
      </span>
      <span
        data-badge={unread > 0 ? "unread" : typing ? "typing" : "idle"}
        className={cn(
          "absolute flex items-center justify-center rounded-full bg-accent text-small text-bg",
          unread > 0 && "px-1",
          style.badge,
          style.gap,
        )}
      >
        {unread > 0 ? unread : null}
        {dots
          ? [0, 150, 300].map((delay) => (
              <span
                key={delay}
                className={cn("rounded-full bg-bg", style.dot, typing && "motion-safe:animate-bop")}
                style={typing ? { animationDelay: `${delay}ms` } : undefined}
              />
            ))
          : null}
      </span>
    </span>
  );
}
