import Link from "next/link";
import type { CanonicalBook } from "@/lib/bible/books";

type Props = {
  book: CanonicalBook;
  currentChapter: number;
};

export function ChapterNav({ book, currentChapter }: Props) {
  return (
    <nav aria-label={`Chapters in ${book.name}`}>
      <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium mb-3">
        {book.name}
      </div>
      <ul className="grid grid-cols-5 gap-y-1 gap-x-1 -ml-1">
        {Array.from({ length: book.chapters }, (_, i) => i + 1).map((n) => {
          const active = n === currentChapter;
          return (
            <li key={n}>
              <Link
                href={`/${book.slug}/${n}`}
                aria-current={active ? "page" : undefined}
                className={
                  "block text-center text-[0.75rem] font-sans tabular-nums py-1 rounded-sm transition-colors " +
                  (active
                    ? "bg-accent text-paper font-medium"
                    : "text-ink-muted hover:bg-paper-2 hover:text-ink")
                }
              >
                {n}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
