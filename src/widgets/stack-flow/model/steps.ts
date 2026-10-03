/** One stop on the request's path, from the checkbox in the UI to the deploy. */
export type FlowStep = {
  /** Layer name, shown in the step label: "01 · Interface". */
  name: string;
  /** Step heading, e.g. "What the user touches". */
  title: string;
  /** What happens to the request at this step, as on the 1440 board. */
  text: string;
  /** Shorter text for the 390 board. */
  shortText: string;
};

export const flowSteps: readonly FlowStep[] = [
  {
    name: "Interface",
    title: "What the user touches",
    text: "A checkbox flips in the permissions table, built to stay fast with thousands of rows.",
    shortText: "A checkbox flips in the permissions table, fast even with thousands of rows.",
  },
  {
    name: "State",
    title: "What the app remembers",
    text: "The UI updates instantly, the input is validated, and the cache refreshes when the server confirms.",
    shortText: "The UI updates instantly and the cache refreshes when the server confirms.",
  },
  {
    name: "API",
    title: "What checks the request",
    text: "A typed call reaches a guarded endpoint. Expired SSO tokens refresh without the user noticing.",
    shortText: "A typed call reaches a guarded endpoint. Expired SSO tokens refresh silently.",
  },
  {
    name: "Data",
    title: "Where it lands",
    text: "The permission is saved and an entry goes into the activity log.",
    shortText: "The permission is saved and an entry goes into the activity log.",
  },
  {
    name: "Ship",
    title: "How it stays working",
    text: "Playwright replays the flow, CI blocks the merge if anything breaks, then it deploys.",
    shortText: "Playwright replays the flow, CI blocks a broken merge, then it deploys.",
  },
];

/** How a step is highlighted: the first is cream, the last is accent, the ones between are plain. */
export type StepTone = "start" | "middle" | "end";

export function stepTone(index: number, count: number): StepTone {
  if (index === 0) return "start";
  if (index === count - 1) return "end";
  return "middle";
}
