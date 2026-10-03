import { Fragment } from "react";

import { cn } from "@/shared/lib";

import { permissionColumns, permissionRoles } from "../model";

function Check({ granted }: { granted: boolean }) {
  return (
    <span
      className={cn(
        "block size-3 rounded-check",
        granted ? "bg-accent" : "border border-line-hover",
      )}
    />
  );
}

const sidebarBars = ["w-13/20", "w-3/4", "w-11/20"] as const;

/**
 * Card 01 preview on desktop: an "admin / access / roles" window with a sidebar and the roles
 * table. Decorative; the card hides it from assistive tech.
 */
export function PermissionsPreview({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-95 w-135 shrink-0 flex-col overflow-hidden rounded-panel border border-surface-7 bg-bg",
        className,
      )}
    >
      <div className="flex h-8 items-center gap-1.5 border-b border-line px-3">
        <span className="size-2 rounded-full bg-surface-7" />
        <span className="size-2 rounded-full bg-surface-7" />
        <span className="size-2 rounded-full bg-surface-7" />
        <span className="ms-3 text-micro text-dim">admin / access / roles</span>
      </div>
      <div className="flex flex-1">
        <div className="flex w-30 flex-col gap-2.5 border-e border-line px-3 py-3.5">
          <span className="h-1.75 w-7/10 rounded-sm bg-line-hover" />
          <span className="h-1.75 w-4/5 rounded-sm bg-surface-6" />
          <span className="flex h-5.5 items-center rounded-md bg-surface-3 px-2">
            <span className="h-1.75 w-3/5 rounded-sm bg-accent" />
          </span>
          {sidebarBars.map((width) => (
            <span key={width} className={cn("h-1.75 rounded-sm bg-surface-6", width)} />
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            <span className="text-ui font-medium">Roles &amp; permissions</span>
            <span className="rounded-full bg-fg px-2.5 py-1.25 text-micro text-bg">
              Bulk import
            </span>
          </div>
          <div className="grid grid-cols-28 border-t border-line text-micro text-muted">
            <span className="col-span-8 py-2">ROLE</span>
            {permissionColumns.map((column) => (
              <span key={column} className="col-span-5 py-2">
                {column}
              </span>
            ))}
            {permissionRoles.map(({ role, grants }) => (
              <Fragment key={role}>
                <span className="col-span-8 border-t border-line py-2.25 text-fg">{role}</span>
                {grants.map((granted, column) => (
                  <span
                    key={`${role}-${permissionColumns[column]}`}
                    className="col-span-5 border-t border-line py-2.25"
                  >
                    <Check granted={granted} />
                  </span>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
