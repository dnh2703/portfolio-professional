import { cn } from "@/shared/lib";

import { stackTags } from "../model";
import type { StackTagTone } from "../model";

type StackTagsProps = {
  className?: string;
};

const TONE: Record<StackTagTone, string> = {
  filled: "bg-fg text-bg",
  accent: "bg-accent text-bg",
  outlined: "border border-surface-7 text-fg",
};

/** Mobile: the stack as a wrap of pill tags; the core three are filled, Claude Code in accent. */
export function StackTags({ className }: StackTagsProps) {
  return (
    <div className={className}>
      <h3 className="sr-only">Stack</h3>
      <ul className="flex flex-wrap gap-2">
        {stackTags.map((tag) => (
          <li key={tag.label} className={cn("rounded-full px-3 py-2 text-small", TONE[tag.tone])}>
            {tag.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
