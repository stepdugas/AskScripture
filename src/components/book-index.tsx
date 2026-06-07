import Link from "next/link";
import {
  BOOKS,
  SECTIONS_OT,
  SECTIONS_NT,
  booksInSection,
  type BookSection,
} from "@/lib/bible/books";

export function BookIndex() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
      <Testament label="Old Testament" sections={SECTIONS_OT} />
      <Testament label="New Testament" sections={SECTIONS_NT} />
    </div>
  );
}

function Testament({
  label,
  sections,
}: {
  label: string;
  sections: BookSection[];
}) {
  return (
    <div>
      <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium mb-4 pb-3 border-b border-rule">
        {label}
      </div>
      <div className="space-y-6">
        {sections.map((s) => (
          <SectionGroup key={s} section={s} />
        ))}
      </div>
    </div>
  );
}

function SectionGroup({ section }: { section: BookSection }) {
  const books = booksInSection(section);
  return (
    <div className="grid grid-cols-[140px_1fr] gap-x-6 items-baseline">
      <div className="serif italic text-[0.8125rem] text-ink-muted">
        {section}
      </div>
      <ul className="text-[0.875rem]">
        {books.map((b) => (
          <li key={b.id} className="leading-7">
            <Link
              href={`/${b.slug}/1`}
              className="text-ink hover:text-accent transition-colors"
            >
              {b.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Re-export for convenience
export { BOOKS };
