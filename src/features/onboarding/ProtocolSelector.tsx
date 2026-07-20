/**
 * ProtocolSelector — the card-based recovery-track picker shown during
 * onboarding. Lists the six Phase 2 addiction-recovery programs (from the
 * protocol registry) with their icon, accent color, tagline and description.
 *
 * Purely presentational: it reports the chosen protocol id up to the parent
 * onboarding flow, which handles persistence + navigation.
 */
import { useMemo, useState } from "react";
import { listRecoveryProtocols } from "@/features/checklist/services/protocolLoader";
import type { ProtocolSummary } from "@/types/protocol";

interface ProtocolSelectorProps {
  /** Called with the chosen protocol id when the user confirms. */
  onSelect: (protocol: ProtocolSummary) => void;
  /** Optional back handler (returns to the welcome step). */
  onBack?: () => void;
  /** Disable actions while persistence is in flight. */
  busy?: boolean;
}

export function ProtocolSelector({ onSelect, onBack, busy }: ProtocolSelectorProps) {
  const protocols = useMemo(() => listRecoveryProtocols(), []);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = protocols.find((p) => p.id === selectedId) ?? null;

  return (
    <div className="min-h-dvh max-w-[560px] mx-auto flex flex-col px-5 py-8">
      <header className="mb-6 text-center">
        <div className="font-display text-2xl mb-1">
          Choose your <span className="text-gradient">track</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Pick the 60-day program that fits your goal. You can change it later.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 flex-1">
        {protocols.map((p) => {
          const active = p.id === selectedId;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedId(p.id)}
              aria-pressed={active}
              className={[
                "text-left w-full rounded-3xl p-4 transition-all relative overflow-hidden",
                "glass border",
                active
                  ? "border-transparent ring-2 scale-[1.01]"
                  : "border-border hover:border-white/20",
              ].join(" ")}
              style={
                active
                  ? ({
                      // accent glow using the track color
                      boxShadow: `0 0 0 2px ${p.color}`,
                      background: `linear-gradient(135deg, ${p.color}22, transparent 70%)`,
                    } as React.CSSProperties)
                  : undefined
              }
            >
              <div className="flex items-start gap-3">
                <div
                  className="text-3xl leading-none w-12 h-12 flex items-center justify-center rounded-2xl shrink-0"
                  style={{ background: `${p.color}22` }}
                >
                  {p.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg leading-tight">{p.name}</h3>
                    <span
                      className="font-mono text-[9px] tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: `${p.color}22`, color: p.color }}
                    >
                      60 DAYS
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">
                    {p.description ?? p.tagline}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="sticky bottom-0 pt-4 pb-1 bg-gradient-to-t from-background to-transparent">
        <button
          type="button"
          disabled={!selected || busy}
          onClick={() => selected && onSelect(selected)}
          className={[
            "w-full rounded-2xl py-3.5 font-display text-base transition-all",
            selected && !busy
              ? "text-black"
              : "bg-surface text-muted-foreground cursor-not-allowed",
          ].join(" ")}
          style={
            selected && !busy
              ? { background: selected.color }
              : undefined
          }
        >
          {busy
            ? "Starting…"
            : selected
              ? `Start ${selected.name}`
              : "Select a track to continue"}
        </button>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            disabled={busy}
            className="w-full text-center text-sm text-muted-foreground mt-3 py-1"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}

export default ProtocolSelector;
