"use client";

import { useState, useTransition } from "react";

type Props = {
  userId: string;
  initial: boolean;
};

export function LifetimeToggle({ userId, initial }: Props) {
  const [on, setOn] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle() {
    const next = !on;
    setOn(next);
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/admin/lifetime", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId, value: next }),
      });
      if (!res.ok) {
        setOn(!next);
        const body = await res.json().catch(() => null);
        setError(body?.error ?? "Failed");
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      {error && (
        <span className="text-[0.6875rem] text-flag">{error}</span>
      )}
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        aria-pressed={on}
        className={
          "relative inline-flex h-6 w-11 items-center transition-colors " +
          (on ? "bg-accent" : "bg-paper-2 border border-rule-strong")
        }
      >
        <span
          className={
            "inline-block h-5 w-5 transform bg-paper shadow transition-transform " +
            (on ? "translate-x-5" : "translate-x-0.5")
          }
        />
      </button>
    </div>
  );
}
