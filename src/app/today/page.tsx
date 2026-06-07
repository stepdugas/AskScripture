import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { dailyVerse } from "@/data/daily-verses";
import { parseRef, refToHref } from "@/lib/bible/parse-ref";
import {
  readDailyContent,
  generateAndStoreDailyContent,
  DAILY_KINDS,
  type DailyKind,
} from "@/lib/daily-content";
import { features } from "@/lib/env";
import { GenericPageSkeleton } from "@/components/skeletons";

export const metadata: Metadata = {
  title: "Today",
  description:
    "Today's shared devotional, family devotional, sermon outline, and story — generated once per day and free for everyone.",
};

const KIND_LABELS = {
  devotional: "Personal devotional",
  family: "Family devotional",
  sermon: "Sermon outline",
  story: "Story",
} as const;

const KIND_BLURBS = {
  devotional: "A 350-500 word reflection on today's passage.",
  family: "For reading with kids ages 6-12. Includes two discussion questions.",
  sermon: "A 25-30 minute preaching outline with big idea + 3-4 moves.",
  story: "Today's passage retold cinematically.",
} as const;

type FromRedirect = { from?: string; kind?: string };

export default function TodayPage({
  searchParams,
}: {
  searchParams: Promise<FromRedirect>;
}) {
  return (
    <Suspense fallback={<GenericPageSkeleton />}>
      <Content searchParams={searchParams} />
    </Suspense>
  );
}

async function Content({
  searchParams,
}: {
  searchParams: Promise<FromRedirect>;
}) {
  const sp = await searchParams;
  const today = dailyVerse();
  const todayParsed = parseRef(today.ref);

  // Resolve each kind: read cached content; if missing AND Anthropic + Supabase
  // are configured, attempt a lazy generation. This makes "/today" tolerant of
  // cron misses or first-launch days.
  const items = await Promise.all(
    DAILY_KINDS.map(async (kind) => {
      const content = await resolveDailyKind(kind);
      return { kind, content };
    }),
  );

  return (
    <div className="mx-auto max-w-[1100px] px-6 lg:px-10 pt-16 pb-24">
      {sp.from === "generate" && sp.kind && (
        <RedirectBanner kind={sp.kind} />
      )}

      <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
        Today · Free for everyone
      </div>
      <h1 className="serif mt-3 text-[2.75rem] leading-[1.05] tracking-tight text-ink font-semibold">
        {today.ref}
      </h1>
      <p className="mt-4 text-[1rem] leading-7 text-ink-muted max-w-[58ch]">
        {today.note}
      </p>
      {todayParsed && (
        <div className="mt-5 flex flex-wrap items-center gap-3 text-[0.8125rem]">
          <Link
            href={refToHref(todayParsed)}
            className="inline-flex h-10 items-center px-4 bg-accent text-paper text-[0.8125rem] font-medium hover:bg-accent-2 transition-colors"
          >
            Read {today.ref}
          </Link>
          <Link href="/pricing" className="text-ink-muted hover:text-accent">
            Generate from any passage with Pro &rarr;
          </Link>
        </div>
      )}

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12 border-t border-rule pt-10">
        {items.map(({ kind, content }) => (
          <section key={kind} id={`kind-${kind}`}>
            <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
              {KIND_LABELS[kind]}
            </div>
            <p className="mt-1 text-[0.75rem] text-ink-muted">
              {KIND_BLURBS[kind]}
            </p>
            {content ? (
              <article className="mt-6 serif text-[1rem] leading-[1.85] text-ink whitespace-pre-wrap">
                {content}
              </article>
            ) : (
              <NotReady kind={kind} />
            )}
          </section>
        ))}
      </div>

      <p className="mt-16 pt-6 border-t border-rule text-[0.75rem] text-ink-muted max-w-[68ch]">
        These are generated once per day for everyone, not per-user, so the
        site can offer them for free. Want a devotional, sermon, or story from
        a passage you choose?{" "}
        <Link href="/pricing" className="text-accent hover:underline">
          Pro is $5/month
        </Link>
        .
      </p>
    </div>
  );
}

/**
 * Try cache first. If empty, fall back to generating + storing, but only
 * when both Anthropic and Supabase service-role are configured (so the
 * write actually succeeds). Returns the content string or null.
 */
async function resolveDailyKind(kind: DailyKind): Promise<string | null> {
  const cached = await readDailyContent(kind);
  if (cached) return cached.content;
  if (!features.ai || !features.supabase) return null;
  try {
    const generated = await generateAndStoreDailyContent(kind);
    return generated?.content ?? null;
  } catch {
    return null;
  }
}

function RedirectBanner({ kind }: { kind: string }) {
  const label = (KIND_LABELS as Record<string, string>)[kind] ?? "Content";
  return (
    <div className="mb-8 border-l-2 border-accent bg-paper-2 px-4 py-3 text-[0.875rem] leading-6 text-ink">
      <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium mb-0.5">
        From your link
      </div>
      Custom-passage generation is a{" "}
      <Link href="/pricing" className="text-accent hover:underline">
        Pro feature
      </Link>
      . Today&rsquo;s shared {label.toLowerCase()} is below — free for everyone.
    </div>
  );
}

function NotReady({ kind }: { kind: string }) {
  return (
    <div className="mt-6 border border-rule p-5 text-[0.875rem] text-ink-muted leading-6">
      Today&rsquo;s {kind} is queued — generation will start shortly. Refresh
      in a moment, or read the passage above in the meantime.
    </div>
  );
}
