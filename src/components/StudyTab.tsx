import { Card } from "@/components/ui/card";
import { STUDY_PLAN, Lesson, LEARNING_PATHS, LearningPath } from "@/data/protocol";
import { useMemo, useState } from "react";

const TRACK_LABEL: Record<Lesson["track"], string> = {
  ai: "AI", trading: "MARKETS", build: "BUILD", faith: "FAITH",
};
const TRACK_COLOR: Record<Lesson["track"], string> = {
  ai:      "bg-primary/20 text-primary",
  trading: "bg-gold/20 text-gold",
  build:   "bg-aura/20 text-aura",
  faith:   "bg-accent/20 text-accent",
};

type Filter = "all" | Lesson["track"];

type Props = {
  currentDay: number;
  done: Record<string, boolean>;
  onToggle: (id: string) => void;
};

export function StudyTab({ currentDay, done, onToggle }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [openPath, setOpenPath] = useState<LearningPath["id"] | null>("trading");

  const byWeek = useMemo(() => {
    const m = new Map<number, Lesson[]>();
    const filtered = filter === "all" ? STUDY_PLAN : STUDY_PLAN.filter((l) => l.track === filter);
    for (const l of filtered) {
      const arr = m.get(l.week) || [];
      arr.push(l);
      m.set(l.week, arr);
    }
    return m;
  }, [filter]);

  const totalDone = STUDY_PLAN.filter((l) => done[l.id]).length;
  const todayLesson = STUDY_PLAN.find((l) => l.day === currentDay);

  const currentWeek = currentDay > 0 ? Math.min(8, Math.ceil(currentDay / 7)) : 1;

  const FILTERS: { id: Filter; label: string }[] = [
    { id: "all",     label: "All" },
    { id: "trading", label: "📈 Markets" },
    { id: "ai",      label: "🤖 AI" },
    { id: "build",   label: "🛠️ Build" },
    { id: "faith",   label: "✝️ Faith" },
  ];

  return (
    <div className="space-y-4">
      <Card className="glass-strong border-0 p-5 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-aura opacity-30 pointer-events-none" />
        <div className="relative">
          <div className="font-mono text-[10px] tracking-[0.3em] text-primary mb-2">STUDY PLANNER · 60 DAYS</div>
          <div className="font-display text-2xl leading-tight mb-2">
            {totalDone} / {STUDY_PLAN.length} lessons complete
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-primary rounded-full transition-all duration-700 shadow-glow"
              style={{ width: `${(totalDone / STUDY_PLAN.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Three paths · one path per phase. Day-trading first (you'll never blow an account),
            then AI for corporate skill, then where they meet — the unfair advantage.
          </p>
        </div>
      </Card>

      {/* LEARNING PATHS — beginner trading → AI corporate → synergy */}
      <Card className="glass border-0 p-5 rounded-3xl">
        <div className="font-mono text-[10px] tracking-[0.3em] text-primary mb-3">LEARNING PATHS</div>
        <div className="space-y-3">
          {LEARNING_PATHS.map((p, i) => {
            const isOpen = openPath === p.id;
            return (
              <div key={p.id} className="rounded-2xl bg-surface/70 overflow-hidden border border-border/50">
                <button
                  onClick={() => setOpenPath(isOpen ? null : p.id)}
                  className="w-full p-3 flex items-center gap-3 text-left"
                >
                  <span className="text-2xl">{p.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[9px] tracking-wider text-muted-foreground">PATH {i + 1}</span>
                      <span className="font-mono text-[9px] tracking-wider text-primary">{p.level}</span>
                    </div>
                    <div className="font-bold text-sm leading-tight mt-0.5">{p.name}</div>
                  </div>
                  <span className={`text-xs text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
                </button>
                {isOpen && (
                  <div className="px-3 pb-3 space-y-2 animate-rise">
                    <p className="text-[12px] text-muted-foreground italic px-1">{p.pitch}</p>
                    {p.steps.map((s, si) => (
                      <div key={s.title} className="flex items-start gap-3 p-2.5 rounded-xl bg-background/60">
                        <span className="font-mono text-[10px] text-primary font-bold mt-0.5 w-5 flex-shrink-0">
                          {String(si + 1).padStart(2, "0")}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold leading-snug">{s.title}</div>
                          <div className="text-[11px] text-muted-foreground leading-snug">{s.note}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {todayLesson && (
        <Card className="glass-strong border-0 p-5 rounded-3xl">
          <div className="font-mono text-[10px] tracking-[0.3em] text-primary mb-2">▸ TODAY'S LESSON</div>
          <LessonRow l={todayLesson} done={!!done[todayLesson.id]} onToggle={() => onToggle(todayLesson.id)} highlight />
        </Card>
      )}

      {/* TRACK FILTER */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-full font-mono text-[10px] tracking-wider whitespace-nowrap transition-all ${
              filter === f.id
                ? "bg-gradient-primary text-primary-foreground shadow-glow"
                : "bg-surface/60 text-muted-foreground hover:bg-surface"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {Array.from(byWeek.entries()).map(([week, lessons]) => {
        const isOpen = week <= currentWeek;
        return (
          <details key={week} open={week === currentWeek} className="rounded-3xl glass overflow-hidden">
            <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] tracking-[0.3em] text-primary">WEEK {week}</span>
                {!isOpen && <span className="text-xs text-muted-foreground">🔒 starts Day {(week - 1) * 7 + 1}</span>}
              </div>
              <span className="text-xs text-muted-foreground">
                {lessons.filter((l) => done[l.id]).length}/{lessons.length}
              </span>
            </summary>
            <div className="px-4 pb-4 space-y-2">
              {lessons.map((l) => (
                <LessonRow
                  key={l.id}
                  l={l}
                  done={!!done[l.id]}
                  onToggle={() => onToggle(l.id)}
                  locked={!isOpen}
                />
              ))}
            </div>
          </details>
        );
      })}
    </div>
  );
}

function LessonRow({
  l, done, onToggle, locked, highlight,
}: { l: Lesson; done: boolean; onToggle: () => void; locked?: boolean; highlight?: boolean }) {
  const inner = (
    <div className={`flex items-start gap-3 p-3 rounded-2xl ${highlight ? "bg-surface" : "bg-surface/60"} ${locked ? "opacity-50" : ""}`}>
      <button
        disabled={locked}
        onClick={onToggle}
        className={`flex-shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
          done ? "bg-gradient-primary shadow-glow" : "border-2 border-border"
        }`}
        aria-label="Toggle complete"
      >
        {done && <span className="text-primary-foreground text-xs font-black">✓</span>}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={`text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded ${TRACK_COLOR[l.track]}`}>
            {TRACK_LABEL[l.track]}
          </span>
          <span className="text-[9px] font-mono text-muted-foreground">DAY {l.day} · {l.minutes} min</span>
        </div>
        <div className={`text-sm font-semibold leading-snug ${done ? "line-through text-muted-foreground" : ""}`}>
          {l.title}
        </div>
        <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{l.why}</div>
        {l.url && !locked && (
          <a
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-block mt-1.5 text-[11px] font-mono text-primary hover:underline"
          >
            open resource ↗
          </a>
        )}
      </div>
    </div>
  );
  return inner;
}