import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchClient } from "./search-client";
import { GenericPageSkeleton } from "@/components/skeletons";

export const metadata: Metadata = {
  title: "Search the Bible",
  description:
    "Full-text search across all 31,086 verses of the Berean Standard Bible.",
};

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
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
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div className="mx-auto max-w-[1000px] px-6 lg:px-10 pt-12 pb-24">
      <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
        Search
      </div>
      <h1 className="serif mt-3 text-[2.5rem] leading-[1.05] tracking-tight text-ink font-semibold">
        Search the Bible.
      </h1>
      <p className="mt-4 text-[0.9375rem] text-ink-muted max-w-[58ch]">
        Full-text across 31,086 verses of the Berean Standard Bible. Type a
        phrase or a few keywords.
      </p>
      <div className="mt-8">
        <SearchClient initialQuery={sp.q ?? ""} />
      </div>
    </div>
  );
}
