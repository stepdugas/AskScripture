import Link from "next/link";
import type { Metadata } from "next";
import { READING_PLANS } from "@/data/reading-plans";

export const metadata: Metadata = {
  title: "Reading plans",
  description:
    "Curated Bible reading plans — Gospels in 30 days, Psalms, Romans, Wisdom Literature, Torah Foundations.",
};

export default function PlansIndex() {
  return (
    <>
    <div className="mx-auto max-w-[1320px] px-6 lg:px-10 pt-16 pb-24">
          <div className="grid grid-cols-12 gap-x-10 mb-12">
            <div className="col-span-12 lg:col-span-7">
              <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
                Reading plans
              </div>
              <h1 className="serif mt-3 text-[2.75rem] leading-[1.05] tracking-tight text-ink font-semibold">
                A reading plan that respects the text.
              </h1>
              <p className="mt-5 text-[1rem] leading-7 text-ink-muted max-w-[58ch]">
                Plans here move at a pace where each day's reading can actually
                land. They group chapters with thematic intent, not just by
                page count.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10 gap-y-8 border-t border-rule pt-8">
            {READING_PLANS.map((p) => (
              <Link
                key={p.id}
                href={`/plans/${p.id}`}
                className="col-span-12 md:col-span-6 group block"
              >
                <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
                  {p.duration}
                  <span className="mx-2 text-rule-strong">/</span>
                  {p.intensity}
                </div>
                <h2 className="serif mt-2 text-[1.5rem] leading-tight font-semibold text-ink group-hover:text-accent transition-colors">
                  {p.title}
                </h2>
                <p className="mt-2 text-[0.9375rem] leading-6 text-ink-muted max-w-[52ch]">
                  {p.blurb}
                </p>
              </Link>
            ))}
          </div>
        </div>
    </>
  );
}
