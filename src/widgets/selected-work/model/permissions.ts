/** Column headings of the permissions-table preview on card 01. */
export const permissionColumns = ["VIEW", "EDIT", "EXPORT", "ADMIN"] as const;

/** Rows of the permissions-table preview: one flag per column in `permissionColumns`. */
export const permissionRoles = [
  { role: "Owner", grants: [true, true, true, true] },
  { role: "Manager", grants: [true, true, true, false] },
  { role: "Editor", grants: [true, true, false, false] },
  { role: "Viewer", grants: [true, false, false, false] },
] as const;
