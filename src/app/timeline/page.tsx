import Link from "next/link";
import type { Metadata } from "next";
import { ERAS } from "@/data/timeline";
import { bookBySlug } from "@/lib/bible/books";

export const metadata: Metadata = {
  title: "Biblical timeline",
  description:
    "Where each book lands in biblical history — from the patriarchs to the early church.",
};

export default function TimelinePage() {
  return (
    <div className="mx-auto max-w-[1320px] px-6 lg:px-10 pt-16 pb-24">
      <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10 mb-12">
        <div className="col-span-12 lg:col-span-7">
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            Biblical timeline
          </div>
          <h1 className="serif mt-3 text-[2.75rem] leading-[1.05] tracking-tight text-ink font-semibold">
            Where each book lands.
          </h1>
          <p className="mt-5 text-[1rem] leading-7 text-ink-muted max-w-[58ch]">
            The Bible isn&rsquo;t one story written at one time. These are the
            eras — and the books that come out of each. Dates are conventional
            and contested in places; the headlines tell you where the
            scholarship is honest about the disagreement.
          </p>
        </div>
      </div>

      <ol className="border-t border-rule">
        {ERAS.map((era, idx) => (
          <li
            key={era.id}
            className="grid grid-cols-12 gap-x-6 py-8 border-b border-rule"
          >
            <div className="col-span-12 md:col-span-3">
              <div className="font-mono text-[0.6875rem] text-ink-subtle tabular-nums">
                {String(idx + 1).padStart(2, "0")}
              </div>
              <div className="mt-1.5 text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
                {era.range}
              </div>
              <h2 className="serif mt-2 text-[1.5rem] leading-tight font-semibold text-ink">
                {era.label}
              </h2>
            </div>
            <div className="col-span-12 md:col-span-9">
              <p className="text-[0.9375rem] leading-7 text-ink-muted max-w-[68ch]">
                {era.blurb}
              </p>
              {era.bookSlugs.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
                  {era.bookSlugs.map((slug) => {
                    const b = bookBySlug(slug);
                    if (!b) return null;
                    return (
                      <li key={slug}>
                        <Link
                          href={`/${slug}/1`}
                          className="text-[0.875rem] text-ink hover:text-accent transition-colors border-b border-transparent hover:border-accent"
                        >
                          {b.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
