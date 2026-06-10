import Link from "next/link";
import type { Metadata } from "next";
import { BOOKS } from "@/lib/bible/books";

export const metadata: Metadata = {
  title: "Compare Bible translations side-by-side",
  description:
    "Pick any chapter and read it in two free Bible translations side-by-side, with word-level differences highlighted. BSB vs KJV, NET vs ASV, and 8 more public-domain translations — no signup required.",
};

export default function CompareIndex() {
  const ot = BOOKS.filter((b) => b.testament === "OT");
  const nt = BOOKS.filter((b) => b.testament === "NT");

  return (
    <div className="mx-auto max-w-[1100px] px-6 lg:px-10 pt-16 pb-24">
      <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
        Compare translations
      </div>
      <h1 className="serif mt-3 text-[2.75rem] leading-[1.05] tracking-tight text-ink font-semibold max-w-[22ch]">
        Read it in two translations at once.
      </h1>
      <p className="mt-5 text-[1rem] leading-7 text-ink-muted max-w-[58ch]">
        Pick a chapter. Pick two translations. See where they agree, where they
        diverge, and which words the translators argued over. All free, no
        signup. Defaults to BSB vs KJV — swap from the page.
      </p>

      <div className="mt-12 flex flex-wrap gap-3">
        <QuickStart href="/compare/genesis/1" label="Genesis 1" />
        <QuickStart href="/compare/psalms/23" label="Psalm 23" />
        <QuickStart href="/compare/isaiah/53" label="Isaiah 53" />
        <QuickStart href="/compare/john/1" label="John 1" />
        <QuickStart href="/compare/romans/8" label="Romans 8" />
        <QuickStart href="/compare/1-corinthians/13" label="1 Corinthians 13" />
      </div>

      <div className="mt-16 grid grid-cols-12 gap-x-6 lg:gap-x-10 border-t border-rule pt-10">
        <section className="col-span-12 lg:col-span-6">
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium mb-5">
            Hebrew Bible / Old Testament
          </div>
          <BookList books={ot} />
        </section>
        <section className="col-span-12 lg:col-span-6 mt-12 lg:mt-0">
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium mb-5">
            New Testament
          </div>
          <BookList books={nt} />
        </section>
      </div>
    </div>
  );
}

function QuickStart({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex h-10 items-center px-4 border border-rule-strong text-[0.8125rem] text-ink hover:border-accent hover:text-accent transition-colors"
    >
      {label} →
    </Link>
  );
}

function BookList({ books }: { books: typeof BOOKS }) {
  return (
    <ul className="divide-y divide-rule">
      {books.map((b) => (
        <li key={b.id}>
          <Link
            href={`/compare/${b.slug}/1`}
            className="flex items-baseline justify-between py-2.5 text-[0.9375rem] hover:text-accent transition-colors group"
          >
            <span className="text-ink group-hover:text-accent">{b.name}</span>
            <span className="font-mono text-[0.6875rem] text-ink-subtle">
              {b.chapters} ch
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
