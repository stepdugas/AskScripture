import Link from "next/link";
import { BookIndex } from "@/components/book-index";
import { ReferenceSearch } from "@/components/reference-search";

export default function HomePage() {
  return (
    <>
    {/* Hero — editorial two-column */}
        <section className="border-b border-rule">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-20 lg:py-28">
            <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10">
              <div className="col-span-12 lg:col-span-6">
                <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
                  A study tool, not a sermon
                </div>
                <h1 className="serif mt-4 text-[2.75rem] lg:text-[3.5rem] leading-[1.02] tracking-tight text-ink font-semibold">
                  Read the Bible with context,
                  <br />
                  not commentary.
                </h1>
                <p className="mt-6 text-[1.0625rem] leading-7 text-ink-muted max-w-[44ch]">
                  AskScripture sets every passage next to its translations, its
                  original-language words, and its historical setting. You
                  decide what it means.
                </p>
                <div className="mt-8 max-w-[480px]">
                  <ReferenceSearch />
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8125rem] text-ink-muted">
                  <span className="text-ink-subtle">Try:</span>
                  <Link href="/john/3" className="hover:text-accent">
                    John 3
                  </Link>
                  <Link href="/psalms/23" className="hover:text-accent">
                    Psalm 23
                  </Link>
                  <Link href="/romans/8" className="hover:text-accent">
                    Romans 8
                  </Link>
                  <Link href="/word-study" className="hover:text-accent">
                    Translation debates
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block col-span-5 col-start-8">
                <SamplePassage />
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities — editorial 3-col grid */}
        <section className="border-b border-rule">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-20">
            <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10 mb-12 items-end">
              <h2 className="col-span-12 lg:col-span-6 serif text-[2rem] leading-tight tracking-tight text-ink font-semibold">
                What's on the page.
              </h2>
              <p className="col-span-12 lg:col-span-5 lg:col-start-8 text-[0.9375rem] leading-6 text-ink-muted">
                Every chapter view brings the tools that scholars use into the
                margins of an ordinary read-through.
              </p>
            </div>
            <div className="grid grid-cols-12 gap-x-6 gap-y-12 lg:gap-x-10">
              <Capability
                index="01"
                title="Side-by-side translations"
                body="Compare any two of ten free translations line by line. Differences are diffed inline so you can see exactly where translators diverged."
                href="/compare/john/1"
              />
              <Capability
                index="02"
                title="Translation debates"
                body="Where a translation makes a contested theological choice — arsenokoitai, kephalē, almah, monogenēs — a marker opens the full debate."
                href="/word-study"
              />
              <Capability
                index="03"
                title="Cross-references"
                body="340,000 cross-references from the Treasury of Scripture Knowledge, weighted by community votes."
                href="/genesis/1"
              />
              <Capability
                index="04"
                title="Study chat"
                body="Six modes — Objective, Scholarly, Devotional, Affirming, Storytelling, and Kids — let you choose how an answer is framed."
                href="/chat"
              />
              <Capability
                index="05"
                title="Generated content"
                body="Personal devotionals, family devotionals, and sermon outlines from any passage, written to your preferences."
                href="/generate/devotional"
              />
              <Capability
                index="06"
                title="Reading plans"
                body="Curated plans paced for actual reading — Gospels in 30 days, Romans in 14, Torah foundations, Wisdom literature."
                href="/plans"
              />
            </div>
          </div>
        </section>

        {/* Book index */}
        <section>
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-20">
            <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10 mb-12 items-end">
              <h2 className="col-span-12 lg:col-span-6 serif text-[2rem] leading-tight tracking-tight text-ink font-semibold">
                Begin anywhere.
              </h2>
              <p className="col-span-12 lg:col-span-5 lg:col-start-8 text-[0.9375rem] leading-6 text-ink-muted">
                Sixty-six books, grouped the way scholars group them. Pick one.
              </p>
            </div>
            <BookIndex />
          </div>
        </section>
    </>
  );
}

function Capability({
  index,
  title,
  body,
  href,
}: {
  index: string;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="col-span-12 md:col-span-6 lg:col-span-4 group block"
    >
      <div className="grid grid-cols-[2.25rem_1fr] gap-x-3 items-baseline">
        <div className="font-mono text-[0.6875rem] text-ink-subtle tabular-nums pt-1">
          {index}
        </div>
        <div>
          <h3 className="serif text-[1.125rem] font-semibold text-ink leading-snug group-hover:text-accent transition-colors">
            {title} &rarr;
          </h3>
          <p className="mt-2 text-[0.9375rem] leading-6 text-ink-muted">
            {body}
          </p>
        </div>
      </div>
    </Link>
  );
}

function SamplePassage() {
  return (
    <div className="border-l-2 border-accent pl-6 py-2">
      <div className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle">
        John 1:1 · Three translations
      </div>
      <div className="mt-4 space-y-5">
        <Sample
          label="BSB"
          text="In the beginning was the Word, and the Word was with God, and the Word was God."
        />
        <Sample
          label="WEB"
          text="In the beginning was the Word, and the Word was with God, and the Word was God."
        />
        <Sample
          label="Greek"
          text="ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν, καὶ θεὸς ἦν ὁ λόγος."
          mono
        />
      </div>
    </div>
  );
}

function Sample({
  label,
  text,
  mono = false,
}: {
  label: string;
  text: string;
  mono?: boolean;
}) {
  return (
    <div className="grid grid-cols-[3rem_1fr] gap-x-4 items-baseline">
      <div className="font-mono text-[0.6875rem] text-ink-subtle pt-1">
        {label}
      </div>
      <p
        className={
          mono
            ? "font-mono text-[0.9375rem] leading-6 text-ink"
            : "serif text-[1rem] leading-6 text-ink"
        }
      >
        {text}
      </p>
    </div>
  );
}
