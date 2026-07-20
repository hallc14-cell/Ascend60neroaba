import { describe, it, expect } from "vitest";
import {
  dayOfProgram,
  phaseForDay,
  streakCount,
  totalXP,
  isUnlocked,
} from "./progressMath";
import type { ProgressState } from "@/types/progress";

describe("progressMath", () => {
  it("dayOfProgram returns 0 with no start date", () => {
    expect(dayOfProgram(undefined)).toBe(0);
  });

  it("dayOfProgram clamps to [1, durationDays]", () => {
    const today = new Date();
    const iso = today.toISOString().slice(0, 10);
    expect(dayOfProgram(iso)).toBe(1);
    // A start date far in the past clamps to the duration.
    expect(dayOfProgram("2000-01-01", 60)).toBe(60);
  });

  it("phaseForDay maps Looksmax boundaries (14/42)", () => {
    expect(phaseForDay(1)).toBe(0);
    expect(phaseForDay(14)).toBe(0);
    expect(phaseForDay(15)).toBe(1);
    expect(phaseForDay(42)).toBe(1);
    expect(phaseForDay(43)).toBe(2);
  });

  it("streakCount counts consecutive days meeting the 70% threshold", () => {
    const checks: ProgressState["checks"] = {
      "2026-07-18": { a: true, b: true, c: true }, // 100%
      "2026-07-19": { a: true, b: true, c: false }, // 66% -> breaks
    };
    // Most recent day is below threshold, so streak is 0.
    expect(streakCount(checks)).toBe(0);
  });

  it("totalXP sums XP only for completed tasks", () => {
    const checks: ProgressState["checks"] = {
      "2026-07-19": { a: true, b: false, c: true },
    };
    const resolve = (id: string) => ({ a: 50, b: 30, c: 20 }[id] ?? 0);
    expect(totalXP(checks, resolve)).toBe(70);
  });

  it("isUnlocked respects day/streak/xp requirements", () => {
    const ctx = { day: 20, streak: 5, xp: 1000 };
    expect(isUnlocked({ requireDay: 14 }, ctx)).toBe(true);
    expect(isUnlocked({ requireDay: 30 }, ctx)).toBe(false);
    expect(isUnlocked({ requireStreak: 10 }, ctx)).toBe(false);
    expect(isUnlocked({ requireXP: 500 }, ctx)).toBe(true);
    expect(isUnlocked({}, ctx)).toBe(true);
  });
});
