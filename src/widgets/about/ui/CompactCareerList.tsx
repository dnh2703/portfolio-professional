import { education, experience, formatEducationShort, formatPeriod } from "@/entities/experience";

type CompactCareerListProps = {
  className?: string;
};

type Row = {
  id: string;
  title: string;
  meta: string;
};

/** Mobile: one list of the roles and the first degree, title on the left, dates on the right. */
export function CompactCareerList({ className }: CompactCareerListProps) {
  const [degree] = education;
  const rows: Row[] = [
    ...experience.map((item) => ({
      id: item.id,
      title: item.company,
      meta: formatPeriod(item.period),
    })),
    { id: degree.id, title: formatEducationShort(degree), meta: "Education" },
  ];

  return (
    <div className={className}>
      <h3 className="sr-only">Experience and education</h3>
      <ul className="flex flex-col border-t border-line">
        {rows.map((row) => (
          <li
            key={row.id}
            className="flex items-baseline justify-between gap-4 border-b border-line py-4"
          >
            <span className="text-body-lg font-medium text-fg">{row.title}</span>
            <span className="shrink-0 text-caption text-muted">{row.meta}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
