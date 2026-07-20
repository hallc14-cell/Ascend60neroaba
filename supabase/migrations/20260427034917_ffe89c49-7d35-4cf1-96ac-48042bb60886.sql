CREATE OR REPLACE FUNCTION public.current_device_secret()
RETURNS text
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT NULLIF(
    current_setting('request.headers', true)::json ->> 'x-device-secret',
    ''
  );
$$;