import type { Metadata } from "next";
import Link from "next/link";
import { features } from "@/lib/env";
import { PricingActions } from "./pricing-actions";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Free for honest use; Pro for unlimited chat and content generation.",
};

const TIERS = [
  {
    id: "free" as const,
    name: "Free",
    price: "$0",
    cadence: "forever",
    features: [
      "Read all 10 free translations",
      "Side-by-side comparison",
      "17 translation debates with full original-language context",
      "Greek + Hebrew interlinear (full Bible, 425k words)",
      "340,000 cross-references",
      "Bible search across 31,086 verses",
      "Reading plans, notes, highlights, bookmarks",
      "Today's shared devotional, family devo, sermon, and story (refreshed daily)",
      "Study chat: 3 messages/day as guest, 8/day signed in (Claude Haiku)",
    ],
  },
  {
    id: "pro" as const,
    name: "Pro",
    price: "$5",
    cadence: "per month",
    features: [
      "Everything in Free",
      "Unlimited study chat on Claude Sonnet 4.6 (the smarter model)",
      "Generate a devotional, family devo, sermon, or story from ANY passage",
      "5 extra highlight colors",
      "Early-user pricing locked in",
      "Cancel anytime",
    ],
    accent: true,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-6 lg:px-10 pt-16 pb-24">
      <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
        Pricing
      </div>
      <h1 className="serif mt-3 text-[2.75rem] leading-[1.05] tracking-tight text-ink font-semibold">
        Honest pricing for honest study.
      </h1>
      <p className="mt-5 text-[1rem] leading-7 text-ink-muted max-w-[58ch]">
        The free tier is the real product. Pro removes daily caps for people
        who want to study without watching a counter. No ads either way.
      </p>

      {/*
        Intentionally no "Stripe not configured" banner — that signals
        "not real product" to first-time visitors. The Pro card below
        renders a "Coming soon" state instead.
      */}

      <div className="mt-12 grid grid-cols-12 gap-6 lg:gap-10">
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            className={
              "col-span-12 md:col-span-6 border p-8 " +
              (tier.accent
                ? "border-accent bg-paper"
                : "border-rule bg-paper")
            }
          >
            <div className="flex items-baseline justify-between">
              <h2 className="serif text-[1.5rem] font-semibold text-ink">
                {tier.name}
              </h2>
              {tier.accent && (
                <span className="text-[0.625rem] font-mono uppercase tracking-[0.16em] bg-accent text-paper px-2 py-1">
                  Pro
                </span>
              )}
            </div>
            <div className="mt-4">
              <span className="serif text-[3rem] leading-none text-ink font-semibold tabular-nums">
                {tier.price}
              </span>
              <span className="ml-2 text-[0.875rem] text-ink-muted">
                {tier.cadence}
              </span>
            </div>

            <ul className="mt-8 space-y-3 text-[0.9375rem] leading-6 text-ink">
              {tier.features.map((f) => (
                <li
                  key={f}
                  className="grid grid-cols-[1.25rem_1fr] gap-x-2 items-baseline"
                >
                  <span className="text-accent text-[1rem] leading-none">
                    +
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              {tier.id === "free" ? (
                <Link
                  href="/signup"
                  className="inline-flex h-11 items-center px-5 border border-rule-strong text-ink text-[0.875rem] font-medium hover:bg-paper-2 transition-colors"
                >
                  Create free account
                </Link>
              ) : features.stripe ? (
                <PricingActions />
              ) : (
                <ComingSoon />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-[0.8125rem] text-ink-muted">
        Prefer a one-time gift instead of a subscription?{" "}
        <Link href="/support" className="text-accent hover:underline">
          Support the project with a donation
        </Link>
        .
      </div>
    </div>
  );
}

function ComingSoon() {
  return (
    <div className="inline-flex flex-col gap-1.5">
      <button
        type="button"
        disabled
        className="inline-flex h-11 items-center px-5 bg-paper-2 text-ink-muted text-[0.875rem] font-medium border border-rule cursor-not-allowed"
      >
        Notify me when Pro opens
      </button>
      <p className="text-[0.6875rem] text-ink-subtle">
        Free tier is the full product — Pro is for power users.
      </p>
    </div>
  );
}
