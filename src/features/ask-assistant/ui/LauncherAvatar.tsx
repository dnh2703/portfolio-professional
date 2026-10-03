import { Avatar } from "@/shared/ui";
import { cn } from "@/shared/lib";

/**
 * `dark` is the live launcher on the dark site: 40 px on mobile, 48 px from `md`, so it stays
 * smaller than the header logo (44 / 52 px). `light` sits on cream grounds at 56 or 40 px.
 */
type Variant = "dark" | "light-56" | "light-40";

type VariantStyle = {
  disc: string;
  /** Avatar image sizes; two entries render one per breakpoint (mobile first). */
  images: readonly [number] | readonly [number, number];
  /** Badge when idle: a plain dot. */
  dot: string;
  /** Badge when typing or unread: a pill that fits the dots or the count. */
  pill: string;
  /** Size of each typing dot, or null when the variant is too small for dots. */
  typingDot: string | null;
  gap: string;
  count: string;
};

const variants: Record<Variant, VariantStyle> = {
  dark: {
    disc: "size-10 bg-fg md:size-12",
    images: [34, 42],
    dot: "-top-0.5 -right-0.5 size-2.5 border-2 border-bg md:size-3",
    pill: "-top-1 -right-1.5 h-4.5 min-w-4.5 border-2 border-bg md:h-5 md:min-w-5",
    typingDot: "size-0.75",
    gap: "gap-0.5",
    count: "text-micro",
  },
  "light-56": {
    disc: "size-14 border-2 border-bg bg-paper",
    images: [48],
    dot: "-top-0.5 -right-0.5 size-3.5 border-2 border-fg",
    pill: "-top-1.25 -right-1.5 h-6 min-w-6 border-3 border-fg",
    typingDot: "size-0.75",
    gap: "gap-0.5",
    count: "text-small",
  },
  "light-40": {
    disc: "size-10 border-2 border-bg bg-paper",
    images: [34],
    dot: "-top-0.5 -right-0.5 size-2.5 border-2 border-fg",
    pill: "-top-1 -right-1.25 h-4 min-w-4 border-2 border-fg",
    typingDot: null,
    gap: "",
    count: "text-micro",
  },
};

export type LauncherAvatarProps = {
  variant?: Variant;
  /** Shows animated dots in the badge while a reply is being typed. */
  typing?: boolean;
  /** Shows the count in the badge when above 0. */
  unread?: number;
};

/**
 * The chat avatar on its disc with the orange badge ("Chat launcher · states" board): a plain
 * dot when idle, animated dots while a reply is typed, the count when replies are unread.
 * Purely visual: the launcher button carries the accessible name, typing and unread state.
 */
export function LauncherAvatar({ variant = "dark", typing, unread = 0 }: LauncherAvatarProps) {
  const style = variants[variant];
  const state = unread > 0 ? "unread" : typing ? "typing" : "idle";
  const [mobileImage, desktopImage] = style.images;

  return (
    <span aria-hidden="true" className="relative block">
      <span
        className={cn("flex items-center justify-center overflow-hidden rounded-full", style.disc)}
      >
        <Avatar
          size={mobileImage}
          variant="chat"
          className={desktopImage ? "md:hidden" : undefined}
        />
        {desktopImage ? (
          <Avatar size={desktopImage} variant="chat" className="max-md:hidden" />
        ) : null}
      </span>
      <span
        data-badge={state}
        className={cn(
          "absolute flex items-center justify-center rounded-full bg-accent text-bg",
          state === "idle" ? style.dot : style.pill,
          state === "unread" && cn("px-1", style.count),
          state === "typing" && style.gap,
        )}
      >
        {state === "unread" ? unread : null}
        {state === "typing" && style.typingDot
          ? [0, 150, 300].map((delay) => (
              <span
                key={delay}
                className={cn("rounded-full bg-bg motion-safe:animate-bop", style.typingDot)}
                style={{ animationDelay: `${delay}ms` }}
              />
            ))
          : null}
      </span>
    </span>
  );
}
