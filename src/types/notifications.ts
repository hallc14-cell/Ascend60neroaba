/** Types for the multi-channel notification system. */

export type NotificationChannel = "onesignal" | "inapp" | "sms";

export interface NotificationPayload {
  title: string;
  body: string;
  /** optional emoji/icon prefix already baked into title by templates */
  tag?: string;
  /** high priority for urgent (e.g. craving) interventions */
  urgent?: boolean;
  /** collapse key to prevent notification spam / dedupe */
  collapseKey?: string;
  /** seconds the push is valid for */
  ttlSeconds?: number;
  /** whether the notification should require user interaction (alarm mode) */
  requireInteraction?: boolean;
  /** arbitrary routing data */
  data?: Record<string, unknown>;
}

export interface SendResult {
  success: boolean;
  channel: NotificationChannel;
  error?: string;
  /** whether the orchestrator should try the next channel in the chain */
  shouldFallback?: boolean;
}

export interface NotificationProvider {
  readonly channel: NotificationChannel;
  /** cheap check — is this channel usable in the current environment/session */
  isAvailable(): Promise<boolean> | boolean;
  send(payload: NotificationPayload): Promise<SendResult>;
}

export interface NotificationAttemptLog {
  at: number; // ms epoch
  channel: NotificationChannel;
  success: boolean;
  error?: string;
  title: string;
}

export type NotifPermResult =
  | { ok: true }
  | { ok: false; reason: "unsupported" | "ios-needs-install" | "denied" | "dismissed" };

export interface ReminderSettings {
  fromHour: number;
  toHour: number;
  alarmMode: boolean;
  startDate?: string;
  taskReminders?: boolean;
}
