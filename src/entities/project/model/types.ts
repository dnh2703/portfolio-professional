/** Calendar years a project ran. Leave `end` out for a single year. */
export type ProjectYears = {
  start: number;
  end?: number;
};

export type Project = {
  /** Stable id, e.g. `"p01"`. Also the key the assistant uses for "ask about this project". */
  id: string;
  /** Position in the list, shown as `01`…`05`. */
  index: number;
  name: string;
  /** One line under the name on desktop. */
  description: string;
  /** Shorter line used on mobile instead of `description`. */
  shortDescription: string;
  /** Where the work was done: the employer, or `Fullstack` for a personal project. */
  context: string;
  years: ProjectYears;
  /** The paragraph the assistant answers with when asked about this project. */
  assistantSummary: string;
};
