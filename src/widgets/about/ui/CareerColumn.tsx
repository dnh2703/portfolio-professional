import { education, experience, formatPeriod } from "@/entities/experience";
import { cn } from "@/shared/lib";

import { GroupHeading } from "./GroupHeading";

type CareerColumnProps = {
  className?: string;
};

const LIST = "flex flex-col border-t border-line";
const ROW = "border-b border-line py-5";

/** Desktop: the full experience and education lists. */
export function CareerColumn({ className }: CareerColumnProps) {
  return (
    <div className={cn("flex-col gap-5", className)}>
      <GroupHeading>Experience</GroupHeading>
      <ul className={LIST}>
        {experience.map((item) => (
          <li key={item.id} className={cn(ROW, "flex justify-between gap-4")}>
            <span className="flex flex-col gap-1">
              <span className="text-title font-medium text-fg">{item.company}</span>
              <span className="text-body text-muted">{item.role}</span>
            </span>
            <span className="shrink-0 text-small text-muted">{formatPeriod(item.period)}</span>
          </li>
        ))}
      </ul>
      <GroupHeading className="mt-5">Education</GroupHeading>
      <ul className={LIST}>
        {education.map((item) => (
          <li key={item.id} className={cn(ROW, "flex flex-col gap-1")}>
            <span className="text-title font-medium text-fg">{item.institution}</span>
            <span className="text-body text-muted">{item.program}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
