"use client";

import { useState, useMemo } from "react";
import { FREE_TRANSLATIONS } from "@/lib/bible/translations";

export default function QuoteCardPage() {
  const [ref, setRef] = useState("John 3:16");
  const [t, setT] = useState("BSB");
  const src = useMemo(() => {
    const params = new URLSearchParams({ ref, t });
    return `/api/og/verse?${params.toString()}`;
  }, [ref, t]);

  return (
    <>
    <div className="mx-auto max-w-[1100px] px-6 lg:px-10 pt-16 pb-24">
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            Quote card
          </div>
          <h1 className="serif mt-3 text-[2.5rem] leading-[1.05] tracking-tight text-ink font-semibold">
            Shareable card from any passage.
          </h1>
          <p className="mt-5 text-[1rem] leading-7 text-ink-muted max-w-[58ch]">
            Editorial layout, no emojis, no gradients. 1200×1200 — square for
            Instagram, fine for Twitter and Pinterest.
          </p>

          <div className="mt-10 grid grid-cols-12 gap-10">
            <div className="col-span-12 lg:col-span-5 space-y-6">
              <div>
                <label
                  htmlFor="card-passage"
                  className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium"
                >
                  Passage
                </label>
                <input
                  id="card-passage"
                  type="text"
                  value={ref}
                  onChange={(e) => setRef(e.target.value)}
                  className="mt-2 w-full h-11 border border-rule-strong px-3 bg-paper text-ink focus:border-accent outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="card-translation"
                  className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium"
                >
                  Translation
                </label>
                <select
                  id="card-translation"
                  value={t}
                  onChange={(e) => setT(e.target.value)}
                  className="mt-2 w-full h-11 border border-rule-strong px-3 bg-paper text-ink focus:border-accent outline-none font-mono text-[0.875rem]"
                >
                  {FREE_TRANSLATIONS.map((tr) => (
                    <option key={tr.id} value={tr.id}>
                      {tr.shortName} — {tr.name}
                    </option>
                  ))}
                </select>
              </div>
              <a
                href={src}
                download={`askscripture-${ref.replace(/\s+/g, "-")}.png`}
                className="inline-flex h-10 items-center px-5 bg-accent text-paper text-[0.8125rem] font-medium hover:bg-accent-2 transition-colors"
              >
                Download PNG
              </a>
            </div>
            <div className="col-span-12 lg:col-span-7">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${ref} quote card`}
                className="w-full border border-rule"
              />
            </div>
          </div>
        </div>
    </>
  );
}
