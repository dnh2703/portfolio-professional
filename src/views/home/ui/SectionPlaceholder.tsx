import { Section } from "@/shared/ui";

type SectionPlaceholderProps = {
  id: string;
  title: string;
  /** The ticket that replaces this placeholder. */
  ticket: string;
};

/** Empty section shell shown until the section's widget lands. */
export function SectionPlaceholder({ id, title, ticket }: SectionPlaceholderProps) {
  const headingId = `${id}-heading`;
  return (
    <Section id={id} aria-labelledby={headingId}>
      <div className="page-grid">
        <p className="col-span-full font-mono text-meta text-muted uppercase md:col-span-3">
          {ticket}
        </p>
        <h2 id={headingId} className="col-span-full text-h2 md:col-span-9">
          {title}
        </h2>
      </div>
    </Section>
  );
}
