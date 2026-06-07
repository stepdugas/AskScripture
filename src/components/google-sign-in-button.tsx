"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = {
  next?: string;
};

export function GoogleSignInButton({ next = "/dashboard" }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError(
        "Sign-in not configured. Add Supabase env vars and enable Google in the Supabase dashboard.",
      );
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // On success Supabase redirects; no further client work needed.
  }

  return (
    <div>
      <button
        type="button"
        onClick={go}
        disabled={loading}
        className="w-full h-11 inline-flex items-center justify-center gap-3 border border-rule-strong bg-paper text-ink text-[0.875rem] font-medium hover:bg-paper-2 transition-colors disabled:opacity-50"
      >
        <GoogleMark />
        <span>{loading ? "Redirecting…" : "Continue with Google"}</span>
      </button>
      {error && (
        <p className="mt-2 text-[0.75rem] text-flag">{error}</p>
      )}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.614z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.836.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332A8.997 8.997 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.96A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.96 4.042l3.004-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.441 1.345l2.581-2.581C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .96 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}
