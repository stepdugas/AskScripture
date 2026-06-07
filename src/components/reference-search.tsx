"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { parseRef, refToHref } from "@/lib/bible/parse-ref";
import { cn } from "@/lib/utils/cn";

type Props = {
  className?: string;
  placeholder?: string;
  size?: "sm" | "md";
};

export function ReferenceSearch({
  className,
  placeholder = "Type a reference — John 3:16, Rom 8, 1 Cor 13:4-7",
  size = "md",
}: Props) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const heightClass = size === "sm" ? "h-9 text-[0.875rem]" : "h-11 text-[0.9375rem]";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseRef(value);
    if (!parsed) {
      setError("Could not read that reference. Try \"John 3:16\".");
      return;
    }
    setError(null);
    startTransition(() => {
      router.push(refToHref(parsed));
    });
  }

  return (
    <form
      onSubmit={submit}
      className={cn("w-full", className)}
      role="search"
      aria-label="Find a passage"
    >
      <div
        className={cn(
          "flex items-stretch border border-rule-strong bg-paper transition-colors focus-within:border-accent",
          heightClass,
        )}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-3 outline-none placeholder:text-ink-subtle text-ink"
          aria-label="Passage reference"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-4 bg-ink text-paper font-sans text-[0.8125rem] font-medium tracking-wide hover:bg-accent transition-colors disabled:opacity-60"
        >
          {isPending ? "Opening…" : "Open"}
        </button>
      </div>
      {error && (
        <p className="mt-1.5 text-[0.75rem] text-flag">{error}</p>
      )}
    </form>
  );
}
