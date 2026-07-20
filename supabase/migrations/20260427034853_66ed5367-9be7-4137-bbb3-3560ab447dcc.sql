ALTER TABLE public.push_subscriptions
  ADD COLUMN IF NOT EXISTS task_reminders boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS start_date date,
  ADD COLUMN IF NOT EXISTS timezone text NOT NULL DEFAULT 'UTC',
  ADD COLUMN IF NOT EXISTS last_task_key text;

CREATE INDEX IF NOT EXISTS push_subscriptions_task_reminders_idx
  ON public.push_subscriptions (task_reminders, timezone)
  WHERE task_reminders = true;