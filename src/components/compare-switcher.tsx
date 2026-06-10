"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FREE_TRANSLATIONS } from "@/lib/bible/translations";
import { cn } from "@/lib/utils/cn";

type Props = {
  current: { a: string; b: string };
};

export function CompareSwitcher({ current }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  function navigate(a: string, b: string) {
    const params = new URLSearchParams();
    params.set("a", a);
    params.set("b", b);
    router.push(`${pathname}?${params.toString()}`);
  }

  function swap() {
    navigate(current.b, current.a);
  }

  return (
    <div>
      <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
        Compare
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        <Picker
          value={current.a}
          disabledId={current.b}
          onChange={(v) => navigate(v, current.b)}
          ariaLabel="Left translation"
        />
        <button
          type="button"
          onClick={swap}
          aria-label="Swap left and right translations"
          className="h-9 w-9 inline-flex items-center justify-center border border-rule-strong text-ink-muted hover:text-accent hover:border-accent transition-colors"
        >
          <span className="font-mono text-[0.6875rem]">⇄</span>
        </button>
        <Picker
          value={current.b}
          disabledId={current.a}
          onChange={(v) => navigate(current.a, v)}
          ariaLabel="Right translation"
        />
      </div>
    </div>
  );
}

function Picker({
  value,
  disabledId,
  onChange,
  ariaLabel,
}: {
  value: string;
  disabledId: string;
  onChange: (next: string) => void;
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = FREE_TRANSLATIONS.find((t) => t.id === value);

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
    onChange(id);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="inline-flex items-center gap-1.5 h-9 px-3 border border-rule-strong font-mono text-[0.8125rem] text-ink hover:border-accent hover:text-accent transition-colors min-w-[5rem] justify-between"
      >
        <span>{current?.shortName ?? value}</span>
        <span className="text-ink-subtle text-[0.625rem]">▾</span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute z-20 mt-1 w-[20rem] bg-paper border border-rule-strong shadow-[0_8px_32px_-12px_rgba(20,23,31,0.18)] right-0"
        >
          <ul className="py-1 max-h-[60vh] overflow-auto">
            {FREE_TRANSLATIONS.map((t) => {
              const isDisabled = t.id === disabledId;
              const isSelected = t.id === value;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => !isDisabled && pick(t.id)}
                    disabled={isDisabled}
                    role="option"
                    aria-selected={isSelected}
                    className={cn(
                      "w-full text-left px-4 py-2.5 transition-colors grid grid-cols-[3rem_1fr] gap-x-3 items-baseline",
                      isDisabled
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-paper-2 cursor-pointer",
                      isSelected && !isDisabled && "bg-paper-2",
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
                        {isDisabled
                          ? "Already on the other side"
                          : t.blurb}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
