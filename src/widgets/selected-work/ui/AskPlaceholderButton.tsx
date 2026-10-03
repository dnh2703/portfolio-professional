/** Accessible name of every project card's action, as in the design. */
export const askProjectLabel = "Ask my assistant about this project";

/**
 * Temporary card action until POR-15 provides the ask-assistant trigger: a real, focusable button
 * that does nothing yet. The card stretches it over its whole area.
 */
export function AskPlaceholderButton({ describedBy }: { describedBy: string }) {
  return (
    <button
      type="button"
      aria-label={askProjectLabel}
      aria-describedby={describedBy}
      className="cursor-pointer"
    />
  );
}
