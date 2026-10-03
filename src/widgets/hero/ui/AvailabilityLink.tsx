import { cn } from "@/shared/lib";

type AvailabilityLinkProps = {
  className?: string;
};

/**
 * Full-width "Available for projects" pill that jumps to the contact section. The accent dot
 * pulses only without `prefers-reduced-motion`. On desktop the status lives in the site header.
 */
export function AvailabilityLink({ className }: AvailabilityLinkProps) {
  return (
    <a
      href="#contact"
      className={cn(
        "flex h-13 w-full items-center justify-center gap-2.5 rounded-full bg-fg text-body-lg font-medium text-bg",
        className,
      )}
    >
      <span aria-hidden="true" className="relative inline-flex size-2">
        <span className="absolute inset-0 rounded-full bg-accent opacity-75 motion-safe:animate-ping" />
        <span className="relative size-2 rounded-full bg-accent" />
      </span>
      Available for projects
    </a>
  );
}
