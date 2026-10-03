/** One "How I work" practice: a short lead in primary text, then the detail. */
export type Practice = {
  id: string;
  lead: string;
  detail: string;
};

/** `filled` is cream, `accent` is orange, `outlined` has only a border. */
export type StackTagTone = "filled" | "outlined" | "accent";

export type StackTag = {
  label: string;
  tone: StackTagTone;
};

export const practices = [
  {
    id: "spec-driven",
    lead: "Spec-driven, AI-assisted.",
    detail:
      "Claude Code from requirements to verification, with parallel agents in git worktrees and a human approval at every stage.",
  },
  {
    id: "architecture",
    lead: "Architecture that decouples.",
    detail:
      "Feature-based and Feature-Sliced structures; screens run on mock data and switch to real APIs unchanged.",
  },
  {
    id: "testing",
    lead: "Tested end to end.",
    detail:
      "Vitest, Playwright and Storybook cover the app from units to visuals, with static analysis in CI.",
  },
] as const satisfies readonly Practice[];

export const offScreen = "Running, badminton, gaming.";

/** The stack tags shown on mobile instead of "How I work", in design order. */
export const stackTags = [
  { label: "TypeScript", tone: "filled" },
  { label: "React", tone: "filled" },
  { label: "Next.js", tone: "filled" },
  { label: "TanStack Query", tone: "outlined" },
  { label: "Tailwind", tone: "outlined" },
  { label: "Radix UI", tone: "outlined" },
  { label: "NestJS", tone: "outlined" },
  { label: "PostgreSQL", tone: "outlined" },
  { label: "Playwright", tone: "outlined" },
  { label: "Claude Code", tone: "accent" },
] as const satisfies readonly StackTag[];
