const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cron-secret',
  'Content-Type': 'application/json',
};

const QUOTES = [
  'God is your strength. Show up.',
  "Do the next right thing — He's with you.",
  'Discipline is worship. Move.',
  'The body is a temple. Steward it.',
  'Be still — then act with conviction.',
  'Christ in you, the hope of glory.',
  "Run the race set before you. Don't quit.",
  'Small steps, faithfully. Compound the days.',
];

const TASKS: { emoji: string; title: string; note: string; hour: number }[] = [
  { emoji: '⏰', title: 'Wake up — alarm across the room', note: 'No snooze. Discipline starts in second one.', hour: 7 },
  { emoji: '🙏', title: 'Morning prayer + 1 verse', note: 'Open the day with God.', hour: 7 },
  { emoji: '🥶', title: 'Cold shower 2 min', note: 'Shocks the system. Sharpens features.', hour: 8 },
  { emoji: '💧', title: '1L water + electrolytes', note: 'Hydrate before caffeine.', hour: 8 },
  { emoji: '💊', title: 'AM stack', note: 'Vit D · Omega-3 · Multi · Creatine.', hour: 9 },
  { emoji: '🤖', title: 'Study block — 60 min', note: "Open the Study Planner. Hit today's lesson.", hour: 10 },
  { emoji: '🍳', title: 'Brunch — 60g+ protein', note: 'Front-load protein. Meal 1 of 2.', hour: 12 },
  { emoji: '📊', title: 'Study block #2 — 45 min', note: "Build > consume. Apply today's lesson.", hour: 14 },
  { emoji: '📖', title: 'Read 1 gospel passage', note: 'One story per day.', hour: 16 },
  { emoji: '🏋️', title: 'Gym — Push / Pull / Legs', note: "Today's split in the Plan tab.", hour: 18 },
  { emoji: '🍽️', title: 'Dinner — lean + veg', note: 'Hit your daily protein. Meal 2 of 2.', hour: 19 },
  { emoji: '🧂', title: 'Crush cravings — 2 tools', note: 'Sparkling water, movement, brush teeth.', hour: 20 },
  { emoji: '🎯', title: '1hr deep work', note: 'Build the AI project or paper-trade journal entry.', hour: 21 },
  { emoji: '📓', title: 'Journal', note: '3 wins, 1 fix, 1 trade idea.', hour: 22 },
  { emoji: '🕯️', title: 'Night prayer', note: 'Hand the day to God.', hour: 22 },
  { emoji: '🌙', title: 'PM stack', note: 'Magnesium 400mg.', hour: 23 },
  { emoji: '🛏️', title: 'Lights out', note: 'Sleep is the cheat code.', hour: 23 },
];

const NOTIFY_FROM_HOUR = 7;
const NOTIFY_TO_HOUR = 23;

function localHourNow(timeZone = 'America/New_York'): number {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    hour: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const raw = Number(parts.find((p) => p.type === 'hour')?.value ?? '0');
  return raw === 24 ? 0 : raw;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const CRON_SECRET = Deno.env.get('CRON_SECRET') ?? '';
  const cronHeader = req.headers.get('x-cron-secret') ?? '';
  const authHeader = req.headers.get('Authorization') ?? '';
  const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const secretOk = CRON_SECRET.length > 0 && cronHeader === CRON_SECRET;
  const bearerOk = bearer.length > 0 && (bearer === ANON_KEY || bearer === SERVICE_KEY);

  if (!secretOk && !bearerOk) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: corsHeaders,
    });
  }

  const ONESIGNAL_APP_ID = Deno.env.get('ONESIGNAL_APP_ID') ?? '';
  const ONESIGNAL_REST_API_KEY = Deno.env.get('ONESIGNAL_REST_API_KEY') ?? '';

  if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Missing ONESIGNAL_APP_ID or ONESIGNAL_REST_API_KEY in secrets.' }),
      { status: 500, headers: corsHeaders }
    );
  }

  const url = new URL(req.url);
  const isTest = url.searchParams.get('test') === '1';
  const nowHour = localHourNow('America/New_York');

  if (!isTest && (nowHour < NOTIFY_FROM_HOUR || nowHour > NOTIFY_TO_HOUR)) {
    return new Response(
      JSON.stringify({ ok: true, skipped: true, reason: `Outside window (${nowHour}h ET)` }),
      { status: 200, headers: corsHeaders }
    );
  }

  const task = TASKS.find((t) => t.hour === nowHour);
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  const title = isTest
    ? '🧪 Test — notifications are working!'
    : task
      ? `${task.emoji} ${task.title}`
      : '🔔 Hourly check-in';

  const body = isTest
    ? 'If you see this on a locked screen you are fully set up.'
    : task?.note ?? quote;

  const payload = {
    app_id: ONESIGNAL_APP_ID,
    target_channel: 'push',
    headings: { en: title },
    contents: { en: body },
    ttl: 7200,
    priority: 10,
    ios_sound: 'default',
    filters: [
      { field: 'tag', key: 'task_reminders', relation: '=', value: '1' },
      { operator: 'AND' },
      { field: 'tag', key: 'from_hour', relation: '<=', value: String(nowHour) },
      { operator: 'AND' },
      { field: 'tag', key: 'to_hour', relation: '>=', value: String(nowHour) },
    ],
  };

  const resp = await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${ONESIGNAL_REST_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await resp.json().catch(() => ({}));

  return new Response(
    JSON.stringify({ ok: resp.ok, hour: nowHour, onesignal: result }),
    { status: resp.ok ? 200 : 502, headers: corsHeaders }
  );
});
