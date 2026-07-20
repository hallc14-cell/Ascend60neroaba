/**
 * Backward-compat shim.
 *
 * The OneSignal push logic now lives in the notifications feature at
 * `src/features/notifications/providers/OneSignalProvider.ts`. This module is
 * kept so existing imports (`@/lib/push`) keep working; it simply re-exports.
 */
export {
  initOneSignal,
  subscribePush,
  unsubscribePush,
  updatePushWindow,
  pushSupported,
} from "@/features/notifications/providers/OneSignalProvider";
