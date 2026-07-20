/**
 * Shared library surface. Re-exports low-level app libraries (theme helpers,
 * Supabase client) so feature code has one stable import path for shared
 * infrastructure.
 */
export { supabase, isSupabaseConfigured, requireSupabase } from "@/integrations/supabase/client";
export { applyTOD, timeOfDay } from "@/lib/theme";
