import OneSignal from "react-onesignal";
import { env } from "@/config/env";
import type {
  NotificationPayload,
  NotificationProvider,
  ReminderSettings,
  SendResult,
} from "@/types/notifications";

/**
 * OneSignal push provider.
 *
 * OneSignal actually *delivers* pushes from the server side (via tags + REST
 * campaigns), so on the client this provider is responsible for:
 *   - initialising the SDK exactly once
 *   - opting the device in / requesting permission
 *   - writing scheduling tags that the server uses to target the device
 *
 * `send()` cannot itself deliver a server push from the browser, so for a
 * client-triggered notification it surfaces the payload through the local
 * service worker (when subscribed) and reports whether the channel is healthy.
 * If the device is not subscribed it reports `shouldFallback` so the
 * orchestrator moves on to the in-app channel.
 */

const ONESIGNAL_APP_ID = env.oneSignal.appId;

let initialized = false;
let initializing: Promise<void> | null = null;

function isIOS(): boolean {
  const ua = navigator.userAgent || "";
  const maxTouchPoints = (navigator as Navigator & { maxTouchPoints?: number }).maxTouchPoints ?? 0;
  const iPadOS = /Macintosh/.test(ua) && maxTouchPoints > 1;
  return /iPad|iPhone|iPod/.test(ua) || iPadOS;
}

function isStandalone(): boolean {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function parsePermission(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value === "granted";
  return typeof Notification !== "undefined" && Notification.permission === "granted";
}

async function waitForPushSubscriptionId(timeoutMs = 12000): Promise<string | null> {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const id = (OneSignal as any)?.User?.pushSubscription?.id;
    if (typeof id === "string" && id.length > 0) return id;
    await new Promise((r) => setTimeout(r, 250));
  }
  return null;
}

export function pushSupported(): boolean {
  if (typeof window === "undefined") return false;
  if (!window.isSecureContext) return false;
  if (!("serviceWorker" in navigator) || !("Notification" in window)) return false;
  if (isIOS() && !isStandalone()) return false;
  return true;
}

export async function initOneSignal(): Promise<void> {
  if (initialized) return;
  if (initializing) return initializing;

  initializing = (async () => {
    try {
      const inIframe = window.self !== window.top;
      const isPreview =
        location.hostname.includes("lovableproject.com") ||
        location.hostname.includes("id-preview--");
      if (inIframe || isPreview || !ONESIGNAL_APP_ID) return;
    } catch {
      return;
    }

    try {
      await OneSignal.init({
        appId: ONESIGNAL_APP_ID,
        serviceWorkerParam: { scope: "/" },
        serviceWorkerPath: "/OneSignalSDKWorker.js",
        serviceWorkerUpdaterPath: "/OneSignalSDKUpdaterWorker.js",
        notifyButton: { enable: false },
        allowLocalhostAsSecureOrigin: false,
        promptOptions: { slidedown: { enabled: false } },
      } as any);

      initialized = true;

      // Cache subscription id when OneSignal creates/replaces it.
      (OneSignal as any)?.User?.pushSubscription?.addEventListener?.("change", (event: any) => {
        const nextId = event?.current?.id ?? event?.current?.token ?? null;
        if (typeof nextId === "string" && nextId.length > 0) {
          localStorage.setItem("onesignal_player_id", nextId);
        }
      });
    } catch (e) {
      console.error("OneSignal init failed", e);
    }
  })();

  await initializing;
  initializing = null;
}

function toOneSignalTags(settings: ReminderSettings) {
  return {
    from_hour: String(settings.fromHour),
    to_hour: String(settings.toHour),
    alarm_mode: settings.alarmMode ? "1" : "0",
    task_reminders: settings.taskReminders ? "1" : "0",
    start_date: settings.startDate ?? "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    platform: isIOS() ? "ios" : "web",
  };
}

async function addTagsWithRetry(settings: ReminderSettings, retries = 5): Promise<boolean> {
  const tags = toOneSignalTags(settings);
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      await OneSignal.User.addTags(tags);
      await new Promise((r) => setTimeout(r, 600));
      const saved = await OneSignal.User.getTags();
      if (saved && (saved as any).from_hour && (saved as any).to_hour) return true;
    } catch (e) {
      console.warn(`Tag attempt ${attempt + 1} failed`, e);
      await new Promise((r) => setTimeout(r, 700));
    }
  }
  return false;
}

export async function subscribePush(settings: ReminderSettings): Promise<boolean> {
  try {
    await initOneSignal();
    await OneSignal.Notifications.requestPermission();

    const granted = parsePermission((OneSignal as any).Notifications?.permission);
    if (!granted) return false;

    await (OneSignal as any)?.User?.pushSubscription?.optIn?.();

    const subscriptionId = await waitForPushSubscriptionId();
    if (subscriptionId) localStorage.setItem("onesignal_player_id", subscriptionId);

    const tagged = await addTagsWithRetry(settings);
    if (!tagged) console.error("Failed to write OneSignal tags after retries");
    return true;
  } catch (e) {
    console.error("subscribePush failed", e);
    return false;
  }
}

export async function updatePushWindow(settings: ReminderSettings): Promise<void> {
  try {
    await initOneSignal();
    await addTagsWithRetry(settings, 3);
  } catch (e) {
    console.error("updatePushWindow failed", e);
  }
}

export async function unsubscribePush(): Promise<void> {
  try {
    await initOneSignal();
    await OneSignal.User.addTags({
      from_hour: "",
      to_hour: "",
      alarm_mode: "0",
      task_reminders: "0",
      start_date: "",
      timezone: "",
      platform: "",
    });
    await (OneSignal as any)?.User?.pushSubscription?.optOut?.();
    localStorage.removeItem("onesignal_player_id");
  } catch (e) {
    console.warn("unsubscribePush failed", e);
  }
}

function isSubscribed(): boolean {
  const id =
    (OneSignal as any)?.User?.pushSubscription?.id ??
    localStorage.getItem("onesignal_player_id");
  return typeof id === "string" && id.length > 0;
}

export class OneSignalProvider implements NotificationProvider {
  readonly channel = "onesignal" as const;

  async isAvailable(): Promise<boolean> {
    if (!ONESIGNAL_APP_ID) return false;
    if (!pushSupported()) return false;
    try {
      await initOneSignal();
    } catch {
      return false;
    }
    return isSubscribed();
  }

  async send(payload: NotificationPayload): Promise<SendResult> {
    try {
      await initOneSignal();

      if (!isSubscribed()) {
        return {
          success: false,
          channel: this.channel,
          error: "device-not-subscribed",
          shouldFallback: true,
        };
      }

      // Surface via the local service worker registration when possible. The
      // server (OneSignal REST) handles scheduled delivery via tags; this keeps
      // an immediate client-side path for foreground/manual sends.
      if ("Notification" in window && Notification.permission === "granted") {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          await reg.showNotification(payload.title, {
            body: payload.body,
            icon: "/icon-192.png",
            badge: "/icon-192.png",
            tag: payload.tag ?? payload.collapseKey ?? "ascend60",
            renotify: true,
            requireInteraction: payload.requireInteraction ?? false,
            data: payload.data,
          } as NotificationOptions);
          return { success: true, channel: this.channel };
        }
      }

      return {
        success: false,
        channel: this.channel,
        error: "no-service-worker",
        shouldFallback: true,
      };
    } catch (e) {
      return {
        success: false,
        channel: this.channel,
        error: e instanceof Error ? e.message : String(e),
        shouldFallback: true,
      };
    }
  }
}
