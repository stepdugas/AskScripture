"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReadingPlan } from "@/data/reading-plans";
import { parseRef, refToHref } from "@/lib/bible/parse-ref";
import {
  getActivePlan,
  startPlan,
  stopPlan,
  toggleDay,
  type ActivePlan,
} from "@/lib/storage/plans";

type Props = { plan: ReadingPlan };

export function PlanClient({ plan }: Props) {
  const [active, setActive] = useState<ActivePlan | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setActive(getActivePlan(plan.id) ?? null);
    setReady(true);
  }, [plan.id]);

  function onStart() {
    setActive(startPlan(plan.id));
  }
  function onStop() {
    if (!confirm("Stop this plan and clear your progress?")) return;
    stopPlan(plan.id);
    setActive(null);
  }
  function onToggle(day: number) {
    toggleDay(plan.id, day);
    setActive(getActivePlan(plan.id) ?? null);
  }

  const completed = new Set(active?.completedDays ?? []);
  const pct = active
    ? Math.round((active.completedDays.length / plan.days.length) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-[1320px] px-6 lg:px-10 pt-16 pb-24">
      <div className="grid grid-cols-12 gap-x-10 mb-10">
        <div className="col-span-12 lg:col-span-8">
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            <Link href="/plans" className="hover:text-ink">
              Reading plans
            </Link>
            <span className="mx-2 text-rule-strong">/</span>
            {plan.duration}
          </div>
          <h1 className="serif mt-3 text-[2.5rem] leading-[1.05] tracking-tight text-ink font-semibold">
            {plan.title}
          </h1>
          <p className="mt-5 text-[1rem] leading-7 text-ink-muted max-w-[58ch]">
            {plan.blurb}
          </p>
          <div className="mt-7 flex items-center gap-4">
            {!ready ? (
              <div className="h-10 w-32 bg-paper-2 animate-pulse" />
            ) : active ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-40 bg-paper-2 overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="font-mono text-[0.75rem] text-ink-muted tabular-nums">
                    {active.completedDays.length} / {plan.days.length} · {pct}%
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onStop}
                  className="text-[0.75rem] text-ink-subtle hover:text-flag"
                >
                  Stop plan
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onStart}
                className="inline-flex h-10 items-center px-5 bg-accent text-paper text-[0.8125rem] font-medium tracking-wide hover:bg-accent-2 transition-colors"
              >
                Start this plan
              </button>
            )}
          </div>
        </div>
      </div>

      <ol className="border-t border-rule">
        {plan.days.map((d) => {
          const done = completed.has(d.day);
          return (
            <li
              key={d.day}
              className="grid grid-cols-12 gap-x-6 py-5 border-b border-rule"
            >
              <div className="col-span-2 lg:col-span-1 flex items-start gap-3">
                {active && (
                  <button
                    type="button"
                    onClick={() => onToggle(d.day)}
                    aria-pressed={done}
                    aria-label={`Mark day ${d.day} ${done ? "incomplete" : "complete"}`}
                    className={
                      "mt-0.5 h-4 w-4 border transition-colors " +
                      (done
                        ? "bg-accent border-accent"
                        : "border-rule-strong bg-paper hover:border-accent")
                    }
                  >
                    {done && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-paper m-auto"
                      >
                        <path d="M2 6 L5 9 L10 3" />
                      </svg>
                    )}
                  </button>
                )}
                <span
                  className={
                    "font-mono text-[0.875rem] tabular-nums " +
                    (done ? "text-ink-subtle" : "text-ink-muted")
                  }
                >
                  Day {d.day}
                </span>
              </div>
              <div className="col-span-10 lg:col-span-11">
                {d.theme && (
                  <div
                    className={
                      "serif italic text-[0.9375rem] mb-1.5 " +
                      (done ? "text-ink-subtle" : "text-ink-muted")
                    }
                  >
                    {d.theme}
                  </div>
                )}
                <ul className="flex flex-wrap gap-x-3 gap-y-1">
                  {d.refs.map((r) => {
                    const parsed = parseRef(r);
                    return (
                      <li key={r}>
                        {parsed ? (
                          <Link
                            href={refToHref(parsed)}
                            className={
                              "text-[0.9375rem] transition-colors border-b border-transparent hover:border-accent " +
                              (done
                                ? "text-ink-subtle line-through"
                                : "text-ink hover:text-accent")
                            }
                          >
                            {r}
                          </Link>
                        ) : (
                          <span className="text-[0.9375rem] text-ink-subtle">
                            {r}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
