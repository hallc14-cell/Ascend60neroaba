import { describe, it, expect } from "vitest";
import {
  loadProtocol,
  phaseForDay,
  tasksForDay,
  resolveTaskXP,
  listProtocols,
  listRecoveryProtocols,
} from "./protocolLoader";

const RECOVERY_IDS = [
  "alcohol-recovery",
  "opioid-recovery",
  "weight-loss",
  "digital-detox",
  "productivity",
  "general-health",
];

describe("protocolLoader", () => {
  it("loads the Looksmax protocol by default", () => {
    const p = loadProtocol();
    expect(p.id).toBe("looksmax");
    expect(p.durationDays).toBe(60);
    expect(p.phases.length).toBeGreaterThanOrEqual(3);
  });

  it("falls back to default for an unknown id", () => {
    const p = loadProtocol("does-not-exist");
    expect(p.id).toBe("looksmax");
  });

  it("phaseForDay uses the protocol boundaries", () => {
    const p = loadProtocol();
    expect(phaseForDay(p, 1)).toBe(0);
    expect(phaseForDay(p, 15)).toBe(1);
    expect(phaseForDay(p, 43)).toBe(2);
  });

  it("tasksForDay returns a non-empty task list for each phase", () => {
    const p = loadProtocol();
    expect(tasksForDay(p, 1).length).toBeGreaterThan(0);
    expect(tasksForDay(p, 30).length).toBeGreaterThan(0);
    expect(tasksForDay(p, 50).length).toBeGreaterThan(0);
  });

  it("resolveTaskXP returns the task's XP, 0 for unknown", () => {
    const p = loadProtocol();
    const firstTask = tasksForDay(p, 1)[0];
    expect(resolveTaskXP(p, firstTask.id)).toBe(firstTask.xp);
    expect(resolveTaskXP(p, "no-such-task")).toBe(0);
  });

  it("listProtocols includes Looksmax", () => {
    const ids = listProtocols().map((p) => p.id);
    expect(ids).toContain("looksmax");
  });

  it("registers all six Phase 2 recovery protocols", () => {
    const ids = listRecoveryProtocols().map((p) => p.id);
    for (const id of RECOVERY_IDS) expect(ids).toContain(id);
    // Recovery list must exclude the default Looksmax program.
    expect(ids).not.toContain("looksmax");
  });

  it("every recovery protocol is a valid, complete 60-day program", () => {
    for (const id of RECOVERY_IDS) {
      const p = loadProtocol(id);
      expect(p.id).toBe(id);
      expect(p.durationDays).toBe(60);
      expect(p.phases.length).toBe(3);
      expect(p.icon).toBeTruthy();
      expect(p.color).toMatch(/^#/);
      // Non-empty task list for a day in each phase (0/1/2).
      for (const day of [1, 20, 45]) {
        const tasks = tasksForDay(p, day);
        expect(tasks.length).toBeGreaterThan(0);
        // Every task id resolves to a positive XP somewhere in the program.
        // (resolveTaskXP returns the first phase's value for ids reused across
        // phases — same behavior as the default Looksmax program.)
        expect(resolveTaskXP(p, tasks[0].id)).toBeGreaterThan(0);
      }
      // Exact XP match for the day-1 (phase 0) tasks.
      const day1 = tasksForDay(p, 1);
      expect(resolveTaskXP(p, day1[0].id)).toBe(day1[0].xp);
      // Required unlock ids consumed by the dashboard exist.
      const unlockIds = p.unlocks.map((u) => u.id);
      for (const req of ["phase2", "phase3", "alarm"]) {
        expect(unlockIds).toContain(req);
      }
    }
  });
});
