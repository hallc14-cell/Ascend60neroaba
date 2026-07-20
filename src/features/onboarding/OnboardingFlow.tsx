/**
 * OnboardingFlow — the first-run experience for a new user.
 *
 *   Welcome  →  Protocol selector  →  (future: goal setting)  →  Dashboard
 *
 * On confirmation it persists the chosen program to:
 *   • the local progress store ("looksmax_v1" key) — protocolId + startDate,
 *     which is what Index.tsx reads to drive the whole experience, and
 *   • the user profile (Supabase when signed in, else localStorage) via
 *     profileService, so the choice syncs across devices.
 *
 * It then routes to the dashboard ("/").
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ProtocolSummary } from "@/types/protocol";
import {
  loadLocal,
  saveLocal,
} from "@/features/checklist/services/progressRepository";
import { updateProfile } from "@/features/profile";
import { ProtocolSelector } from "./ProtocolSelector";

type Step = "welcome" | "select";

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Persist the chosen protocol locally + to the profile, then continue. */
async function commitSelection(protocol: ProtocolSummary): Promise<void> {
  const start = todayISODate();

  // 1) local progress store — the source of truth Index.tsx reads.
  const store = loadLocal();
  saveLocal({
    ...store,
    protocolId: protocol.id,
    // Only set the start date on first selection so re-runs don't reset day 1.
    startDate: store.startDate ?? start,
  });

  // 2) profile (best-effort; never blocks onboarding in guest/offline mode).
  try {
    await updateProfile({
      protocol_id: protocol.id,
      addiction_type: protocol.addictionType,
      program_start_date: start,
    });
  } catch {
    /* offline / not signed in — local store already has what we need */
  }
}

export function OnboardingFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("welcome");
  const [busy, setBusy] = useState(false);

  async function handleSelect(protocol: ProtocolSummary) {
    setBusy(true);
    await commitSelection(protocol);
    setBusy(false);
    navigate("/", { replace: true });
  }

  if (step === "select") {
    return (
      <ProtocolSelector
        onSelect={handleSelect}
        onBack={() => setStep("welcome")}
        busy={busy}
      />
    );
  }

  return <WelcomeScreen onNext={() => setStep("select")} />;
}

/* ── Welcome step ───────────────────────────────────────────────────────── */

function WelcomeScreen({ onNext }: { onNext: () => void }) {
  const pillars = [
    { e: "🧠", t: "Rewire your brain", n: "Neuroscience-based daily tasks that break old habit loops." },
    { e: "✅", t: "One day at a time", n: "A clear checklist every day for 60 days — small wins compound." },
    { e: "🌊", t: "Beat the urges", n: "Urge-surfing tools and coaching for the moments that matter." },
    { e: "📈", t: "See your progress", n: "Streaks, XP and unlocks keep the momentum going." },
  ];

  return (
    <div className="min-h-dvh max-w-[480px] mx-auto flex flex-col justify-center px-6 py-10">
      <div className="rounded-3xl glass-strong p-7 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-aura opacity-20 pointer-events-none" />
        <div className="relative">
          <div className="font-display text-4xl text-center mb-2">
            Welcome to <span className="text-gradient">Ascend</span>60
          </div>
          <p className="text-sm text-muted-foreground text-center mb-6 leading-snug">
            Your 60-day, science-backed path to rewire a habit and become who
            you want to be — one day at a time.
          </p>

          <div className="space-y-3 mb-7">
            {pillars.map((p) => (
              <div
                key={p.t}
                className="flex items-start gap-3 p-3 rounded-2xl bg-surface/60"
              >
                <span className="text-2xl leading-none">{p.e}</span>
                <div>
                  <div className="font-bold text-sm">{p.t}</div>
                  <div className="text-[11px] text-muted-foreground leading-snug">
                    {p.n}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onNext}
            className="w-full rounded-2xl py-3.5 font-display text-base bg-gradient-to-r from-primary to-gold text-black transition-transform active:scale-[0.99]"
          >
            Get started →
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingFlow;
