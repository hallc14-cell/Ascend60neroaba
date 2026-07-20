-- 1. Add device_secret column (per-device ownership token)
ALTER TABLE public.push_subscriptions
  ADD COLUMN IF NOT EXISTS device_secret text;

-- Backfill any existing rows with a random secret so they remain valid
UPDATE public.push_subscriptions
  SET device_secret = encode(gen_random_bytes(24), 'hex')
  WHERE device_secret IS NULL;

ALTER TABLE public.push_subscriptions
  ALTER COLUMN device_secret SET NOT NULL;

-- 2. Drop the old permissive policies
DROP POLICY IF EXISTS "anyone can read subscriptions" ON public.push_subscriptions;
DROP POLICY IF EXISTS "anyone can insert their device" ON public.push_subscriptions;
DROP POLICY IF EXISTS "anyone can update their device" ON public.push_subscriptions;
DROP POLICY IF EXISTS "anyone can delete their device by endpoint" ON public.push_subscriptions;

-- 3. Helper: read the device secret the client sent in a request header
CREATE OR REPLACE FUNCTION public.current_device_secret()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NULLIF(
    current_setting('request.headers', true)::json ->> 'x-device-secret',
    ''
  );
$$;

-- 4. New strict policies — must present matching device secret
CREATE POLICY "device can read own subscription"
  ON public.push_subscriptions
  FOR SELECT
  TO anon, authenticated
  USING (device_secret = public.current_device_secret());

CREATE POLICY "device can insert own subscription"
  ON public.push_subscriptions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    device_secret IS NOT NULL
    AND length(device_secret) >= 16
    AND device_secret = public.current_device_secret()
  );

CREATE POLICY "device can update own subscription"
  ON public.push_subscriptions
  FOR UPDATE
  TO anon, authenticated
  USING (device_secret = public.current_device_secret())
  WITH CHECK (device_secret = public.current_device_secret());

CREATE POLICY "device can delete own subscription"
  ON public.push_subscriptions
  FOR DELETE
  TO anon, authenticated
  USING (device_secret = public.current_device_secret());

-- Note: the edge function uses the SERVICE ROLE key which bypasses RLS,
-- so the hourly push job can still read every subscription to deliver pushes.
