"use client";

import { useState } from "react";

const PRESETS = [
  { cents: 500, label: "$5" },
  { cents: 1000, label: "$10" },
  { cents: 2500, label: "$25", featured: true },
  { cents: 5000, label: "$50" },
];

export function DonateForm() {
  const [selected, setSelected] = useState<number>(2500);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    setLoading(true);
    setError(null);
    let amountCents = selected;
    if (custom.trim()) {
      const n = parseFloat(custom);
      if (isNaN(n) || n < 1) {
        setError("Enter a custom amount of at least $1.");
        setLoading(false);
        return;
      }
      amountCents = Math.round(n * 100);
    }
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode: "donation", amountCents }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? "Couldn't open checkout.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-3">
        {PRESETS.map((p) => (
          <button
            key={p.cents}
            type="button"
            onClick={() => {
              setSelected(p.cents);
              setCustom("");
            }}
            className={
              "h-14 border text-center transition-colors " +
              (selected === p.cents && !custom
                ? "border-accent bg-accent text-paper"
                : "border-rule-strong text-ink hover:bg-paper-2")
            }
          >
            <span className="serif text-[1.25rem] font-semibold tabular-nums">
              {p.label}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2 text-[0.8125rem] text-ink-muted">
        <label htmlFor="donate-custom">Or custom:</label>
        <span aria-hidden>$</span>
        <input
          id="donate-custom"
          type="number"
          step="1"
          min="1"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="amount"
          aria-label="Custom donation amount in dollars"
          className="h-9 w-28 border border-rule-strong px-2 bg-paper text-ink focus:border-accent outline-none font-mono text-[0.875rem]"
        />
      </div>

      {error && <p className="mt-3 text-[0.8125rem] text-flag">{error}</p>}

      <button
        type="button"
        onClick={go}
        disabled={loading}
        className="mt-6 inline-flex h-11 items-center px-6 bg-accent text-paper text-[0.875rem] font-medium hover:bg-accent-2 transition-colors disabled:opacity-50"
      >
        {loading ? "Redirecting…" : "Donate now"}
      </button>
    </div>
  );
}
