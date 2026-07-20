-- ─────────────────────────────────────────────────────────────────────────────
-- Ascend60 · Phase 1 Foundation schema
-- Auth-backed user data, progress persistence, notifications & push devices.
-- All tables are protected with Row Level Security so a user can only ever
-- read/write their own rows (auth.uid() = user_id).
-- ─────────────────────────────────────────────────────────────────────────────

-- Helper: keep updated_at fresh on write
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ── user_profiles ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  display_name TEXT,
  addiction_type TEXT NOT NULL DEFAULT 'looksmax',
  protocol_id TEXT NOT NULL DEFAULT 'looksmax',
  program_start_date DATE,
  primary_triggers TEXT[] NOT NULL DEFAULT '{}',
  preferred_coping TEXT[] NOT NULL DEFAULT '{}',
  timezone TEXT NOT NULL DEFAULT 'America/New_York',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── user_progress (canonical serialized state, 1 row per user+protocol) ───────
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  protocol_id TEXT NOT NULL DEFAULT 'looksmax',
  state JSONB NOT NULL DEFAULT '{}'::jsonb,
  start_date DATE,
  total_xp INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, protocol_id)
);

-- ── task_history (append-only log of task completions) ────────────────────────
CREATE TABLE IF NOT EXISTS public.task_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  protocol_id TEXT NOT NULL DEFAULT 'looksmax',
  task_id TEXT NOT NULL,
  task_date DATE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT true,
  xp INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, protocol_id, task_id, task_date)
);
CREATE INDEX IF NOT EXISTS task_history_user_date_idx
  ON public.task_history (user_id, task_date);

-- ── notification_preferences ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  enabled BOOLEAN NOT NULL DEFAULT false,
  from_hour INTEGER NOT NULL DEFAULT 8,
  to_hour INTEGER NOT NULL DEFAULT 22,
  alarm_mode BOOLEAN NOT NULL DEFAULT false,
  task_reminders BOOLEAN NOT NULL DEFAULT true,
  timezone TEXT NOT NULL DEFAULT 'America/New_York',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── push_devices (OneSignal device/player tokens per user) ────────────────────
CREATE TABLE IF NOT EXISTS public.push_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  onesignal_player_id TEXT,
  platform TEXT,
  user_agent TEXT,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, onesignal_player_id)
);

-- ── notification_log (debugging the fallback chain) ───────────────────────────
CREATE TABLE IF NOT EXISTS public.notification_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  success BOOLEAN NOT NULL DEFAULT false,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS notification_log_user_idx
  ON public.notification_log (user_id, created_at DESC);

-- ── updated_at triggers ───────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS trg_user_profiles_updated ON public.user_profiles;
CREATE TRIGGER trg_user_profiles_updated BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_user_progress_updated ON public.user_progress;
CREATE TRIGGER trg_user_progress_updated BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_notif_prefs_updated ON public.notification_preferences;
CREATE TRIGGER trg_notif_prefs_updated BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── auto-provision a profile on signup ────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.user_profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_history            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_devices            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_log        ENABLE ROW LEVEL SECURITY;

-- Generic "owner can do everything with their own rows" policies.
DO $$
DECLARE
  t TEXT;
  tables TEXT[] := ARRAY[
    'user_profiles', 'user_progress', 'task_history',
    'notification_preferences', 'push_devices', 'notification_log'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "owner_select_%1$s" ON public.%1$I;', t);
    EXECUTE format('DROP POLICY IF EXISTS "owner_insert_%1$s" ON public.%1$I;', t);
    EXECUTE format('DROP POLICY IF EXISTS "owner_update_%1$s" ON public.%1$I;', t);
    EXECUTE format('DROP POLICY IF EXISTS "owner_delete_%1$s" ON public.%1$I;', t);

    EXECUTE format(
      'CREATE POLICY "owner_select_%1$s" ON public.%1$I FOR SELECT USING (auth.uid() = user_id);', t);
    EXECUTE format(
      'CREATE POLICY "owner_insert_%1$s" ON public.%1$I FOR INSERT WITH CHECK (auth.uid() = user_id);', t);
    EXECUTE format(
      'CREATE POLICY "owner_update_%1$s" ON public.%1$I FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);', t);
    EXECUTE format(
      'CREATE POLICY "owner_delete_%1$s" ON public.%1$I FOR DELETE USING (auth.uid() = user_id);', t);
  END LOOP;
END $$;
