"use client";

import { READING_PLANS, type ReadingPlan } from "@/data/reading-plans";

const KEY = "askscripture.plans.v1";

export type ActivePlan = {
  planId: string;
  startedAt: number; // epoch ms
  completedDays: number[]; // day numbers (1-indexed)
};

type State = {
  plans: ActivePlan[];
};

function read(): State {
  if (typeof window === "undefined") return { plans: [] };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { plans: [] };
    return JSON.parse(raw) as State;
  } catch {
    return { plans: [] };
  }
}

function write(state: State) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function getActivePlans(): ActivePlan[] {
  return read().plans;
}

export function getActivePlan(planId: string): ActivePlan | undefined {
  return read().plans.find((p) => p.planId === planId);
}

export function startPlan(planId: string): ActivePlan {
  const state = read();
  const existing = state.plans.find((p) => p.planId === planId);
  if (existing) return existing;
  const next: ActivePlan = {
    planId,
    startedAt: Date.now(),
    completedDays: [],
  };
  write({ plans: [...state.plans, next] });
  return next;
}

export function stopPlan(planId: string) {
  const state = read();
  write({ plans: state.plans.filter((p) => p.planId !== planId) });
}

export function toggleDay(planId: string, day: number) {
  const state = read();
  const plan = state.plans.find((p) => p.planId === planId);
  if (!plan) return;
  const idx = plan.completedDays.indexOf(day);
  if (idx >= 0) plan.completedDays.splice(idx, 1);
  else plan.completedDays.push(day);
  plan.completedDays.sort((a, b) => a - b);
  write(state);
}

export function planProgressPct(
  plan: ActivePlan,
  source: ReadingPlan = READING_PLANS.find((p) => p.id === plan.planId)!,
): number {
  if (!source) return 0;
  return Math.round((plan.completedDays.length / source.days.length) * 100);
}
