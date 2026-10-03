import type { ReactNode } from "react";

import { formatProjectIndex, projects, type Project } from "@/entities/project";
import { Section } from "@/shared/ui";

import { AskPlaceholderButton } from "./AskPlaceholderButton";
import { BookingPreview } from "./BookingPreview";
import { FeaturedProject } from "./FeaturedProject";
import { PermissionsPreview } from "./PermissionsPreview";
import { PermissionsPreviewCompact } from "./PermissionsPreviewCompact";
import { ProjectRow } from "./ProjectRow";

/**
 * Renders a card's action: a button that the card stretches over its whole area. `describedBy`
 * is the id of the project's name, for the button's `aria-describedby`.
 */
export type RenderProjectAction = (project: Project, options: { describedBy: string }) => ReactNode;

export type SelectedWorkProps = {
  /** Card action. Defaults to a no-op placeholder until the ask-assistant trigger lands (POR-15). */
  renderAction?: RenderProjectAction;
};

const renderPlaceholderAction: RenderProjectAction = (_project, { describedBy }) => (
  <AskPlaceholderButton describedBy={describedBy} />
);

const previews: Record<string, { preview: ReactNode; tone: "dark" | "accent" }> = {
  p01: {
    tone: "dark",
    preview: (
      <>
        <PermissionsPreview className="hidden md:flex" />
        <PermissionsPreviewCompact className="flex md:hidden" />
      </>
    ),
  },
  p02: { tone: "accent", preview: <BookingPreview /> },
};

/** Projects shown as large cards: the first two on desktop, only the first on mobile. */
const FEATURED_DESKTOP = 2;
const FEATURED_MOBILE = 1;

/**
 * "Selected work" (`#work`): large preview cards for the first projects, then a numbered list.
 * Every card and row is one button that asks the assistant about that project.
 */
export function SelectedWork({ renderAction = renderPlaceholderAction }: SelectedWorkProps) {
  const count = formatProjectIndex(projects.length);
  const featured = projects.slice(0, FEATURED_DESKTOP);
  const rows = projects.slice(FEATURED_MOBILE);

  return (
    <Section id="work" aria-labelledby="work-heading">
      <div className="page-grid">
        <div className="col-span-full flex flex-col gap-6 md:gap-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 id="work-heading" className="text-h2-mobile font-medium md:text-display-sm">
              Selected <span className="font-serif font-normal italic">work</span>
            </h2>
            <p className="text-meta text-muted md:text-small md:uppercase">
              <span className="md:hidden">Tap to ask · ({count})</span>
              <span className="hidden md:inline">
                Tap a project to ask my assistant · ({count})
              </span>
            </p>
          </div>

          <ul className="grid gap-6 md:grid-cols-2">
            {featured.map((project, index) => {
              const nameId = `work-${project.id}-card-name`;
              const { preview = null, tone = "dark" } = previews[project.id] ?? {};
              return (
                <FeaturedProject
                  key={project.id}
                  project={project}
                  nameId={nameId}
                  preview={preview}
                  tone={tone}
                  action={renderAction(project, { describedBy: nameId })}
                  className={index < FEATURED_MOBILE ? "flex" : "hidden md:flex"}
                />
              );
            })}
          </ul>

          <ul className="flex flex-col border-t border-line">
            {rows.map((project, index) => {
              const nameId = `work-${project.id}-row-name`;
              return (
                <ProjectRow
                  key={project.id}
                  project={project}
                  nameId={nameId}
                  action={renderAction(project, { describedBy: nameId })}
                  className={index + FEATURED_MOBILE < FEATURED_DESKTOP ? "flex md:hidden" : "flex"}
                />
              );
            })}
          </ul>
        </div>
      </div>
    </Section>
  );
}
