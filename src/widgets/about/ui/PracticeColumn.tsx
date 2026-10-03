import { cn } from "@/shared/lib";

import { offScreen, practices } from "../model";
import { GroupHeading } from "./GroupHeading";

type PracticeColumnProps = {
  className?: string;
};

/** Desktop: "How I work" and "Off-screen". */
export function PracticeColumn({ className }: PracticeColumnProps) {
  return (
    <div className={cn("flex-col gap-5", className)}>
      <GroupHeading>How I work</GroupHeading>
      <div className="flex flex-col gap-5 text-lead text-secondary">
        {practices.map((practice) => (
          <p key={practice.id}>
            <span className="text-fg">{practice.lead}</span> {practice.detail}
          </p>
        ))}
      </div>
      <GroupHeading className="mt-5">Off-screen</GroupHeading>
      <p className="text-lead text-secondary">{offScreen}</p>
    </div>
  );
}
