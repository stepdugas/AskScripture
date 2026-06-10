import { Suspense } from "react";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/user";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { env, features } from "@/lib/env";
import { LifetimeToggle } from "./lifetime-toggle";

// Cost per Anthropic call (Claude Sonnet 4.6 estimate)
const CHAT_COST_USD = 0.015;
const GEN_COST_USD = 0.018;

// With cacheComponents enabled, cookie-reading data access must happen
// inside a <Suspense> boundary (same pattern as /generate/[kind]).
export default function AdminPage() {
  // If Supabase isn't configured, explain instead of crashing.
  if (!features.supabase) {
    return (
      <Shell>
        <NotConfigured />
      </Shell>
    );
  }

  return (
    <Suspense
      fallback={
        <Shell>
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            Admin
          </div>
          <h1 className="serif mt-3 text-[2.5rem] leading-[1.05] tracking-tight text-ink font-semibold">
            Loading…
          </h1>
        </Shell>
      }
    >
      <AdminContent />
    </Suspense>
  );
}

async function AdminContent() {
  const user = await requireAdmin();
  if (!user) {
    redirect("/signin?next=/admin");
  }

  const supabase = (await getSupabaseServerClient())!;
  const today = new Date().toISOString().slice(0, 10);
  const monthStart = new Date();
  monthStart.setUTCDate(1);
  const monthStartIso = monthStart.toISOString().slice(0, 10);

  // Parallel queries
  const [
    { count: userCount },
    todayUsage,
    monthUsage,
    recentUsers,
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("chat_usage")
      .select("messages, generates")
      .eq("day", today),
    supabase
      .from("chat_usage")
      .select("messages, generates")
      .gte("day", monthStartIso),
    supabase
      .from("profiles")
      .select("id, email, display_name, is_lifetime, is_early_user, created_at")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const todayChat = (todayUsage.data ?? []).reduce(
    (sum, r) => sum + (r.messages ?? 0),
    0,
  );
  const todayGen = (todayUsage.data ?? []).reduce(
    (sum, r) => sum + (r.generates ?? 0),
    0,
  );
  const monthChat = (monthUsage.data ?? []).reduce(
    (sum, r) => sum + (r.messages ?? 0),
    0,
  );
  const monthGen = (monthUsage.data ?? []).reduce(
    (sum, r) => sum + (r.generates ?? 0),
    0,
  );

  const todayCost = todayChat * CHAT_COST_USD + todayGen * GEN_COST_USD;
  const monthCost = monthChat * CHAT_COST_USD + monthGen * GEN_COST_USD;

  return (
    <Shell>
      <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
        Admin
      </div>
      <h1 className="serif mt-3 text-[2.5rem] leading-[1.05] tracking-tight text-ink font-semibold">
        Operations.
      </h1>
      <p className="mt-3 text-[0.9375rem] text-ink-muted">
        Signed in as <span className="font-mono">{user.email}</span> · Admin
      </p>

      <section className="mt-12">
        <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium mb-4">
          Today
        </div>
        <div className="grid grid-cols-12 gap-6">
          <Metric label="Users total" value={userCount ?? 0} />
          <Metric label="Chat msgs today" value={todayChat} />
          <Metric label="Generates today" value={todayGen} />
          <Metric
            label="Est. cost today"
            value={`$${todayCost.toFixed(2)}`}
            big
          />
        </div>
      </section>

      <section className="mt-12">
        <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium mb-4">
          Month to date
        </div>
        <div className="grid grid-cols-12 gap-6">
          <Metric label="Chat msgs" value={monthChat} />
          <Metric label="Generates" value={monthGen} />
          <Metric
            label="Est. cost"
            value={`$${monthCost.toFixed(2)}`}
            big
          />
        </div>
      </section>

      <section className="mt-12">
        <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium mb-4">
          Users · most recent 50
        </div>
        <div className="border-t border-rule">
          <div className="grid grid-cols-12 gap-x-4 py-2 text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            <div className="col-span-5">Email</div>
            <div className="col-span-2">Joined</div>
            <div className="col-span-2">Flags</div>
            <div className="col-span-3 text-right">Lifetime</div>
          </div>
          {(recentUsers.data ?? []).map((u) => (
            <div
              key={u.id}
              className="grid grid-cols-12 gap-x-4 py-3 border-t border-rule items-center"
            >
              <div className="col-span-5 text-[0.875rem] text-ink font-mono break-all">
                {u.email ?? "—"}
              </div>
              <div className="col-span-2 text-[0.75rem] text-ink-muted font-mono">
                {u.created_at?.slice(0, 10) ?? "—"}
              </div>
              <div className="col-span-2 flex gap-1">
                {u.is_early_user && (
                  <span className="text-[0.625rem] font-mono bg-accent/15 text-accent px-1.5 py-0.5">
                    early
                  </span>
                )}
                {env.adminEmails.includes((u.email ?? "").toLowerCase()) && (
                  <span className="text-[0.625rem] font-mono bg-flag/15 text-flag px-1.5 py-0.5">
                    admin
                  </span>
                )}
              </div>
              <div className="col-span-3 flex justify-end">
                <LifetimeToggle
                  userId={u.id}
                  initial={!!u.is_lifetime}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
    <div className="mx-auto max-w-[1320px] px-6 lg:px-10 pt-12 pb-24">
          {children}
        </div>
    </>
  );
}

function Metric({
  label,
  value,
  big,
}: {
  label: string;
  value: number | string;
  big?: boolean;
}) {
  return (
    <div className="col-span-6 md:col-span-3 border-l border-rule pl-4">
      <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
        {label}
      </div>
      <div
        className={
          "serif mt-1.5 leading-none tracking-tight text-ink font-semibold tabular-nums " +
          (big ? "text-[2.5rem]" : "text-[2rem]")
        }
      >
        {value}
      </div>
    </div>
  );
}

function NotConfigured() {
  return (
    <div className="max-w-[680px]">
      <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
        Admin
      </div>
      <h1 className="serif mt-3 text-[2.25rem] leading-[1.05] tracking-tight text-ink font-semibold">
        Supabase not configured.
      </h1>
      <p className="mt-5 text-[1rem] leading-7 text-ink-muted">
        The admin page reads from Supabase. Add{" "}
        <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
        <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
        <code className="font-mono">.env.local</code>, run the SQL migration in{" "}
        <code className="font-mono">supabase/migrations/0001_initial.sql</code>, and
        add your email to <code className="font-mono">ADMIN_EMAILS</code>. See{" "}
        <code className="font-mono">SETUP.md</code> for full steps.
      </p>
    </div>
  );
}
