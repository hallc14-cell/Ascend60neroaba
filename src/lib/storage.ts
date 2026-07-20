/**
 * Backward-compatibility shim.
 *
 * The original localStorage store has moved to the feature-based architecture:
 *   • pure math helpers → features/checklist/services/progressMath
 *   • persistence       → features/checklist/services/progressRepository
 *   • React state hook  → features/checklist/hooks/useProgress
 *
 * This module re-exports the same public API (loadStore/saveStore/…) so any
 * remaining imports of `@/lib/storage` keep working unchanged.
 */
export type { Store, MealEntry } from "@/types/progress";

export {
  todayKey,
  dayOfProgram,
  phaseForDay,
  streakCount,
  totalXP,
  isUnlocked,
} from "@/features/checklist/services/progressMath";

import { loadLocal, saveLocal } from "@/features/checklist/services/progressRepository";
import type { ProgressState } from "@/types/progress";

/** @deprecated use `useProgress` / progressRepository.loadLocal */
export function loadStore(): ProgressState {
  return loadLocal();
}

/** @deprecated use `useProgress` / progressRepository.saveLocal */
export function saveStore(s: ProgressState): void {
  saveLocal(s);
}
