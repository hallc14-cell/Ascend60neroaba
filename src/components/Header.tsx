import { useEffect, useState } from "react";
import { Phase } from "@/data/protocol";
import heroImg from "@/assets/looksmax-hero.jpg";

type Props = {
  day: number;
  phase: Phase;
  streak: number;
  todayPct: number;
  xpToday: number;
  level: number;
  levelPct: number;
  hasStarted: boolean;
  onStart: () => void;
};

function fmt(ms: number) {
  if (ms <= 0) return "00:00:00";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const p = (n: number) => (n < 10 ? "0" + n : "" + n);
  return `${p(h)}:${p(m)}:${p(s)}`;
}

export function Header({ day, phase, streak, todayPct, xpToday, level, levelPct, hasStarted, onStart }: Props) {
  const [ms, setMs] = useState(() => {
    const n = new Date(); const m = new Date(n); m.setHours(24, 0, 0, 0); return +m - +n;
  });
  useEffect(() => {
    const id = setInterval(() => {
      const n = new Date(); const m = new Date(n); m.setHours(24, 0, 0, 0);
      setMs(+m - +n);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const daysLeft = hasStarted ? 60 - day + 1 : 60;
  const today = new Date();
  const dateLabel = today.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  return (
    <header className="relative overflow-hidden safe-top">
      <div className="absolute inset-0 bg-gradient-aura opacity-80 pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-gradient-primary opacity-20 blur-3xl pointer-events-none animate-float" />

      <div className="relative px-5 pt-8 pb-5">
        {/* top row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-glow ring-2 ring-primary/30">
              <img src={heroImg} alt="" className="w-full h-full object-cover" width={48} height={48} />
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">{dateLabel.toUpperCase()}</div>
              <div className="font-display text-xl leading-none mt-0.5">{phase.title}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">DAYS LEFT</div>
            <div className="font-display text-3xl leading-none text-gradient">{daysLeft}</div>
          </div>
        </div>

        {/* CTA if not started */}
        {!hasStarted && (
          <button
            onClick={onStart}
            className="w-full mb-4 py-4 rounded-2xl bg-gradient-primary text-primary-foreground font-bold text-base shadow-glow active:scale-[0.98] transition-transform animate-glow"
          >
            START THE 60 DAYS →
          </button>
        )}

        {/* Day chip + tag */}
        <div className="flex items-center gap-2 mb-4 text-xs">
          <span className="px-3 py-1 rounded-full glass font-mono tracking-wider">
            DAY <span className="text-primary font-bold">{day}</span> / 60
          </span>
          <span className="px-3 py-1 rounded-full glass font-mono tracking-wider">
            {phase.label} · {phase.weeks.toUpperCase()}
          </span>
        </div>
        <p className="text-sm text-muted-foreground italic mb-4 font-display">"{phase.tag}"</p>

        {/* stats grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Stat label="STREAK" value={`${streak}🔥`} accent />
          <Stat label="TODAY" value={`${todayPct}%`} />
          <Stat label="RESET" value={fmt(ms)} mono />
        </div>

        {/* XP bar */}
        <div>
          <div className="flex justify-between text-[10px] font-mono tracking-wider mb-1.5">
            <span className="text-muted-foreground">LVL {level} · {phase.rank.toUpperCase()}</span>
            <span className="text-primary font-bold">+{xpToday} XP TODAY</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-primary rounded-full transition-all duration-700 shadow-glow"
              style={{ width: `${levelPct}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function Stat({ label, value, accent, mono }: { label: string; value: string; accent?: boolean; mono?: boolean }) {
  return (
    <div className="glass rounded-2xl p-3">
      <div className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground mb-1">{label}</div>
      <div className={`text-lg font-bold leading-none ${accent ? "text-primary" : ""} ${mono ? "font-mono text-base" : ""}`}>{value}</div>
    </div>
  );
}