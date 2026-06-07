"use client";

import { useState } from "react";

export function PricingActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upgrade() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode: "subscription" }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? "Couldn't start checkout.");
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
      <button
        type="button"
        onClick={upgrade}
        disabled={loading}
        className="inline-flex h-11 items-center px-5 bg-accent text-paper text-[0.875rem] font-medium hover:bg-accent-2 transition-colors disabled:opacity-60"
      >
        {loading ? "Redirecting…" : "Upgrade to Pro"}
      </button>
      {error && (
        <p className="mt-2 text-[0.75rem] text-flag max-w-[36ch]">{error}</p>
      )}
    </div>
  );
}
