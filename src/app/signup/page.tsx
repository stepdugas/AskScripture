"use client";

import Link from "next/link";
import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { GoogleSignInButton } from "@/components/google-sign-in-button";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const supabase = getSupabaseBrowserClient();
  const ready = !!supabase;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) {
      setError(
        "Auth is not configured. Add Supabase env vars per SETUP.md.",
      );
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/dashboard` },
      });
      if (error) throw error;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed.");
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
            Create an account.
          </h1>
          <p className="mt-4 text-[0.9375rem] text-ink-muted leading-6">
            Early users are permanently free.
          </p>

          {!ready && (
            <div className="mt-6 border border-rule p-4 text-[0.8125rem] leading-6 text-ink-muted">
              Sign-up requires a configured Supabase project. See{" "}
              <code className="font-mono">SETUP.md</code>.
            </div>
          )}

          {sent ? (
            <div className="mt-10 serif text-[1rem] leading-7 text-ink">
              Check your inbox — we sent a confirmation to{" "}
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
              <Field
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
              />
              <Field
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
              />
              {error && (
                <p className="text-[0.8125rem] text-flag">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading || !ready}
                className="h-11 w-full bg-accent text-paper text-[0.875rem] font-medium hover:bg-accent-2 transition-colors disabled:opacity-50"
              >
                {loading ? "…" : "Create account"}
              </button>
              <p className="text-[0.75rem] text-ink-muted">
                Already have an account?{" "}
                <Link href="/signin" className="text-accent hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
            </>
          )}
        </div>
    </>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (next: string) => void;
}) {
  const id = `signup-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const autoComplete = type === "email" ? "email" : "new-password";
  return (
    <div>
      <label
        htmlFor={id}
        className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full h-11 border border-rule-strong px-3 bg-paper text-ink focus:border-accent outline-none"
      />
    </div>
  );
}
