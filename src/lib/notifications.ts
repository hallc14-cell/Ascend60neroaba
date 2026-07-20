/**
 * Backward-compat shim.
 *
 * The notification system now lives in the notifications feature under
 * `src/features/notifications/`. This module re-exports the public API so
 * existing imports (`@/lib/notifications`) keep working unchanged.
 */
import { initOneSignal } from "@/features/notifications/providers/OneSignalProvider";

// Boot OneSignal as early as possible (no-ops safely when unavailable).
initOneSignal().catch(() => {});

export type { NotifPermResult } from "@/types/notifications";

export {
  requestNotifPermission,
  onAlarm,
  playAlarmTone,
  vibrate,
} from "@/features/notifications/providers/InAppProvider";

export {
  startHourlyReminders,
  stopHourlyReminders,
  fireTestAlarm,
} from "@/features/notifications/scheduling/scheduler";

export { pickQuote } from "@/features/notifications/templates/message-templates";
