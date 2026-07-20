/**
 * Protocol loader — the single entry point the UI uses to obtain the active
 * 60-day program and derive phase/day helpers from it.
 *
 * Data-driven: the active protocol id is resolved from (in priority order)
 *   1. an explicit argument
 *   2. the persisted progress state / user profile
 *   3. the env default (VITE_DEFAULT_PROTOCOL_ID)
 *   4. the registry default (Looksmax)
 */
import type { ProtocolDefinition, Task } from "@/types/protocol";
import { env } from "@/config/env";
import {
  DEFAULT_PROTOCOL_ID,
  getProtocolById,
  getProtocolByAddiction,
  listProtocols,
} from "../data/registry";

export { listProtocols };

/** Resolve a protocol by id with graceful fallback to the default. */
export function loadProtocol(id?: string): ProtocolDefinition {
  const candidate =
    (id && getProtocolById(id)) ||
    getProtocolById(env.defaultProtocolId) ||
    getProtocolById(DEFAULT_PROTOCOL_ID);
  if (!candidate) {
    throw new Error(
      "No protocol registered — check src/features/checklist/data/registry.ts"
    );
  }
  return candidate;
}

/** Resolve a protocol by addiction type, else default. */
export function loadProtocolForAddiction(type?: string): ProtocolDefinition {
  return (type && getProtocolByAddiction(type)) || loadProtocol();
}

/**
 * Which phase a given program-day belongs to, using the protocol's own
 * phaseBoundaries. Mirrors the original hard-coded `phaseForDay`.
 */
export function phaseForDay(protocol: ProtocolDefinition, day: number): number {
  const bounds = protocol.phaseBoundaries;
  for (let i = 0; i < bounds.length; i++) {
    if (day <= bounds[i]) return i;
  }
  return bounds.length; // last phase
}

/** Tasks for a given program-day (resolves the phase internally). */
export function tasksForDay(
  protocol: ProtocolDefinition,
  day: number
): Task[] {
  const phase = phaseForDay(protocol, day);
  return protocol.dailyTasks[phase] ?? protocol.dailyTasks[0] ?? [];
}

/** XP value for a task id within a protocol (searches all phases). */
export function resolveTaskXP(
  protocol: ProtocolDefinition,
  taskId: string
): number {
  for (const phaseTasks of Object.values(protocol.dailyTasks)) {
    const t = phaseTasks.find((x) => x.id === taskId);
    if (t) return t.xp;
  }
  return 0;
}
