import { QUOTES } from "@/data/protocol";
import type { NotificationPayload } from "@/types/notifications";
import type { Task } from "@/types/protocol";

/**
 * Centralised notification copy. Keeping every user-facing string here means
 * the same content can be reused across channels (OneSignal push, in-app
 * browser notification, in-app alarm dialog) and swapped per protocol later.
 */

export function pickQuote(): string {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

/** Reminder tied to a specific scheduled task for the current hour. */
export function taskReminder(task: Task, quote = pickQuote()): NotificationPayload {
  return {
    title: `${task.emoji} ${task.title}`,
    body: task.note ?? quote,
    tag: "ascend60-hourly",
    collapseKey: "hourly",
    requireInteraction: false,
    data: { kind: "task", taskId: task.id },
  };
}

/** Generic hourly check-in when no task maps to the current hour. */
export function hourlyCheckIn(alarmMode = false, quote = pickQuote()): NotificationPayload {
  return {
    title: alarmMode ? "🚨 ALARM — Check in" : "🔔 Hourly check-in",
    body: quote,
    tag: "ascend60-hourly",
    collapseKey: "hourly",
    urgent: alarmMode,
    requireInteraction: alarmMode,
    data: { kind: "checkin" },
  };
}

/** Manual test notification fired from the reminder settings UI. */
export function testReminder(alarmMode = true, quote = pickQuote()): NotificationPayload {
  return {
    title: alarmMode ? "🚨 ALARM — Test" : "🔔 Test reminder",
    body: quote,
    tag: "ascend60-test",
    collapseKey: "test",
    urgent: alarmMode,
    requireInteraction: alarmMode,
    data: { kind: "test" },
  };
}

/** Encouragement after a milestone (streak / unlock) — used by future phases. */
export function milestone(title: string, body: string): NotificationPayload {
  return {
    title,
    body,
    tag: "ascend60-milestone",
    collapseKey: "milestone",
    data: { kind: "milestone" },
  };
}
