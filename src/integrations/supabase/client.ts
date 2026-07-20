// Supabase browser client.
// Reads validated config from `@/config/env`. When Supabase is not configured
// (no URL / anon key) the app runs in local "guest" mode and `supabase` is null,
// so every caller must guard with `isSupabaseConfigured` / optional chaining.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { env, isSupabaseConfigured } from '@/config/env';

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export { isSupabaseConfigured };

export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(env.supabase.url, env.supabase.anonKey, {
      auth: {
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/** Throwing accessor for code paths that require a configured client. */
export function requireSupabase(): SupabaseClient<Database> {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.'
    );
  }
  return supabase;
}
