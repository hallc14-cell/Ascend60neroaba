-- Remove the cron job that contained a hardcoded internal-trigger secret,
-- and reschedule using only the standard Supabase anon-key bearer token,
-- which the edge function already validates against SUPABASE_ANON_KEY.
DO $$
DECLARE jid bigint;
BEGIN
  FOR jid IN SELECT jobid FROM cron.job WHERE jobname IN ('looksmax-hourly-push','send-hourly-push') LOOP
    PERFORM cron.unschedule(jid);
  END LOOP;
END $$;

SELECT cron.schedule(
  'looksmax-hourly-push',
  '0 * * * *',
  $$
  select net.http_post(
    url := 'https://wrdgeckiwoauryxrrpes.supabase.co/functions/v1/send-hourly-push'::text,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.anon_key', true)
    ),
    body := jsonb_build_object('triggered_at', now())
  );
  $$
);