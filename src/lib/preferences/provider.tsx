"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_PREFERENCES,
  type UserPreferences,
} from "./types";

const STORAGE_KEY = "askscripture.preferences.v1";

type Ctx = {
  preferences: UserPreferences;
  setPreferences: (next: Partial<UserPreferences>) => void;
  ready: boolean;
};

const PreferencesContext = createContext<Ctx | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPrefs] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<UserPreferences>;
        setPrefs({ ...DEFAULT_PREFERENCES, ...parsed });
      }
    } catch {
      // ignore corrupted state
    }
    setReady(true);
  }, []);

  const setPreferences = useCallback((next: Partial<UserPreferences>) => {
    setPrefs((prev) => {
      const merged = { ...prev, ...next };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch {
        /* quota / private mode */
      }
      return merged;
    });
  }, []);

  const value = useMemo(
    () => ({ preferences, setPreferences, ready }),
    [preferences, setPreferences, ready],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error("usePreferences must be used inside PreferencesProvider");
  }
  return ctx;
}
