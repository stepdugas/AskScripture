"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FREE_TRANSLATIONS } from "@/lib/bible/translations";
import { usePreferences } from "@/lib/preferences/provider";
import { cn } from "@/lib/utils/cn";

type Props = {
  current: string;
  align?: "left" | "right";
};

export function TranslationSwitcher({ current, align = "right" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { setPreferences } = usePreferences();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function pick(id: string) {
    setOpen(false);
    setPreferences({ translation: id });
    const usp = new URLSearchParams(params.toString());
    usp.set("t", id);
    router.push(`${pathname}?${usp.toString()}`);
  }

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-right group"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
          Translation
        </div>
        <div className="mt-1 flex items-center justify-end gap-1.5 font-mono text-[0.8125rem] text-ink group-hover:text-accent transition-colors">
          {current}
          <span className="text-ink-subtle text-[0.625rem]">▾</span>
        </div>
      </button>

      {open && (
        <div
          role="listbox"
          className={cn(
            "absolute z-20 mt-2 w-[20rem] bg-paper border border-rule-strong shadow-[0_8px_32px_-12px_rgba(20,23,31,0.18)]",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          <ul className="py-1 max-h-[60vh] overflow-auto">
            {FREE_TRANSLATIONS.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => pick(t.id)}
                  role="option"
                  aria-selected={t.id === current}
                  className={cn(
                    "w-full text-left px-4 py-2.5 hover:bg-paper-2 transition-colors grid grid-cols-[3rem_1fr] gap-x-3 items-baseline",
                    t.id === current && "bg-paper-2",
                  )}
                >
                  <span className="font-mono text-[0.75rem] text-ink-muted tabular-nums">
                    {t.shortName}
                  </span>
                  <span>
                    <span className="text-[0.875rem] text-ink">{t.name}</span>
                    {t.year && (
                      <span className="ml-2 text-[0.6875rem] text-ink-subtle">
                        {t.year}
                      </span>
                    )}
                    <span className="block text-[0.75rem] text-ink-muted mt-0.5 leading-snug">
                      {t.blurb}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
