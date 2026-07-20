-- Push subscriptions table for background hourly alarms
create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  from_hour int not null default 8,
  to_hour int not null default 22,
  alarm_mode boolean not null default false,
  user_agent text,
  created_at timestamptz not null default now(),
  last_sent_at timestamptz
);

alter table public.push_subscriptions enable row level security;

-- This is a personal-use single-user app: anyone with the anon key can register a device.
-- No PII is stored — just the push endpoint tokens issued by Apple/Google.
create policy "anyone can insert their device"
  on public.push_subscriptions for insert
  to anon, authenticated
  with check (true);

create policy "anyone can read subscriptions"
  on public.push_subscriptions for select
  to anon, authenticated
  using (true);

create policy "anyone can delete their device by endpoint"
  on public.push_subscriptions for delete
  to anon, authenticated
  using (true);

create policy "anyone can update their device"
  on public.push_subscriptions for update
  to anon, authenticated
  using (true);

create index push_subscriptions_endpoint_idx on public.push_subscriptions(endpoint);