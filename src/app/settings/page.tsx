"use client";

import { usePreferences } from "@/lib/preferences/provider";
import {
  CHAT_MODE_LABELS,
  DENOMINATION_LABELS,
  LENS_LABELS,
  type ChatMode,
  type Denomination,
  type TheologicalLens,
} from "@/lib/preferences/types";
import { FREE_TRANSLATIONS } from "@/lib/bible/translations";

export default function SettingsPage() {
  const { preferences, setPreferences, ready } = usePreferences();

  return (
    <>
    <div className="mx-auto max-w-[860px] px-6 lg:px-10 pt-16 pb-24">
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            Preferences
          </div>
          <h1 className="serif mt-3 text-[2.5rem] leading-[1.05] tracking-tight text-ink font-semibold">
            How you read.
          </h1>
          <p className="mt-5 text-[1rem] leading-7 text-ink-muted max-w-[58ch]">
            Saved locally on this device. When you sign in (coming soon), these
            sync across devices.
          </p>

          <div className="mt-12 divide-y divide-rule">
            <Group
              label="Default translation"
              help="The translation loaded when you open a chapter without specifying one."
              htmlFor="pref-translation"
            >
              <select
                id="pref-translation"
                disabled={!ready}
                value={preferences.translation}
                onChange={(e) => setPreferences({ translation: e.target.value })}
                className="w-full h-11 border border-rule-strong px-3 bg-paper text-ink focus:border-accent outline-none font-mono text-[0.875rem]"
              >
                {FREE_TRANSLATIONS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.shortName} — {t.name}
                    {t.year ? ` (${t.year})` : ""}
                  </option>
                ))}
              </select>
            </Group>

            <Group
              label="Your reading background"
              help="Where you're coming from when you read the Bible. Optional — used as context for AI study chat. Never displayed publicly."
              htmlFor="pref-lens"
            >
              <select
                id="pref-lens"
                disabled={!ready}
                value={preferences.lens}
                onChange={(e) =>
                  setPreferences({ lens: e.target.value as TheologicalLens })
                }
                className="w-full h-11 border border-rule-strong px-3 bg-paper text-ink focus:border-accent outline-none"
              >
                {Object.entries(LENS_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </Group>

            <Group
              label="Religious tradition (optional)"
              help="Adds context for tradition-specific questions — Catholic vs Reformed vs Jewish readings of a passage, for instance. Leave as 'None' to skip; never displayed."
              htmlFor="pref-denomination"
            >
              <select
                id="pref-denomination"
                disabled={!ready}
                value={preferences.denomination}
                onChange={(e) =>
                  setPreferences({
                    denomination: e.target.value as Denomination,
                  })
                }
                className="w-full h-11 border border-rule-strong px-3 bg-paper text-ink focus:border-accent outline-none"
              >
                {Object.entries(DENOMINATION_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </Group>

            <Group
              label="How AI should answer you"
              help="The starting voice when you open Study Chat — Scholarly, Devotional, Affirming, etc. You can switch any time in the drawer."
              htmlFor="pref-chat-mode"
            >
              <select
                id="pref-chat-mode"
                disabled={!ready}
                value={preferences.defaultChatMode}
                onChange={(e) =>
                  setPreferences({
                    defaultChatMode: e.target.value as ChatMode,
                  })
                }
                className="w-full h-11 border border-rule-strong px-3 bg-paper text-ink focus:border-accent outline-none"
              >
                {Object.entries(CHAT_MODE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </Group>

            <Group
              label="Daily verse"
              help="A passage picked from your reading history each day, shown on the home page."
            >
              <label className="inline-flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={preferences.dailyVerse}
                  onChange={(e) => setPreferences({ dailyVerse: e.target.checked })}
                  className="h-4 w-4 accent-accent"
                />
                <span className="text-[0.9375rem] text-ink">
                  Show a daily verse on the home page
                </span>
              </label>
            </Group>

            <Group
              label="Reset"
              help="Removes all local data including notes, highlights, bookmarks, and streaks. Cannot be undone."
            >
              <button
                type="button"
                onClick={() => {
                  if (
                    typeof window !== "undefined" &&
                    confirm("Clear all local data?")
                  ) {
                    Object.keys(localStorage)
                      .filter((k) => k.startsWith("askscripture."))
                      .forEach((k) => localStorage.removeItem(k));
                    location.reload();
                  }
                }}
                className="text-[0.8125rem] text-flag hover:underline"
              >
                Clear all local data &rarr;
              </button>
            </Group>
          </div>
        </div>
    </>
  );
}

function Group({
  label,
  help,
  htmlFor,
  children,
}: {
  label: string;
  help: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-12 gap-x-8 gap-y-3 py-8">
      <div className="col-span-12 md:col-span-4">
        {htmlFor ? (
          <label
            htmlFor={htmlFor}
            className="block serif text-[1rem] text-ink font-semibold"
          >
            {label}
          </label>
        ) : (
          <div className="serif text-[1rem] text-ink font-semibold">{label}</div>
        )}
        <p className="mt-1.5 text-[0.8125rem] leading-6 text-ink-muted">
          {help}
        </p>
      </div>
      <div className="col-span-12 md:col-span-8 max-w-[420px]">{children}</div>
    </div>
  );
}
