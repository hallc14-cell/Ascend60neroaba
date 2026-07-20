/**
 * Centralised, validated access to environment variables.
 *
 * All runtime configuration flows through this module so that:
 *  - We have a single source of truth for env vars.
 *  - Missing / malformed values fail loudly in development but degrade
 *    gracefully in production (the app still boots in "guest/offline" mode).
 *
 * Vite exposes only variables prefixed with `VITE_` to the client bundle.
 */

type RawEnv = ImportMetaEnv & Record<string, string | undefined>;

const raw = (import.meta.env ?? {}) as RawEnv;

function read(key: string): string | undefined {
  const val = raw[key];
  if (val === undefined || val === null) return undefined;
  const trimmed = String(val).trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/** OneSignal application id used by the web push SDK (public value). */
const ONESIGNAL_APP_ID =
  read("VITE_ONESIGNAL_APP_ID") ?? "7f16f2a1-f352-48af-94af-91b7b384dd4a";

const SUPABASE_URL = read("VITE_SUPABASE_URL");
const SUPABASE_ANON_KEY =
  read("VITE_SUPABASE_PUBLISHABLE_KEY") ?? read("VITE_SUPABASE_ANON_KEY");

/**
 * Whether Supabase is fully configured. When false the app runs in a local,
 * offline "guest" mode using localStorage only — this keeps the entire app
 * usable during local development without secrets, exactly like the original.
 */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const env = {
  supabase: {
    url: SUPABASE_URL ?? "",
    anonKey: SUPABASE_ANON_KEY ?? "",
    configured: isSupabaseConfigured,
  },
  oneSignal: {
    appId: ONESIGNAL_APP_ID,
  },
  /** default active protocol / program id — see features/checklist/data */
  defaultProtocolId: read("VITE_DEFAULT_PROTOCOL_ID") ?? "looksmax",
  mode: raw.MODE ?? "production",
  isDev: Boolean(raw.DEV),
} as const;

/**
 * Emit a single, actionable warning when required config is absent. Never
 * throws — the app is designed to keep working offline so we don't break the
 * excellent existing UX when secrets aren't wired up yet.
 */
export function validateEnv(): { ok: boolean; warnings: string[] } {
  const warnings: string[] = [];

  if (!SUPABASE_URL) {
    warnings.push(
      "VITE_SUPABASE_URL is not set — authentication & cloud sync are disabled (running in local guest mode)."
    );
  }
  if (!SUPABASE_ANON_KEY) {
    warnings.push(
      "VITE_SUPABASE_PUBLISHABLE_KEY (anon key) is not set — authentication & cloud sync are disabled (running in local guest mode)."
    );
  }
  if (!read("VITE_ONESIGNAL_APP_ID")) {
    warnings.push(
      "VITE_ONESIGNAL_APP_ID is not set — falling back to the bundled default app id."
    );
  }

  if (warnings.length && env.isDev) {
    // eslint-disable-next-line no-console
    console.warn(
      "[env] Configuration warnings:\n" + warnings.map((w) => `  • ${w}`).join("\n")
    );
  }

  return { ok: warnings.length === 0, warnings };
}
