import type { Metadata } from "next";
import { Suspense } from "react";
import { features } from "@/lib/env";
import { DonateForm } from "./donate-form";
import { GenericPageSkeleton } from "@/components/skeletons";

export const metadata: Metadata = {
  title: "Support the project",
  description:
    "One-time donation. Server costs, content time, and developer coffee.",
};

export default function SupportPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
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
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;

  return (
    <div className="mx-auto max-w-[760px] px-6 lg:px-10 pt-16 pb-24">
      <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
        Support the project
      </div>
      <h1 className="serif mt-3 text-[2.5rem] leading-[1.05] tracking-tight text-ink font-semibold">
        Buy the developer a coffee.
      </h1>
      <p className="mt-5 text-[1rem] leading-7 text-ink-muted max-w-[58ch]">
        AskScripture is built by one person, with paid Anthropic credits and
        Vercel bills on the line. If the tool is useful to you, a one-time
        gift is the most direct way to keep it running.
      </p>

      {sp.status === "thanks" && (
        <div className="mt-8 border border-accent bg-accent/5 p-4 text-[0.9375rem] text-ink leading-6">
          Thank you — the donation came through. It means a lot.
        </div>
      )}

      <div className="mt-10 pt-8 border-t border-rule">
        {features.stripe ? (
          <DonateForm />
        ) : (
          <div>
            <p className="text-[0.9375rem] leading-7 text-ink-muted max-w-[58ch]">
              Donations open with the public release. In the meantime, the
              best way to help is to send a passage link to a friend, or
              to report something the tool got wrong.
            </p>
          </div>
        )}
      </div>

      <div className="mt-16 pt-8 border-t border-rule text-[0.875rem] leading-7 text-ink-muted">
        <p>
          Other ways to support without donating: tell someone who studies
          the Bible about the site, send a passage link to a friend, or
          report something the tool got wrong.
        </p>
      </div>
    </div>
  );
}
