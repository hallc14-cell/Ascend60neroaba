/** Public API of the notifications feature. */

// Orchestrator
export {
  NotificationService,
  notificationService,
} from "./services/NotificationService";

// Providers
export {
  OneSignalProvider,
  initOneSignal,
  subscribePush,
  unsubscribePush,
  updatePushWindow,
  pushSupported,
} from "./providers/OneSignalProvider";
export {
  InAppProvider,
  onAlarm,
  requestNotifPermission,
  playAlarmTone,
  vibrate,
} from "./providers/InAppProvider";

// Scheduling
export {
  startHourlyReminders,
  stopHourlyReminders,
  fireTestAlarm,
} from "./scheduling/scheduler";

// Templates
export {
  pickQuote,
  taskReminder,
  hourlyCheckIn,
  testReminder,
  milestone,
} from "./templates/message-templates";
