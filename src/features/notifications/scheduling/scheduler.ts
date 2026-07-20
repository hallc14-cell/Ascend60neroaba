import { loadProtocol, tasksForDay } from "@/features/checklist/services/protocolLoader";
import { dayOfProgram } from "@/features/checklist/services/progressMath";
import { notificationService } from "../services/NotificationService";
import { hourlyCheckIn, pickQuote, taskReminder, testReminder } from "../templates/message-templates";

/**
 * Client-side hourly reminder scheduler.
 *
 * This complements OneSignal's server-side scheduling: it fires an in-session
 * reminder at the top of each hour within the user's chosen window and routes it
 * through the NotificationService fallback chain. Because it depends on the tab
 * being alive it is a best-effort layer; OneSignal remains the durable channel.
 */

let timer: number | null = null;

/** Resolve the task (if any) scheduled for a given hour of the active protocol. */
function currentTaskForHour(hour: number) {
  try {
    const raw = localStorage.getItem("looksmax_v1");
    const parsed = raw ? JSON.parse(raw) : {};
    const startDate: string | undefined = parsed?.startDate;
    const protocolId: string | undefined = parsed?.protocolId;
    const protocol = loadProtocol(protocolId);
    const day = dayOfProgram(startDate, protocol.durationDays);
    return tasksForDay(protocol, day).find((t) => t.hour === hour);
  } catch {
    return undefined;
  }
}

export function startHourlyReminders(fromHour = 8, toHour = 22, alarmMode = false): void {
  stopHourlyReminders();

  const fire = async () => {
    const h = new Date().getHours();
    if (h < fromHour || h > toHour) return;
    const quote = pickQuote();
    const task = currentTaskForHour(h);
    const payload = task
      ? taskReminder(task, quote)
      : hourlyCheckIn(alarmMode, quote);
    if (alarmMode) {
      payload.urgent = true;
      payload.requireInteraction = true;
    }
    await notificationService.send(payload);
  };

  // Schedule on the next top-of-hour, then every 60 minutes.
  const now = new Date();
  const msToNext = (60 - now.getMinutes()) * 60_000 - now.getSeconds() * 1000;
  timer = window.setTimeout(() => {
    void fire();
    timer = window.setInterval(() => void fire(), 60 * 60 * 1000) as unknown as number;
  }, msToNext) as unknown as number;
}

export function stopHourlyReminders(): void {
  if (timer) {
    clearTimeout(timer);
    clearInterval(timer);
    timer = null;
  }
}

/** Manual fire — for the "Test alarm" button. */
export async function fireTestAlarm(alarmMode = true): Promise<void> {
  await notificationService.send(testReminder(alarmMode));
}
