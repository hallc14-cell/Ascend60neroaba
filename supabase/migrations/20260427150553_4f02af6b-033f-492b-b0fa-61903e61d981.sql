SELECT cron.unschedule('looksmax-hourly-push');

SELECT cron.schedule(
  'looksmax-hourly-push',
  '0 * * * *',
  $$
  select net.http_post(
    url := 'https://wrdgeckiwoauryxrrpes.supabase.co/functions/v1/send-hourly-push'::text,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object('triggered_at', now())
  );
  $$
);