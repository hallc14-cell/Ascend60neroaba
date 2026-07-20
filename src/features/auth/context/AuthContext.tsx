/**
 * Authentication context.
 *
 * Wraps Supabase Auth and exposes session + auth actions to the app. When
 * Supabase is not configured the provider falls back to a permanent "guest"
 * status so the entire app remains usable offline (local-only mode) — this
 * preserves the original zero-login experience during local development.
 */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import type { AuthStatus, AuthUser } from "@/types/auth";

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  session: Session | null;
  /** true when Supabase auth is available in this build */
  authEnabled: boolean;
  signUp: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<{ error: string | null; needsConfirmation?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function toAuthUser(session: Session | null): AuthUser | null {
  if (!session?.user) return null;
  return { id: session.user.id, email: session.user.email ?? null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<AuthStatus>(
    isSupabaseConfigured ? "loading" : "guest"
  );

  useEffect(() => {
    if (!supabase) {
      setStatus("guest");
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setStatus(data.session ? "authenticated" : "guest");
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setStatus(next ? "authenticated" : "guest");
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      status,
      session,
      user: toAuthUser(session),
      authEnabled: isSupabaseConfigured,

      async signUp(email, password, displayName) {
        if (!supabase) return { error: "Authentication is not configured." };
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: displayName ? { display_name: displayName } : undefined,
            emailRedirectTo:
              typeof window !== "undefined" ? window.location.origin : undefined,
          },
        });
        if (error) return { error: error.message };
        // If email confirmation is required, there's a user but no session.
        const needsConfirmation = !data.session && !!data.user;
        return { error: null, needsConfirmation };
      },

      async signIn(email, password) {
        if (!supabase) return { error: "Authentication is not configured." };
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        return { error: error?.message ?? null };
      },

      async signOut() {
        if (!supabase) return;
        await supabase.auth.signOut();
      },

      async requestPasswordReset(email) {
        if (!supabase) return { error: "Authentication is not configured." };
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/reset-password`
              : undefined,
        });
        return { error: error?.message ?? null };
      },

      async updatePassword(password) {
        if (!supabase) return { error: "Authentication is not configured." };
        const { error } = await supabase.auth.updateUser({ password });
        return { error: error?.message ?? null };
      },
    };
  }, [status, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an <AuthProvider>");
  return ctx;
}
