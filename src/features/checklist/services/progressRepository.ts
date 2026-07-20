/**
 * Progress persistence layer.
 *
 * Replaces the original localStorage-only `storage.ts` with a dual-write
 * repository:
 *   • localStorage  — instant, offline-first cache (also the whole store in
 *                     guest mode). Uses the original "looksmax_v1" key so any
 *                     existing user data is picked up transparently.
 *   • Supabase      — durable cloud persistence when the user is authenticated
 *                     (survives cache clears / new devices).
 *
 * The data structure is preserved 1:1 (see ProgressState) — Supabase stores the
 * full state as JSONB in `user_progress.state`, plus an append-only
 * `task_history` audit log.
 */
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import type { ProgressState } from "@/types/progress";
import { DEFAULT_PROGRESS } from "./progressMath";

const LOCAL_KEY = "looksmax_v1";

/* ── localStorage (offline cache / guest store) ─────────────────────────────*/

export function loadLocal(): ProgressState {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveLocal(state: ProgressState): void {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / private-mode errors */
  }
}

/* ── merge ──────────────────────────────────────────────────────────────────*/

/** Deep-merge two record-of-record maps (union of keys). */
function mergeNested<T extends Record<string, Record<string, unknown>>>(
  a: T | undefined,
  b: T | undefined
): T {
  const out: Record<string, Record<string, unknown>> = { ...(a ?? {}) };
  for (const [k, v] of Object.entries(b ?? {})) {
    out[k] = { ...(out[k] ?? {}), ...v };
  }
  return out as T;
}

/**
 * Merge remote + local so no completions are lost when a signed-in user has
 * offline progress. Remote is treated as base; local overlays on top (local is
 * the more-recent client-side edit in practice).
 */
export function mergeStates(
  remote: ProgressState,
  local: ProgressState
): ProgressState {
  return {
    ...remote,
    ...local,
    checks: mergeNested(remote.checks, local.checks),
    weights: { ...remote.weights, ...local.weights },
    notes: { ...remote.notes, ...local.notes },
    studyDone: { ...remote.studyDone, ...local.studyDone },
    prayerDone: { ...remote.prayerDone, ...local.prayerDone },
    meals: { ...(remote.meals ?? {}), ...(local.meals ?? {}) },
    startDate: local.startDate ?? remote.startDate,
  };
}

/* ── Supabase (durable cloud) ───────────────────────────────────────────────*/

function canSync(): boolean {
  return isSupabaseConfigured && !!supabase;
}

export async function fetchRemote(
  userId: string,
  protocolId: string
): Promise<ProgressState | null> {
  if (!canSync()) return null;
  const { data, error } = await supabase!
    .from("user_progress")
    .select("state, start_date")
    .eq("user_id", userId)
    .eq("protocol_id", protocolId)
    .maybeSingle();
  if (error) {
    console.warn("[progress] fetchRemote failed:", error.message);
    return null;
  }
  if (!data) return null;
  const state = (data.state as unknown as ProgressState) ?? {};
  return { ...DEFAULT_PROGRESS, ...state };
}

export async function saveRemote(
  userId: string,
  protocolId: string,
  state: ProgressState,
  derived: { totalXp: number; streak: number }
): Promise<void> {
  if (!canSync()) return;
  const { error } = await supabase!.from("user_progress").upsert(
    {
      user_id: userId,
      protocol_id: protocolId,
      state: state as unknown as Json,
      start_date: state.startDate ?? null,
      total_xp: derived.totalXp,
      streak: derived.streak,
    },
    { onConflict: "user_id,protocol_id" }
  );
  if (error) console.warn("[progress] saveRemote failed:", error.message);
}

/** Append/refresh a task completion in the audit log. */
export async function logTaskHistory(
  userId: string,
  protocolId: string,
  taskId: string,
  taskDate: string,
  completed: boolean,
  xp: number
): Promise<void> {
  if (!canSync()) return;
  const { error } = await supabase!.from("task_history").upsert(
    {
      user_id: userId,
      protocol_id: protocolId,
      task_id: taskId,
      task_date: taskDate,
      completed,
      xp,
    },
    { onConflict: "user_id,protocol_id,task_id,task_date" }
  );
  if (error) console.warn("[progress] logTaskHistory failed:", error.message);
}
