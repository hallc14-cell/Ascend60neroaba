import { Card } from "@/components/ui/card";
import { Task } from "@/data/protocol";

type Props = {
  day: number;
  tasks: Task[];
  checks: Record<string, boolean>;
  xpToday: number;
  streak: number;
  weight?: number;
  weightDelta?: number;
  studyDoneToday?: boolean;
  prayedToday: boolean;
  weeklyXP: number;
};

/**
 * End-of-day summary report. The "close the loop" card — designed to be the
 * last dopamine hit before bed so the habit feels rewarding and addictive.
 */
export function DailySummary({
  day, tasks, checks, xpToday, streak, weight, weightDelta,
  studyDoneToday, prayedToday, weeklyXP,
}: Props) {
  const done = tasks.filter((t) => checks[t.id]);
  const missed = tasks.filter((t) => !checks[t.id]);
  const pct = Math.round((done.length / tasks.length) * 100);

  // Category breakdown for the bar
  const cats: Task["cat"][] = ["body", "fuel", "mind", "money", "faith", "looks", "ritual"];
  const catCount = cats.map((c) => ({
    cat: c,
    total: tasks.filter((t) => t.cat === c).length,
    done: done.filter((t) => t.cat === c).length,
  })).filter((x) => x.total > 0);

  const grade =
    pct >= 95 ? { letter: "S", label: "GOD MODE", color: "text-primary" } :
    pct >= 85 ? { letter: "A", label: "LOCKED IN", color: "text-primary" } :
    pct >= 70 ? { letter: "B", label: "SOLID DAY", color: "text-accent" } :
    pct >= 50 ? { letter: "C", label: "SHOWED UP", color: "text-gold" } :
                { letter: "D", label: "WAKE UP", color: "text-destructive" };

  const CAT_EMOJI: Record<Task["cat"], string> = {
    body: "🏋️", fuel: "🍳", mind: "🧠", money: "📈",
    faith: "✝️", looks: "🪞", ritual: "🌅",
    cbt: "🧩", mindfulness: "🧘", physical: "🏃", social: "🤝", reflection: "📓",
  };

  return (
    <Card className="glass-strong border-0 p-5 rounded-3xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-aura opacity-40 pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-gradient-primary opacity-20 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="font-mono text-[10px] tracking-[0.3em] text-primary">📊 DAILY SUMMARY · DAY {day}</div>
          <div className="font-mono text-[10px] text-muted-foreground">{new Date().toLocaleDateString()}</div>
        </div>

        {/* Hero grade */}
        <div className="flex items-center gap-4 mb-5">
          <div className={`font-display text-7xl leading-none ${grade.color}`}>{grade.letter}</div>
          <div className="flex-1">
            <div className="font-display text-2xl leading-tight">{grade.label}</div>
            <div className="font-mono text-[10px] tracking-wider text-muted-foreground">
              {done.length}/{tasks.length} TASKS · {pct}%
            </div>
          </div>
        </div>

        {/* Big stats row */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <Stat label="XP TODAY" value={`+${xpToday}`} accent />
          <Stat label="STREAK" value={`${streak}🔥`} />
          <Stat label="WEEK XP" value={`${weeklyXP}`} />
        </div>

        {/* Category breakdown */}
        <div className="mb-5">
          <div className="font-mono text-[10px] tracking-wider text-muted-foreground mb-2">BY CATEGORY</div>
          <div className="space-y-1.5">
            {catCount.map((c) => {
              const p = (c.done / c.total) * 100;
              return (
                <div key={c.cat} className="flex items-center gap-2">
                  <span className="text-sm w-6">{CAT_EMOJI[c.cat]}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary rounded-full transition-all duration-700"
                      style={{ width: `${p}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground w-8 text-right">{c.done}/{c.total}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wins + misses */}
        {missed.length > 0 && (
          <div className="mb-4 p-3 rounded-2xl bg-surface/70">
            <div className="font-mono text-[10px] tracking-wider text-muted-foreground mb-2">⚠ MISSED ({missed.length})</div>
            <div className="space-y-0.5">
              {missed.slice(0, 4).map((t) => (
                <div key={t.id} className="text-[12px] text-muted-foreground">
                  {t.emoji} {t.title}
                </div>
              ))}
              {missed.length > 4 && <div className="text-[10px] text-muted-foreground italic">+{missed.length - 4} more</div>}
            </div>
          </div>
        )}

        {/* Quick flags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <DayFlag on={!!studyDoneToday} label="📚 Study" />
          <DayFlag on={prayedToday} label="🙏 Prayed" />
          <DayFlag on={!!checks["lift"]} label="🏋️ Lifted" />
          <DayFlag on={!!checks["cold"]} label="🥶 Cold" />
          {weight !== undefined && <DayFlag on={true} label={`⚖️ ${weight} lb`} />}
        </div>

        {/* Weight delta */}
        {weightDelta !== undefined && weightDelta !== 0 && (
          <div className="p-3 rounded-2xl bg-surface/70 mb-3">
            <div className="font-mono text-[10px] tracking-wider text-muted-foreground mb-1">SINCE DAY 1</div>
            <div className={`font-display text-2xl ${weightDelta < 0 ? "text-primary" : "text-muted-foreground"}`}>
              {weightDelta > 0 ? "+" : ""}{weightDelta.toFixed(1)} lb
            </div>
          </div>
        )}

        <div className="font-mono text-[10px] tracking-wider text-primary text-center pt-2 border-t border-border/50">
          {pct >= 85 ? "✦ TOMORROW: KEEP THE STREAK ALIVE ✦" : "✦ TOMORROW IS A NEW DAY · DAY " + (day + 1) + " ✦"}
        </div>
      </div>
    </Card>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl bg-surface/70 p-3 text-center">
      <div className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground mb-1">{label}</div>
      <div className={`font-display text-2xl leading-none ${accent ? "text-gradient" : ""}`}>{value}</div>
    </div>
  );
}

function DayFlag({ on, label }: { on: boolean; label: string }) {
  return (
    <span className={`px-2.5 py-1 rounded-full font-mono text-[10px] tracking-wider ${
      on ? "bg-gradient-primary text-primary-foreground shadow-glow" : "bg-surface/50 text-muted-foreground line-through opacity-60"
    }`}>
      {label}
    </span>
  );
}
