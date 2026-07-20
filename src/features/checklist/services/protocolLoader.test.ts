import { describe, it, expect } from "vitest";
import {
  loadProtocol,
  phaseForDay,
  tasksForDay,
  resolveTaskXP,
  listProtocols,
} from "./protocolLoader";

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
});
