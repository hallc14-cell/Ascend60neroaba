# Ascend60

**Ascend60** is an AI-powered, 60-day addiction recovery platform. It combines
daily neuroscience-based checklists with proactive AI coaching (SMS + push) to
help users rewire habit loops (cue → routine → reward), regulate dopamine, and
build lasting neuroplastic change over a structured 60-day program.

It is built on a **data-driven protocol engine**, so each recovery track is just
a 60-day JSON protocol — new tracks are added without touching the UI.

### Recovery tracks

Ascend60 ships six 60-day recovery tracks, each grounded in the project's
neuroscience research:

| Track | Focus |
| --- | --- |
| 🍺 **Alcohol** | Sobriety, urge surfing, trigger management |
| 💊 **Opioids** | Recovery support, craving regulation, relapse prevention |
| ⚖️ **Weight Loss** | Sustainable habits, nutrition & movement |
| 📵 **Digital Detox** | Screen-time reduction, dopamine reset |
| ⚡ **Productivity** | Focus, deep work, procrastination recovery |
| 🌱 **General Health** | Holistic wellness, sleep, mindfulness |

This repository is the **Phase 1 foundation**: modular feature architecture,
Supabase auth & persistence, a resilient multi-channel notification system, and
environment-based configuration — while preserving the gamified experience
(XP, levels, streaks, unlocks) and installable PWA behaviour.

---

## Quick start

```bash
git clone <your-repo-url> ascend60
cd ascend60
cp .env.example .env      # fill in your keys (optional for local dev — see below)
npm install
npm run dev               # http://localhost:8080
```

Other scripts:

```bash
npm run build             # production build (Vite)
npm run test              # unit tests (Vitest)
npm run lint              # ESLint
```

### Guest mode (no configuration required)

The app runs with **zero configuration**. When Supabase env vars are absent it
falls back to a local-only **guest mode**: all progress is stored in
`localStorage` (key `looksmax_v1`) exactly like the original app, and every
feature keeps working. Add Supabase credentials to enable accounts, cloud sync,
and cross-device persistence.

---

## Environment variables

All configuration is read through `src/config/env.ts`. Copy `.env.example` to
`.env` and set what you need. `.env` is git-ignored; **never commit secrets**.

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | for auth/sync | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | for auth/sync | Supabase anon/publishable key (`VITE_SUPABASE_ANON_KEY` also accepted) |
| `VITE_ONESIGNAL_APP_ID` | for push | OneSignal application id (falls back to the bundled default) |
| `VITE_DEFAULT_PROTOCOL_ID` | no | Active protocol id (default `looksmax`) |

Server-only secrets (OneSignal REST API key, Supabase service-role key, and — in
Phase 4 — Twilio credentials) must **never** be exposed with a `VITE_` prefix.
They belong in server/edge-function environments only; see the commented block in
`.env.example`.

`validateEnv()` runs at boot (`src/main.tsx`) and logs a clear warning if
configuration is incomplete, without crashing the app.

---

## Architecture

Feature-based, modular structure. Each feature owns its UI, services, and data.

```
src/
├── config/                # env access & validation (src/config/env.ts)
├── types/                 # shared TypeScript types (protocol, progress, auth, notifications)
├── features/
│   ├── auth/              # Supabase auth: context, ProtectedRoute, login/signup/reset pages
│   ├── checklist/         # the 60-day program engine
│   │   ├── data/          # protocol definitions + registry (looksmax, …)
│   │   ├── services/      # protocolLoader, progressMath, progressRepository
│   │   └── hooks/         # useProgress (offline-first + Supabase sync)
│   ├── notifications/     # multi-channel notification system (see below)
│   ├── profile/           # profile & program-selection settings
│   └── onboarding/        # (reserved for Phase 2)
├── shared/                # cross-feature hooks/utils/lib
├── integrations/supabase/ # generated client + typed schema
├── components/            # shared UI (shadcn/ui) + app-specific components
├── pages/                 # route entry points (Index, NotFound)
└── data/protocol.ts       # legacy data module — re-exports types & content (kept for compat)
```

### Data-driven protocols

The whole experience is driven by a `ProtocolDefinition`
(`src/types/protocol.ts`). The active protocol is resolved by
`src/features/checklist/services/protocolLoader.ts` from (in priority order): an
explicit id → persisted progress/profile → `VITE_DEFAULT_PROTOCOL_ID` → registry
default (Looksmax). New programs are added by dropping a definition into
`src/features/checklist/data/protocols/` and registering it in `registry.ts` —
no UI changes required.

### Progress & persistence

`useProgress` is the single source of truth. It boots instantly from
`localStorage` (offline-first, no flicker) and, when authenticated, pulls the
Supabase copy, merges it with local/offline progress, and keeps both in sync with
debounced writes. Guest mode behaves exactly like the original local store.

State is persisted as JSONB in `user_progress.state` (canonical) with a
`task_history` audit log.

### Notifications (resilient fallback chain)

`src/features/notifications/` orchestrates delivery across channels with a
graceful fallback chain and full attempt logging (a direct response to prior
reliability issues):

```
OneSignal push  →  in-app (browser notification / alarm dialog)  →  log-only
```

- `services/NotificationService.ts` — orchestrator; tries each channel, logs
  every attempt (in-memory ring buffer + console + `notification_log` table).
- `providers/OneSignalProvider.ts` — OneSignal init, subscription, tags, delivery.
- `providers/InAppProvider.ts` — browser Notification API + synthesized alarm
  tone/vibration + in-app dialog subscribers.
- `scheduling/scheduler.ts` — client-side hourly reminders within the user window.
- `templates/message-templates.ts` — all user-facing notification copy.

SMS/Twilio is intentionally deferred to Phase 4; a provider can be appended to
the chain without touching call sites. The old `src/lib/notifications.ts` and
`src/lib/push.ts` remain as thin backward-compat shims.

---

## Database

The Supabase schema lives in `supabase/migrations/`. The Phase 1 migration
(`20260719000000_phase1_foundation.sql`) creates:

- `user_profiles` — display name, active protocol/addiction type, program start,
  triggers, coping preferences, timezone (auto-created on signup via trigger).
- `user_progress` — canonical progress state (JSONB) + derived XP/streak.
- `task_history` — per-task completion audit log.
- `notification_preferences` — reminder window, alarm mode, channel opt-ins.
- `push_devices` — OneSignal player ids per device.
- `notification_log` — delivery attempts across all channels.

Every table has **Row Level Security** enabled with owner-only policies
(`auth.uid() = user_id`).

Apply migrations with the Supabase CLI:

```bash
supabase db push
```

---

## Auth

Email/password auth via Supabase (`src/features/auth/`): login, signup,
forgot-password, and reset-password flows, session management, and
`ProtectedRoute`. When Supabase is unconfigured, `ProtectedRoute` transparently
allows access (guest mode) so local development never requires credentials.

---

## Tech stack

React 18 · TypeScript · Vite · Tailwind CSS · shadcn/ui · React Router ·
TanStack Query · Supabase · OneSignal · Vitest. Ships as an installable PWA.
