import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { GenerateForm } from "./form";
import { GenericPageSkeleton } from "@/components/skeletons";
import { getCurrentUser } from "@/lib/auth/user";

const KINDS: Record<
  string,
  {
    title: string;
    eyebrow: string;
    blurb: string;
  }
> = {
  devotional: {
    title: "Personal devotional",
    eyebrow: "Generate · Pro",
    blurb:
      "Enter any passage and we'll write a 350-500 word devotional grounded in the text. Pro feature — free users get today's shared devotional on /today.",
  },
  family: {
    title: "Family devotional",
    eyebrow: "Generate · Pro",
    blurb:
      "Any passage, written for parents reading with kids 6-12. Pro feature.",
  },
  sermon: {
    title: "Sermon outline",
    eyebrow: "Generate · Pro",
    blurb:
      "Any passage, written as a 25-30 minute preaching outline. Pro feature.",
  },
  story: {
    title: "Story mode",
    eyebrow: "Generate · Pro",
    blurb:
      "Any passage, retold cinematically. Pro feature.",
  },
};

type Params = { kind: string };
type Search = { ref?: string };

export async function generateStaticParams() {
  return Object.keys(KINDS).map((kind) => ({ kind }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { kind } = await params;
  const k = KINDS[kind];
  if (!k) return {};
  return { title: k.title, description: k.blurb };
}

export default function GeneratePage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  return (
    <Suspense fallback={<GenericPageSkeleton />}>
      <GenerateContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function GenerateContent({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const [{ kind }, sp] = await Promise.all([params, searchParams]);
  const k = KINDS[kind];
  if (!k) notFound();

  // Free + anonymous users: redirect to /today, the shared content page.
  // Pro/Lifetime/Admin: render the custom-passage form as before.
  // The from=generate&kind=X params surface an inline banner on /today so
  // the user understands what happened instead of being silently teleported.
  const user = await getCurrentUser();
  if (!user || !user.unlimited) {
    redirect(`/today?from=generate&kind=${encodeURIComponent(kind)}`);
  }

  return (
    <div className="mx-auto max-w-[860px] px-6 lg:px-10 pt-16 pb-24">
      <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
        {k.eyebrow}
      </div>
      <h1 className="serif mt-3 text-[2.5rem] leading-[1.05] tracking-tight text-ink font-semibold">
        {k.title}
      </h1>
      <p className="mt-5 text-[1rem] leading-7 text-ink-muted max-w-[58ch]">
        Any passage. Sonnet 4.6. Lens and denomination from your{" "}
        <Link href="/settings" className="text-accent hover:underline">
          preferences
        </Link>
        .
      </p>

      <div className="mt-10">
        <GenerateForm kind={kind} initialRef={sp.ref ?? ""} />
      </div>

      <p className="mt-12 text-[0.75rem] text-ink-muted">
        Want today&rsquo;s shared {kind}? It&rsquo;s on{" "}
        <Link href="/today" className="text-accent hover:underline">
          /today
        </Link>
        , generated once per day for everyone.
      </p>
    </div>
  );
}
