import { Fragment } from "react";

import { cn } from "@/shared/lib";

import { permissionColumns, permissionRoles } from "../model";

/**
 * Card 01 preview on mobile: just the roles table, without the window chrome. Decorative; the
 * card hides it from assistive tech.
 */
export function PermissionsPreviewCompact({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-50 w-75 flex-col gap-2 rounded-panel-sm border border-surface-1 bg-bg p-3.5",
        className,
      )}
    >
      <span className="flex items-center justify-between text-caption font-medium">
        Roles &amp; permissions
        <span className="rounded-full bg-fg px-2 py-0.75 text-mockup-chip text-bg">Import</span>
      </span>
      <span className="grid grid-cols-28 gap-y-2.25 border-t border-line pt-1.5 text-micro">
        {permissionRoles.map(({ role, grants }) => (
          <Fragment key={role}>
            <span className="col-span-8">{role}</span>
            {grants.map((granted, column) => (
              <span
                key={`${role}-${permissionColumns[column]}`}
                className={cn(
                  "col-span-5 size-2.75 rounded-check",
                  granted ? "bg-accent" : "border border-line-hover",
                )}
              />
            ))}
          </Fragment>
        ))}
      </span>
    </div>
  );
}
