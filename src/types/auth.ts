import type { AddictionType } from "./protocol";

/** Row shape for the `user_profiles` table. */
export interface UserProfile {
  id?: string;
  user_id: string;
  display_name: string | null;
  addiction_type: AddictionType | string;
  protocol_id: string;
  program_start_date: string | null; // ISO date
  primary_triggers: string[];
  preferred_coping: string[];
  timezone: string;
  created_at?: string;
  updated_at?: string;
}

/** Auth status surfaced by the AuthContext. */
export type AuthStatus = "loading" | "authenticated" | "guest";

export interface AuthUser {
  id: string;
  email: string | null;
}
