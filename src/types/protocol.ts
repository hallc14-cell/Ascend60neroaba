/**
 * Domain types for the data-driven 60-day protocol system.
 *
 * A "protocol" is a complete 60-day program (tasks, phases, quotes, unlocks,
 * study plan, etc). The original app hard-coded a single "Looksmax" program;
 * these types make programs swappable so Phase 2 can add multiple addiction
 * types without touching UI code.
 */

export type TaskCategory =
  | "looks"
  | "body"
  | "mind"
  | "fuel"
  | "ritual"
  | "money"
  | "faith"
  // recovery-oriented categories (Phase 2 addiction programs)
  | "cbt"
  | "mindfulness"
  | "physical"
  | "social"
  | "reflection";

export type Task = {
  id: string;
  emoji: string;
  title: string;
  note: string;
  xp: number;
  cat: TaskCategory;
  hour?: number; // 0-23, displayed in 12-hour
};

export type Phase = {
  id: number;
  label: string;
  weeks: string;
  weekRange: [number, number];
  title: string;
  tag: string;
  vibe: string;
  rank: string;
  kcal: string;
  protein: string;
  carbs: string;
  fat: string;
  split: string;
};

export type Unlock = {
  id: string;
  name: string;
  emoji: string;
  blurb: string;
  requireDay?: number;
  requireStreak?: number;
  requireXP?: number;
};

/**
 * Addiction / focus type a protocol targets. "looksmax" is the original
 * self-improvement program. The rest are placeholders wired up in Phase 2.
 */
export type AddictionType =
  | "looksmax"
  | "alcohol"
  | "opioid"
  | "food"
  | "digital"
  | "general";

/**
 * A complete, self-contained 60-day program. The UI reads everything it needs
 * from this shape, so swapping the active protocol swaps the whole experience.
 */
export interface ProtocolDefinition {
  /** stable id used to select / persist the active protocol */
  id: AddictionType | string;
  /** which addiction/focus type this program targets */
  addictionType: AddictionType;
  /** human-facing program name */
  name: string;
  /** short marketing/description line */
  tagline: string;
  /** total days in the program (usually 60) */
  durationDays: number;
  phases: Phase[];
  /** tasks keyed by phase id (0,1,2...) */
  dailyTasks: Record<number, Task[]>;
  quotes: string[];
  unlocks: Unlock[];
  /** phase boundaries — day <= boundary[i] belongs to phase i */
  phaseBoundaries: number[];
}

/** Lightweight descriptor used by selection UIs (onboarding, profile). */
export interface ProtocolSummary {
  id: string;
  addictionType: AddictionType;
  name: string;
  tagline: string;
  durationDays: number;
}
