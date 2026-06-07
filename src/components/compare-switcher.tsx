"use client";

import { useRouter, usePathname } from "next/navigation";
import { FREE_TRANSLATIONS } from "@/lib/bible/translations";

type Props = {
  current: { a: string; b: string };
};

export function CompareSwitcher({ current }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  function update(field: "a" | "b", value: string) {
    const params = new URLSearchParams();
    params.set("a", field === "a" ? value : current.a);
    params.set("b", field === "b" ? value : current.b);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2 text-[0.8125rem]">
      <Picker
        label="Left"
        value={current.a}
        onChange={(v) => update("a", v)}
      />
      <span className="text-ink-subtle">vs</span>
      <Picker
        label="Right"
        value={current.b}
        onChange={(v) => update("b", v)}
      />
    </div>
  );
}

function Picker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <label className="inline-flex items-center gap-1.5">
      <span className="sr-only">{label} translation</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-paper border border-rule-strong px-2 py-1 font-mono text-[0.75rem] text-ink focus:border-accent outline-none"
      >
        {FREE_TRANSLATIONS.map((t) => (
          <option key={t.id} value={t.id}>
            {t.shortName} — {t.name}
          </option>
        ))}
      </select>
    </label>
  );
}
