import { Card } from "@/components/ui/card";
import { PHASES, SUPPLEMENTS, CRAVING_KILLERS, COURSES, SOCIAL_VISION, WORKOUT_SPLIT, Phase } from "@/data/protocol";

export function PlanTab({ activePhaseId }: { activePhaseId: number }) {
  const aiCourses = COURSES.filter((c) => c.topic === "ai");
  const tradingCourses = COURSES.filter((c) => c.topic === "trading");

  return (
    <div className="space-y-4">
      {PHASES.map((p) => (
        <PhaseCard key={p.id} phase={p} active={p.id === activePhaseId} />
      ))}

      <Card className="glass-strong border-0 p-5 rounded-3xl">
        <div className="font-mono text-[10px] tracking-[0.3em] text-primary mb-3">DAILY SUPPLEMENT STACK</div>
        <div className="space-y-3">
          {SUPPLEMENTS.map((s) => (
            <div key={s.time} className="flex flex-col gap-1 pb-3 border-b border-border last:border-0 last:pb-0">
              <div className="font-mono text-[10px] tracking-wider text-primary">{s.time.toUpperCase()}</div>
              <div className="text-sm leading-relaxed">{s.items}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="glass border-0 p-5 rounded-3xl">
        <div className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground mb-3">THE 6 PILLARS</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { e: "🥶", t: "Cold Exposure",  n: "De-puffs face. Sharpens jawline. Forges discipline before 9 AM." },
            { e: "🏋️", t: "Free Weights",   n: "Push / Pull / Legs. Long sets, full coverage, muscle protected on the cut." },
            { e: "🍳", t: "Calorie Honesty", n: "2 meals · hit protein · log every bite. Awareness is the deficit." },
            { e: "🛏️", t: "Sleep 8+ hrs",   n: "The #1 looksmax AND the trader's edge. Lights out by midnight." },
            { e: "🤖", t: "AI + Markets",   n: "30-45 min daily. Stack the skill. Stack the bag. Compound it." },
            { e: "✝️", t: "Faith Daily",    n: "Morning + night prayer · 1 gospel passage · Hallow at hand." },
          ].map((p) => (
            <div key={p.t} className="p-3 rounded-2xl bg-surface/60">
              <div className="text-2xl mb-1">{p.e}</div>
              <div className="font-bold text-sm mb-1">{p.t}</div>
              <div className="text-[11px] text-muted-foreground leading-snug">{p.n}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="glass-strong border-0 p-5 rounded-3xl">
        <div className="font-mono text-[10px] tracking-[0.3em] text-primary mb-1">PUSH / PULL / LEGS</div>
        <div className="font-display text-lg leading-tight mb-3">Free weights. Long sets. Full body covered.</div>
        <div className="space-y-4">
          {WORKOUT_SPLIT.map((d) => (
            <div key={d.id}>
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-display text-base">{d.name}</span>
                <span className="font-mono text-[10px] tracking-wider text-muted-foreground">{d.focus}</span>
              </div>
              <div className="space-y-1.5">
                {d.exercises.map((ex) => (
                  <div key={ex.name} className="flex items-baseline justify-between gap-3 p-2 rounded-xl bg-surface/60">
                    <div className="min-w-0">
                      <div className="font-semibold text-sm leading-tight truncate">{ex.name}</div>
                      <div className="text-[10px] text-muted-foreground leading-tight">{ex.muscle}</div>
                    </div>
                    <span className="font-mono text-xs text-primary whitespace-nowrap">{ex.sets}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-[11px] text-muted-foreground italic leading-snug">
          Rule: longer sets (10-15 reps) at RPE 7-8. Hits every muscle group across the week and protects mass in a deficit.
        </div>
      </Card>

      <Card className="glass border-0 p-5 rounded-3xl">
        <div className="font-mono text-[10px] tracking-[0.3em] text-gold mb-3">CRAVING KILLERS</div>
        <div className="space-y-2">
          {CRAVING_KILLERS.map((c) => (
            <div key={c.title} className="flex items-start gap-3 p-2.5 rounded-2xl bg-surface/60">
              <span className="text-xl leading-none mt-0.5">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{c.title}</div>
                <div className="text-[11px] text-muted-foreground leading-snug">{c.note}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="glass-strong border-0 p-5 rounded-3xl">
        <div className="font-mono text-[10px] tracking-[0.3em] text-primary mb-3">AI COURSES — start here</div>
        <CourseList items={aiCourses} />
      </Card>

      <Card className="glass-strong border-0 p-5 rounded-3xl">
        <div className="font-mono text-[10px] tracking-[0.3em] text-primary mb-3">DAY-TRADING & MARKETS</div>
        <CourseList items={tradingCourses} />
        <div className="mt-3 text-[11px] text-muted-foreground italic">
          Paper-trade for 30+ days before risking real capital. Journal every entry.
        </div>
      </Card>

      <Card className="glass border-0 p-5 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-aura opacity-20 pointer-events-none" />
        <div className="relative">
          <div className="font-mono text-[10px] tracking-[0.3em] text-aura mb-2">FUTURE BUILD</div>
          <div className="font-display text-2xl leading-tight mb-2">{SOCIAL_VISION.name}</div>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{SOCIAL_VISION.pitch}</p>
          <div className="space-y-2 mb-3">
            {SOCIAL_VISION.pillars.map((p) => (
              <div key={p} className="text-sm leading-snug p-2 rounded-xl bg-surface/60">{p}</div>
            ))}
          </div>
          <div className="text-[11px] font-mono tracking-wider text-primary">
            WEEKLY: {SOCIAL_VISION.weeklyStep}
          </div>
        </div>
      </Card>
    </div>
  );
}

function CourseList({ items }: { items: typeof COURSES }) {
  return (
    <div className="space-y-3">
      {items.map((c) => (
        <a
          key={c.url}
          href={c.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-3 rounded-2xl bg-surface/60 hover:bg-surface transition-colors"
        >
          <div className="font-mono text-[9px] tracking-wider text-muted-foreground mb-0.5">{c.provider.toUpperCase()}</div>
          <div className="font-semibold text-sm leading-tight mb-1">{c.name} ↗</div>
          <div className="text-[11px] text-muted-foreground leading-snug">{c.note}</div>
        </a>
      ))}
    </div>
  );
}

function PhaseCard({ phase, active }: { phase: Phase; active: boolean }) {
  return (
    <Card className={`border-0 p-5 rounded-3xl relative overflow-hidden ${active ? "glass-strong shadow-glow" : "glass"}`}>
      {active && <div className="absolute inset-0 bg-gradient-aura opacity-30 pointer-events-none" />}
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-[10px] tracking-[0.3em] text-primary">{phase.label} · {phase.weeks.toUpperCase()}</span>
          {active && <span className="px-2 py-0.5 rounded-full bg-gradient-primary text-primary-foreground text-[9px] font-mono tracking-wider">ACTIVE</span>}
        </div>
        <div className="font-display text-2xl leading-tight mb-1">{phase.title}</div>
        <p className="text-xs text-muted-foreground italic mb-4 font-display">"{phase.tag}"</p>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <Row k="Calories" v={phase.kcal} />
          <Row k="Protein" v={phase.protein} />
          <Row k="Carbs" v={phase.carbs} />
          <Row k="Fat" v={phase.fat} />
          <div className="col-span-2"><Row k="Training" v={phase.split} /></div>
        </div>
      </div>
    </Card>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="px-3 py-2 rounded-xl bg-surface/60">
      <div className="font-mono text-[9px] tracking-wider text-muted-foreground">{k.toUpperCase()}</div>
      <div className="text-xs font-semibold mt-0.5">{v}</div>
    </div>
  );
}
