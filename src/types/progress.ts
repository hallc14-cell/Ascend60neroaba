/**
 * Types describing the user's progress/state. This mirrors the original
 * localStorage `Store` shape so migration to Supabase preserves data exactly.
 */

export type MealEntry = {
  id: string; // unique per entry (timestamp-based)
  foodId?: string; // ref to RECOMMENDED_FOODS, or undefined for custom
  name: string;
  kcal: number;
  protein: number;
  servings: number; // multiplier
  at: number; // ms since epoch
};

/**
 * The canonical progress/state shape. Identical in structure to the original
 * localStorage store so existing UI logic keeps working unchanged, plus a few
 * additive fields (protocolId) for multi-protocol support.
 */
export type ProgressState = {
  /** which protocol/program this progress belongs to */
  protocolId?: string;
  startDate?: string; // ISO date when user pressed Start
  checks: Record<string, Record<string, boolean>>; // date -> taskId -> done
  weights: Record<string, number>; // date -> weight
  notes: Record<string, string>; // date -> note
  lastQuoteIdx?: number;
  notifEnabled?: boolean;
  remindFromHour?: number; // default 8
  remindToHour?: number; // default 22
  alarmMode?: boolean; // loud alarm + dialog vs just notification
  studyDone?: Record<string, boolean>; // lessonId -> completed
  prayerDone?: Record<string, boolean>; // dateKey -> prayed today
  meals?: Record<string, MealEntry[]>; // date -> logged meals
};

/** Alias kept for backwards compatibility with the original `Store` name. */
export type Store = ProgressState;
