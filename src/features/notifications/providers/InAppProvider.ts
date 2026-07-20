import type {
  NotificationPayload,
  NotificationProvider,
  NotifPermResult,
  SendResult,
} from "@/types/notifications";

/**
 * In-app / browser provider. This is the reliable fallback when OneSignal push
 * is unavailable (permission not granted, device not subscribed, iOS Safari not
 * installed, etc). It uses:
 *   - the service worker `showNotification` (or the Notification constructor)
 *   - a synthesized WebAudio alarm tone + vibration for "alarm mode"
 *   - an in-app subscriber channel so a React dialog can render the alert even
 *     when the tab is focused and the OS suppresses notifications.
 */

type AlarmSub = (quote: string) => void;
const subs = new Set<AlarmSub>();

/** Subscribe to in-app alarm fires (used by AlarmDialog). Returns unsubscribe. */
export function onAlarm(cb: AlarmSub): () => void {
  subs.add(cb);
  return () => {
    subs.delete(cb);
  };
}

function isIOS(): boolean {
  const ua = navigator.userAgent || "";
  const iPadOS = /Macintosh/.test(ua) && (navigator as any).maxTouchPoints > 1;
  return /iPad|iPhone|iPod/.test(ua) || iPadOS;
}

function isStandalone(): boolean {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (navigator as any).standalone === true
  );
}

export async function requestNotifPermission(): Promise<NotifPermResult> {
  if (!("Notification" in window)) {
    if (isIOS() && !isStandalone()) return { ok: false, reason: "ios-needs-install" };
    return { ok: false, reason: "unsupported" };
  }
  if (Notification.permission === "granted") return { ok: true };
  if (Notification.permission === "denied") return { ok: false, reason: "denied" };
  try {
    const r = await Notification.requestPermission();
    if (r === "granted") return { ok: true };
    if (r === "denied") return { ok: false, reason: "denied" };
    return { ok: false, reason: "dismissed" };
  } catch {
    return { ok: false, reason: "denied" };
  }
}

/** Synthesize a 3-beep alarm via WebAudio (no asset needed). */
export function playAlarmTone(): void {
  try {
    const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const beep = (start: number, freq: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + start + 0.02);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + start + 0.45);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + 0.5);
    };
    beep(0, 880);
    beep(0.55, 1175);
    beep(1.1, 880);
    setTimeout(() => ctx.close().catch(() => {}), 2000);
  } catch {
    /* no-op */
  }
}

/** Vibrate phone if supported. */
export function vibrate(): void {
  try {
    (navigator as any).vibrate?.([400, 150, 400, 150, 600]);
  } catch {
    /* no-op */
  }
}

export class InAppProvider implements NotificationProvider {
  readonly channel = "inapp" as const;

  isAvailable(): boolean {
    // Always available in a browser context — worst case we still fire the
    // in-app subscriber channel and audio/vibration.
    return typeof window !== "undefined";
  }

  async send(payload: NotificationPayload): Promise<SendResult> {
    let delivered = false;

    // 1) OS/browser notification via service worker (works installed & backgrounded)
    if ("Notification" in window && Notification.permission === "granted") {
      try {
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
          delivered = true;
        } else {
          // Fallback to the Notification constructor if no SW registration.
          new Notification(payload.title, {
            body: payload.body,
            icon: "/icon-192.png",
            tag: payload.tag ?? "ascend60",
          });
          delivered = true;
        }
      } catch {
        /* fall through to in-app alarm */
      }
    }

    // 2) Alarm mode / focused-tab fallback: audio + vibrate + in-app dialog.
    if (payload.urgent || payload.requireInteraction) {
      playAlarmTone();
      vibrate();
      subs.forEach((s) => s(payload.body));
      delivered = true;
    } else if (!delivered && subs.size > 0) {
      // Even for non-urgent, if we couldn't show an OS notification but a
      // dialog subscriber is mounted, surface it in-app so nothing is silently lost.
      subs.forEach((s) => s(payload.body));
      delivered = true;
    }

    if (delivered) return { success: true, channel: this.channel };
    return {
      success: false,
      channel: this.channel,
      error: "no-delivery-surface",
      // in-app is the last real channel before pure logging
      shouldFallback: true,
    };
  }
}
