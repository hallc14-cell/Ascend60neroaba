/**
 * Pure, side-effect-free progress calculations.
 * (Extracted verbatim from the original `src/lib/storage.ts` so behaviour —
 * streaks, XP, day counting, unlocks — is preserved exactly.)
 */
import type { ProgressState } from "@/types/progress";

export const DEFAULT_PROGRESS: ProgressState = {
  checks: {},
  weights: {},
  notes: {},
  remindFromHour: 8,
  remindToHour: 22,
  alarmMode: false,
  studyDone: {},
  prayerDone: {},
  meals: {},
};

export function todayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Day-of-program (1..durationDays). Compares calendar dates only so timezone
 * offsets & partial days never corrupt the count.
 */
export function dayOfProgram(startDate?: string, durationDays = 60): number {
  if (!startDate) return 0;
  const [sY, sM, sD] = startDate.split("-").map(Number);
  const now = new Date();
  const startMs = Date.UTC(sY, sM - 1, sD);
  const todayMs = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.floor((todayMs - startMs) / 86400000) + 1;
  return Math.max(1, Math.min(durationDays, diff));
}

/** Legacy phase helper (Looksmax boundaries). Prefer protocolLoader.phaseForDay. */
export function phaseForDay(day: number): 0 | 1 | 2 {
  if (day <= 14) return 0;
  if (day <= 42) return 1;
  return 2;
}

export function streakCount(
  checks: ProgressState["checks"],
  requiredPct = 0.7
): number {
  const days = Object.keys(checks).sort().reverse();
  let s = 0;
  for (const d of days) {
    const tasks = checks[d];
    const done = Object.values(tasks).filter(Boolean).length;
    const total = Object.keys(tasks).length;
    if (total === 0) break;
    if (done / total >= requiredPct) s++;
    else break;
  }
  return s;
}

export function totalXP(
  checks: ProgressState["checks"],
  resolveXP: (taskId: string) => number
): number {
  let total = 0;
  for (const day of Object.keys(checks)) {
    for (const [tid, on] of Object.entries(checks[day])) {
      if (on) total += resolveXP(tid);
    }
  }
  return total;
}

export function isUnlocked(
  unlock: { requireDay?: number; requireStreak?: number; requireXP?: number },
  ctx: { day: number; streak: number; xp: number }
): boolean {
  if (unlock.requireDay && ctx.day < unlock.requireDay) return false;
  if (unlock.requireStreak && ctx.streak < unlock.requireStreak) return false;
  if (unlock.requireXP && ctx.xp < unlock.requireXP) return false;
  return true;
}
