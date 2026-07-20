import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import type { UserProfile } from "@/types/auth";
import { env } from "@/config/env";

/**
 * Read/write helpers for the `user_profiles` table. In guest mode (Supabase not
 * configured, or no signed-in user) profiles are persisted to localStorage so
 * the settings still work locally.
 */

const LOCAL_KEY = "ascend60_profile_v1";

function localProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

function saveLocalProfile(profile: UserProfile) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(profile));
  } catch {
    /* ignore quota errors */
  }
}

function defaultProfile(userId = "guest"): UserProfile {
  return {
    user_id: userId,
    display_name: null,
    addiction_type: "looksmax",
    protocol_id: env.defaultProtocolId,
    program_start_date: null,
    primary_triggers: [],
    preferred_coping: [],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

/** Fetch the current user's profile (remote when possible, else local). */
export async function getProfile(): Promise<UserProfile> {
  if (isSupabaseConfigured && supabase) {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (userId) {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (!error && data) return data as UserProfile;
      // Row may not exist yet (trigger race) — fall back to a default seeded row.
      return { ...defaultProfile(userId), display_name: userData?.user?.email ?? null };
    }
  }
  return localProfile() ?? defaultProfile();
}

/** Persist a partial profile update. */
export async function updateProfile(
  patch: Partial<UserProfile>,
): Promise<{ error: string | null }> {
  if (isSupabaseConfigured && supabase) {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (userId) {
      const { error } = await supabase
        .from("user_profiles")
        .upsert(
          { user_id: userId, ...patch, updated_at: new Date().toISOString() },
          { onConflict: "user_id" },
        );
      return { error: error?.message ?? null };
    }
  }
  // Guest mode
  const current = localProfile() ?? defaultProfile();
  saveLocalProfile({ ...current, ...patch });
  return { error: null };
}
