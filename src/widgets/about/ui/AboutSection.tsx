import { Section } from "@/shared/ui";

import { CareerColumn } from "./CareerColumn";
import { CompactCareerList } from "./CompactCareerList";
import { PracticeColumn } from "./PracticeColumn";
import { StackTags } from "./StackTags";

const HEADING_ID = "about-heading";

/**
 * The about section (`#about`): label, lead, then experience/education and "How I work" on the
 * 12-column grid. Mobile is one column with a compact career list and stack tags instead.
 */
export function AboutSection() {
  return (
    <Section id="about" aria-labelledby={HEADING_ID}>
      <div className="page-grid gap-y-6 md:gap-y-20">
        <h2
          id={HEADING_ID}
          className="col-span-full text-meta font-normal text-muted uppercase md:col-span-3 md:text-small"
        >
          <span aria-hidden="true">(</span>About<span aria-hidden="true">)</span>
        </h2>
        <p className="col-span-full text-statement-sm text-fg md:col-span-9 md:col-start-4 md:text-statement">
          Nearly three years shipping data-heavy products
          <span className="hidden md:inline"> for enterprise teams</span>. I care about the last
          10%: the RTL edge case, the <em className="font-serif text-accent italic">first paint</em>
          .
        </p>
        <CareerColumn className="hidden md:col-span-4 md:col-start-4 md:flex" />
        <PracticeColumn className="hidden md:col-span-4 md:col-start-9 md:flex" />
        <CompactCareerList className="col-span-full md:hidden" />
        <StackTags className="col-span-full md:hidden" />
      </div>
    </Section>
  );
}
