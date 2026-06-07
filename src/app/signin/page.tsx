"use client";

import { useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { GoogleSignInButton } from "@/components/google-sign-in-button";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [mode, setMode] = useState<"password" | "magic">("magic");
  const [loading, setLoading] = useState(false);

  const supabase = getSupabaseBrowserClient();
  const supabaseReady = !!supabase;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) {
      setError(
        "Auth is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
      );
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (mode === "magic") {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${location.origin}/dashboard` },
        });
        if (error) throw error;
        setSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        location.href = "/dashboard";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <div className="mx-auto max-w-[480px] px-6 lg:px-10 pt-20 pb-24">
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            Account
          </div>
          <h1 className="serif mt-3 text-[2.25rem] leading-[1.05] tracking-tight text-ink font-semibold">
            Sign in.
          </h1>

          {!supabaseReady && (
            <div className="mt-6 border border-rule p-4 text-[0.8125rem] leading-6 text-ink-muted">
              Sign-in is not configured on this deployment yet. See{" "}
              <code className="font-mono">SETUP.md</code> for how to add a
              Supabase project. Your local notes, highlights, and bookmarks
              already work without an account.
            </div>
          )}

          {sent ? (
            <div className="mt-10 serif text-[1rem] leading-7 text-ink">
              Check your email — we sent a link to{" "}
              <span className="font-mono text-[0.875rem]">{email}</span>.
            </div>
          ) : (
            <>
              <div className="mt-10">
                <GoogleSignInButton />
              </div>
              <div className="mt-6 flex items-center gap-3 text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
                <span className="flex-1 h-px bg-rule" />
                <span>or with email</span>
                <span className="flex-1 h-px bg-rule" />
              </div>
              <form onSubmit={submit} className="mt-6 space-y-4">
              <div className="flex gap-1 text-[0.75rem]">
                <button
                  type="button"
                  onClick={() => setMode("magic")}
                  className={
                    "px-3 py-1 border " +
                    (mode === "magic"
                      ? "border-accent text-paper bg-accent"
                      : "border-rule text-ink-muted")
                  }
                >
                  Email link
                </button>
                <button
                  type="button"
                  onClick={() => setMode("password")}
                  className={
                    "px-3 py-1 border " +
                    (mode === "password"
                      ? "border-accent text-paper bg-accent"
                      : "border-rule text-ink-muted")
                  }
                >
                  Password
                </button>
              </div>

              <div>
                <label
                  htmlFor="signin-email"
                  className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium"
                >
                  Email
                </label>
                <input
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full h-11 border border-rule-strong px-3 bg-paper text-ink focus:border-accent outline-none"
                />
              </div>

              {mode === "password" && (
                <div>
                  <label
                    htmlFor="signin-password"
                    className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium"
                  >
                    Password
                  </label>
                  <input
                    id="signin-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 w-full h-11 border border-rule-strong px-3 bg-paper text-ink focus:border-accent outline-none"
                  />
                </div>
              )}

              {error && (
                <p className="text-[0.8125rem] text-flag">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !supabaseReady}
                className="h-11 w-full bg-accent text-paper text-[0.875rem] font-medium hover:bg-accent-2 transition-colors disabled:opacity-50"
              >
                {loading ? "…" : mode === "magic" ? "Send link" : "Sign in"}
              </button>

              <p className="text-[0.75rem] text-ink-muted">
                No account?{" "}
                <Link href="/signup" className="text-accent hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
            </>
          )}
        </div>
    </>
  );
}
