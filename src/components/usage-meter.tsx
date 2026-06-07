"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type UsageData = {
  tier: "anonymous" | "free" | "lifetime";
  used: { chatToday: number; chatThisMonth: number; generateToday: number };
  remaining: {
    chatToday: number | null;
    chatThisMonth: number | null;
    generateToday: number | null;
  };
  limit: {
    chatPerDay: number | null;
    chatPerMonth: number | null;
    customGeneratePerDay: number | null;
  };
};

type Props = {
  variant?: "full" | "compact";
};

export function UsageMeter({ variant = "full" }: Props) {
  const [data, setData] = useState<UsageData | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/usage", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: UsageData) => mounted && setData(d))
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  if (!data) {
    return (
      <div
        className={
          variant === "compact"
            ? "h-9 bg-paper-2 animate-pulse"
            : "h-32 bg-paper-2 animate-pulse"
        }
      />
    );
  }

  if (data.tier === "lifetime") {
    return (
      <div
        className={
          variant === "compact"
            ? "inline-flex items-center gap-2 text-[0.75rem] text-ink-muted"
            : "border border-rule p-4"
        }
      >
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] bg-accent text-paper px-1.5 py-0.5">
          Pro
        </span>
        <span className="ml-2">Unlimited usage.</span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-3 text-[0.75rem] text-ink-muted">
        <span>
          Chat today:{" "}
          <span className="font-mono text-ink tabular-nums">
            {data.used.chatToday}/{data.limit.chatPerDay}
          </span>
        </span>
        {data.tier === "free" && (
          <>
            <span className="text-rule-strong">·</span>
            <span>
              Month:{" "}
              <span className="font-mono text-ink tabular-nums">
                {data.used.chatThisMonth}/{data.limit.chatPerMonth}
              </span>
            </span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="border border-rule p-5">
      <div className="flex items-baseline justify-between gap-3 mb-4">
        <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
          Usage
        </div>
        <div className="text-[0.6875rem] text-ink-subtle">
          Resets at midnight UTC
        </div>
      </div>

      <Bar
        label="Chat today"
        used={data.used.chatToday}
        limit={data.limit.chatPerDay ?? 0}
      />
      {data.tier === "free" && (
        <Bar
          label="Chat this month"
          used={data.used.chatThisMonth}
          limit={data.limit.chatPerMonth ?? 0}
          className="mt-4"
        />
      )}

      {data.tier === "anonymous" && (
        <p className="mt-5 text-[0.75rem] leading-5 text-ink-muted">
          You're using the guest allowance.{" "}
          <Link href="/signin" className="text-accent hover:underline">
            Sign in
          </Link>{" "}
          for a higher daily cap. Today's generated devotional and sermon
          outline are{" "}
          <Link href="/today" className="text-accent hover:underline">
            free for everyone
          </Link>
          .
        </p>
      )}
      {data.tier === "free" && (
        <p className="mt-5 text-[0.75rem] leading-5 text-ink-muted">
          Free tier. Generate from any passage with{" "}
          <Link href="/pricing" className="text-accent hover:underline">
            Pro
          </Link>{" "}
          ($5/mo, unlimited).
        </p>
      )}
    </div>
  );
}

function Bar({
  label,
  used,
  limit,
  className = "",
}: {
  label: string;
  used: number;
  limit: number;
  className?: string;
}) {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const exhausted = used >= limit && limit > 0;
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[0.8125rem] text-ink">{label}</span>
        <span className="font-mono text-[0.75rem] text-ink-muted tabular-nums">
          {used} / {limit}
        </span>
      </div>
      <div className="h-1 bg-paper-2 overflow-hidden">
        <div
          className={
            "h-full transition-all " + (exhausted ? "bg-flag" : "bg-accent")
          }
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
