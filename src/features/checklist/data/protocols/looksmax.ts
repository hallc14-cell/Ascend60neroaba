/**
 * Default "Looksmax" 60-day program, assembled from the original content in
 * `src/data/protocol.ts` into the data-driven `ProtocolDefinition` shape.
 *
 * This is the reference implementation for how additional addiction-type
 * programs (Phase 2) plug into the loader: build a ProtocolDefinition and
 * register it in `../registry.ts`.
 */
import type { ProtocolDefinition } from "@/types/protocol";
import { PHASES, DAILY_TASKS, QUOTES, UNLOCKS } from "@/data/protocol";

export const looksmaxProtocol: ProtocolDefinition = {
  id: "looksmax",
  addictionType: "looksmax",
  name: "Looksmax OS",
  tagline: "Your 60-day glow-up — body, mind, faith & capital.",
  durationDays: 60,
  phases: PHASES,
  dailyTasks: DAILY_TASKS,
  quotes: QUOTES,
  unlocks: UNLOCKS,
  // day <=14 → phase 0, <=42 → phase 1, else phase 2 (matches original logic)
  phaseBoundaries: [14, 42],
};

export default looksmaxProtocol;
