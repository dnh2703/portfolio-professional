import { cn } from "@/shared/lib";

export type TimelineItemProps = {
  /** Company or institution. */
  title: string;
  /** Replaces `title` on mobile, e.g. `formatEducationShort(item)` → `"PTIT · Multimedia"`. */
  mobileTitle?: string;
  /** Role or program. */
  detail: string;
  /**
   * Hide `detail` on mobile: experience shows only company and dates there, and education
   * folds the program into `mobileTitle`.
   */
  hideDetailOnMobile?: boolean;
  /** Already formatted, e.g. `formatPeriod(item.period)`. Omit for undated entries. */
  period?: string;
  className?: string;
};

/**
 * One entry of the experience/education timeline: a dot on the line, the title, the detail and an
 * optional period. Renders an `<li>`, so wrap the items in an `<ol>`.
 */
export function TimelineItem({
  title,
  mobileTitle,
  detail,
  hideDetailOnMobile = false,
  period,
  className,
}: TimelineItemProps) {
  return (
    <li className={cn("relative border-s border-line ps-5 pb-6 last:pb-0", className)}>
      <span
        aria-hidden="true"
        className="absolute -start-1 top-2 size-2 rounded-full border border-line-strong bg-surface-4"
      />
      <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-4">
        <p className="text-body font-medium text-fg">
          {mobileTitle ? (
            <>
              <span className="md:hidden">{mobileTitle}</span>
              <span className="hidden md:inline">{title}</span>
            </>
          ) : (
            title
          )}
        </p>
        {period ? (
          <p className="shrink-0 font-mono text-meta tracking-wide text-muted uppercase">
            {period}
          </p>
        ) : null}
      </div>
      <p className={cn("text-small text-secondary", hideDetailOnMobile && "hidden md:block")}>
        {detail}
      </p>
    </li>
  );
}
