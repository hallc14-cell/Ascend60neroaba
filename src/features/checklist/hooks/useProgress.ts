/**
 * useProgress — the single source of truth for the user's progress state.
 *
 * - Boots instantly from the localStorage cache (offline-first, no flicker).
 * - When authenticated, pulls the durable Supabase copy, merges it with any
 *   local/offline progress, and keeps both in sync on every write (debounced).
 * - In guest mode (no auth / no Supabase) it behaves exactly like the original
 *   localStorage store, so all existing functionality is preserved.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import type { ProgressState } from "@/types/progress";
import { useAuth } from "@/features/auth";
import {
  loadLocal,
  saveLocal,
  fetchRemote,
  saveRemote,
  mergeStates,
} from "../services/progressRepository";
import { streakCount } from "../services/progressMath";

interface UseProgressResult {
  store: ProgressState;
  /** Update + persist (local immediately, remote debounced). */
  persist: (next: ProgressState) => void;
  /** True while the initial remote load / merge is in flight. */
  syncing: boolean;
}

export function useProgress(
  protocolId: string,
  resolveTaskXP: (taskId: string) => number
): UseProgressResult {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [store, setStore] = useState<ProgressState>(() => loadLocal());
  const [syncing, setSyncing] = useState<boolean>(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const storeRef = useRef(store);
  storeRef.current = store;

  const computeDerived = useCallback(
    (s: ProgressState) => {
      let totalXp = 0;
      for (const day of Object.keys(s.checks ?? {})) {
        for (const [tid, on] of Object.entries(s.checks[day])) {
          if (on) totalXp += resolveTaskXP(tid);
        }
      }
      return { totalXp, streak: streakCount(s.checks ?? {}) };
    },
    [resolveTaskXP]
  );

  // On sign-in (or protocol change), pull remote and merge with local.
  useEffect(() => {
    let cancelled = false;
    if (!userId) return;
    setSyncing(true);
    (async () => {
      const remote = await fetchRemote(userId, protocolId);
      if (cancelled) return;
      const local = storeRef.current;
      const merged = remote ? mergeStates(remote, local) : local;
      setStore(merged);
      saveLocal(merged);
      // Push merged result back up so remote reflects offline progress.
      await saveRemote(userId, protocolId, merged, computeDerived(merged));
      if (!cancelled) setSyncing(false);
    })().catch(() => {
      if (!cancelled) setSyncing(false);
    });
    return () => {
      cancelled = true;
    };
  }, [userId, protocolId, computeDerived]);

  const persist = useCallback(
    (next: ProgressState) => {
      setStore(next);
      saveLocal(next);
      if (!userId) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        void saveRemote(userId, protocolId, next, computeDerived(next));
      }, 600);
    },
    [userId, protocolId, computeDerived]
  );

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  return { store, persist, syncing };
}
