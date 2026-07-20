import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import type {
  NotificationAttemptLog,
  NotificationChannel,
  NotificationPayload,
  NotificationProvider,
  SendResult,
} from "@/types/notifications";
import { OneSignalProvider } from "../providers/OneSignalProvider";
import { InAppProvider } from "../providers/InAppProvider";

/**
 * Orchestrates delivery across every notification channel with a resilient
 * fallback chain:
 *
 *   OneSignal push  →  in-app (browser notification / alarm dialog)  →  log-only
 *
 * Every attempt (success or failure, on every channel) is recorded so we can
 * debug the reliability problems reported in earlier versions. Logs go to:
 *   - an in-memory ring buffer (inspectable via `getAttemptLog()`)
 *   - the console (always)
 *   - the `notification_log` Supabase table (best-effort, when configured)
 *
 * SMS/Twilio is intentionally deferred to Phase 4 — the chain is structured so
 * an SMS provider can be appended without touching call sites.
 */

const MAX_LOG_ENTRIES = 100;

export class NotificationService {
  private readonly providers: NotificationProvider[];
  private readonly attempts: NotificationAttemptLog[] = [];

  constructor(providers?: NotificationProvider[]) {
    // Order defines the fallback priority.
    this.providers = providers ?? [new OneSignalProvider(), new InAppProvider()];
  }

  /** In-memory attempt history (most recent last). */
  getAttemptLog(): readonly NotificationAttemptLog[] {
    return this.attempts;
  }

  private record(entry: NotificationAttemptLog) {
    this.attempts.push(entry);
    if (this.attempts.length > MAX_LOG_ENTRIES) {
      this.attempts.splice(0, this.attempts.length - MAX_LOG_ENTRIES);
    }
    const prefix = entry.success ? "✅" : "⚠️";
    console.info(
      `${prefix} [notify:${entry.channel}] "${entry.title}"` +
        (entry.error ? ` — ${entry.error}` : ""),
    );
    void this.persistLog(entry);
  }

  private async persistLog(entry: NotificationAttemptLog) {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) return; // RLS requires an owner; skip anonymous/guest logs.
      await supabase.from("notification_log").insert({
        user_id: userId,
        channel: entry.channel,
        title: entry.title,
        success: entry.success,
        error: entry.error ?? null,
      });
    } catch (e) {
      // Never let logging failures affect delivery.
      console.debug("notification_log insert skipped", e);
    }
  }

  /**
   * Attempt delivery down the fallback chain. Returns the first successful
   * result, or the last failure if every channel is exhausted.
   */
  async send(payload: NotificationPayload): Promise<SendResult> {
    let lastResult: SendResult = {
      success: false,
      channel: "inapp",
      error: "no-providers",
    };

    for (const provider of this.providers) {
      let available = false;
      try {
        available = await provider.isAvailable();
      } catch (e) {
        available = false;
        this.record({
          at: Date.now(),
          channel: provider.channel,
          success: false,
          title: payload.title,
          error: `availability-check-failed: ${e instanceof Error ? e.message : String(e)}`,
        });
        continue;
      }

      if (!available) {
        this.record({
          at: Date.now(),
          channel: provider.channel,
          success: false,
          title: payload.title,
          error: "channel-unavailable",
        });
        continue;
      }

      let result: SendResult;
      try {
        result = await provider.send(payload);
      } catch (e) {
        result = {
          success: false,
          channel: provider.channel,
          error: e instanceof Error ? e.message : String(e),
          shouldFallback: true,
        };
      }

      this.record({
        at: Date.now(),
        channel: result.channel,
        success: result.success,
        title: payload.title,
        error: result.error,
      });

      if (result.success) return result;

      lastResult = result;
      if (result.shouldFallback === false) break;
    }

    // Every channel failed — this is the terminal "log-only" fallback.
    this.record({
      at: Date.now(),
      channel: "inapp",
      success: false,
      title: payload.title,
      error: "all-channels-exhausted",
    });

    return lastResult;
  }
}

/** Shared singleton used across the app. */
export const notificationService = new NotificationService();

export type { NotificationChannel };
