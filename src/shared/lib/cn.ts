/**
 * Joins class names, skipping falsy values: `cn("a", isOn && "b")`.
 * It does not resolve conflicting Tailwind utilities, so don't pass two values for one property.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
