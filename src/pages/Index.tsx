import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { TaskRow } from "@/components/TaskRow";
import { QuoteCard } from "@/components/QuoteCard";
import { ProgressTab } from "@/components/ProgressTab";
import { PlanTab } from "@/components/PlanTab";
import { StudyTab } from "@/components/StudyTab";
import { FaithTab } from "@/components/FaithTab";
import { ReminderSheet } from "@/components/ReminderSheet";
import { AlarmDialog } from "@/components/AlarmDialog";
import { LockedCard } from "@/components/LockedCard";
import { DailySummary } from "@/components/DailySummary";
import type { Task } from "@/types/protocol";
import type { MealEntry } from "@/types/progress";
import { useProgress } from "@/features/checklist/hooks/useProgress";
import {
  loadProtocol,
  tasksForDay,
  phaseForDay,
  resolveTaskXP as resolveProtocolTaskXP,
} from "@/features/checklist/services/protocolLoader";
import { todayKey, dayOfProgram, streakCount, isUnlocked } from "@/features/checklist/services/progressMath";
import { applyTOD, timeOfDay } from "@/lib/theme";
import { startHourlyReminders } from "@/lib/notifications";
import { subscribePush } from "@/lib/push";

type Tab = "today" | "plan" | "study" | "faith" | "progress" | "settings";

/** Group a list of tasks by time-of-day bucket for cleaner display. */
function bucketTasks(tasks: Task[]) {
  const buckets: { key: string; label: string; emoji: string; tasks: Task[] }[] = [
    { key: "morning",   label: "Morning",   emoji: "🌅", tasks: [] },
    { key: "midday",    label: "Midday",    emoji: "☀️", tasks: [] },
    { key: "afternoon", label: "Afternoon", emoji: "🌤️", tasks: [] },
    { key: "evening",   label: "Evening",   emoji: "🌆", tasks: [] },
    { key: "night",     label: "Night",     emoji: "🌙", tasks: [] },
  ];
  for (const t of tasks) {
    const h = t.hour ?? 12;
    if (h < 10) buckets[0].tasks.push(t);
    else if (h < 13) buckets[1].tasks.push(t);
    else if (h < 17) buckets[2].tasks.push(t);
    else if (h < 21) buckets[3].tasks.push(t);
    else buckets[4].tasks.push(t);
  }
  return buckets.filter((b) => b.tasks.length > 0);
}

const Index = () => {
  const [tab, setTab] = useState<Tab>("today");
  const [, force] = useState(0);

  // Resolve the active protocol (data-driven; defaults to Looksmax).
  const protocolId = (typeof localStorage !== "undefined" &&
    JSON.parse(localStorage.getItem("looksmax_v1") || "{}")?.protocolId) || undefined;
  const protocol = useMemo(() => loadProtocol(protocolId), [protocolId]);
  const resolveXP = useCallback(
    (taskId: string) => resolveProtocolTaskXP(protocol, taskId),
    [protocol]
  );

  const { store, persist } = useProgress(protocol.id, resolveXP);

  // Apply time-of-day theme + refresh every minute
  useEffect(() => {
    applyTOD(timeOfDay());
    const id = setInterval(() => { applyTOD(timeOfDay()); force((n) => n + 1); }, 60_000);
    return () => clearInterval(id);
  }, []);

  // Re-arm reminders on mount if previously enabled
  useEffect(() => {
    if (store.notifEnabled && "Notification" in window && Notification.permission === "granted") {
      startHourlyReminders(store.remindFromHour ?? 8, store.remindToHour ?? 22, !!store.alarmMode);
      void subscribePush({
        fromHour: store.remindFromHour ?? 8,
        toHour: store.remindToHour ?? 22,
        alarmMode: !!store.alarmMode,
        startDate: store.startDate,
        taskReminders: true,
      });
    }
  }, [store.notifEnabled, store.remindFromHour, store.remindToHour, store.alarmMode, store.startDate]);

  const day = dayOfProgram(store.startDate, protocol.durationDays);
  const phaseId = store.startDate ? phaseForDay(protocol, day) : 0;
  const phase = protocol.phases[phaseId];
  const tasks = tasksForDay(protocol, store.startDate ? day : 1);
  const UNLOCKS = protocol.unlocks;

  const tk = todayKey();
  const checks = store.checks[tk] || {};
  const doneTasks = tasks.filter((t) => checks[t.id]);
  const xpToday = doneTasks.reduce((a, t) => a + t.xp, 0);
  const totalXp = useMemo(() => {
    let total = 0;
    Object.entries(store.checks).forEach(([_, c]) => {
      Object.entries(c).forEach(([id, on]) => {
        if (!on) return;
        const t = tasks.find((x) => x.id === id);
        if (t) total += t.xp;
      });
    });
    return total;
  }, [store.checks, tasks]);

  // Last 7 days of XP for the daily-summary "week" stat
  const weeklyXP = useMemo(() => {
    let total = 0;
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today); d.setDate(today.getDate() - i);
      const k = d.toISOString().slice(0, 10);
      const c = store.checks[k] || {};
      Object.entries(c).forEach(([id, on]) => {
        if (!on) return;
        const t = tasks.find((x) => x.id === id);
        if (t) total += t.xp;
      });
    }
    return total;
  }, [store.checks, tasks]);

  // Weight delta from first log → today (or latest)
  const weightEntries = Object.keys(store.weights).sort();
  const weightFirst = weightEntries[0] ? store.weights[weightEntries[0]] : undefined;
  const weightLatest = weightEntries[weightEntries.length - 1] ? store.weights[weightEntries[weightEntries.length - 1]] : undefined;
  const weightDelta = weightFirst !== undefined && weightLatest !== undefined ? weightLatest - weightFirst : undefined;
  const studyDoneToday = useMemo(() => {
    // any study lesson completed in the last 24h is "studied"
    return Object.values(store.studyDone || {}).some(Boolean);
  }, [store.studyDone]);

  // Today's logged meals — used for the mini fuel snapshot on Today tab
  const todayMeals = (store.meals || {})[tk] || [];
  const fuel = todayMeals.reduce(
    (a, m) => ({ kcal: a.kcal + m.kcal * m.servings, protein: a.protein + m.protein * m.servings }),
    { kcal: 0, protein: 0 }
  );

  const level = Math.floor(totalXp / 1000) + 1;
  const levelPct = ((totalXp % 1000) / 1000) * 100;
  const todayPct = Math.round((doneTasks.length / tasks.length) * 100);
  const streak = streakCount(store.checks);

  const unlockCtx = { day, streak, xp: totalXp };
  const unlockMap = useMemo(() => {
    const m: Record<string, boolean> = {};
    UNLOCKS.forEach((u) => (m[u.id] = isUnlocked(u, unlockCtx)));
    return m;
  }, [day, streak, totalXp]);
  const unlockOf = (id: string) => UNLOCKS.find((u) => u.id === id)!;
  const buckets = useMemo(() => bucketTasks(tasks), [tasks]);

  function toggleTask(id: string) {
    const cur = store.checks[tk] || {};
    const next = { ...store, checks: { ...store.checks, [tk]: { ...cur, [id]: !cur[id] } } };
    persist(next);
  }

  function startProgram() {
    persist({ ...store, startDate: tk, protocolId: protocol.id });
  }

  function logProgress(date: string, weight?: number, note?: string) {
    const next = { ...store };
    if (weight !== undefined) next.weights = { ...store.weights, [date]: weight };
    if (note !== undefined) next.notes = { ...store.notes, [date]: note };
    persist(next);
  }

  function addMeal(date: string, entry: MealEntry) {
    const cur = (store.meals || {})[date] || [];
    persist({ ...store, meals: { ...(store.meals || {}), [date]: [...cur, entry] } });
  }

  function removeMeal(date: string, id: string) {
    const cur = (store.meals || {})[date] || [];
    persist({ ...store, meals: { ...(store.meals || {}), [date]: cur.filter((m) => m.id !== id) } });
  }

  function setReminders(enabled: boolean, from: number, to: number, alarmMode: boolean) {
    persist({ ...store, notifEnabled: enabled, remindFromHour: from, remindToHour: to, alarmMode });
  }

  function toggleStudy(id: string) {
    const cur = store.studyDone || {};
    persist({ ...store, studyDone: { ...cur, [id]: !cur[id] } });
  }

  return (
    <div className="min-h-dvh max-w-[480px] mx-auto flex flex-col">
      <AlarmDialog />
      <Link
        to="/profile"
        aria-label="Profile & settings"
        className="fixed top-3 right-3 z-20 w-9 h-9 rounded-full glass-strong flex items-center justify-center text-base active:scale-95 transition-transform"
      >
        👤
      </Link>
      <Header
        day={day || 1}
        phase={phase}
        streak={streak}
        todayPct={isNaN(todayPct) ? 0 : todayPct}
        xpToday={xpToday}
        level={level}
        levelPct={levelPct}
        hasStarted={!!store.startDate}
        onStart={startProgram}
      />

      {/* Tabs */}
      <nav className="sticky top-0 z-10 glass-strong border-b border-border">
        <div className="flex overflow-x-auto no-scrollbar">
          {([
            ["today",    "📅", "Today"],
            ["plan",     "📋", "Plan"],
            ["study",    "🤖", "Study"],
            ["faith",    "✝️", "Faith"],
            ["progress", "📈", "Progress"],
            ["settings", "🔔", "Alarms"],
          ] as [Tab, string, string][]).map(([id, emoji, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 min-w-[64px] py-2.5 px-1 flex flex-col items-center gap-0.5 transition-colors ${
                tab === id ? "text-primary border-b-2 border-primary" : "text-muted-foreground border-b-2 border-transparent"
              }`}
            >
              <span className="text-base leading-none">{emoji}</span>
              <span className="text-[9px] font-mono tracking-wider font-bold leading-none">{label.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 px-4 py-4 pb-20 safe-bottom space-y-4">
        {tab === "today" && (
          <>
            <QuoteCard />
            {!store.startDate && (
              <div className="rounded-3xl glass p-5 text-center">
                <div className="font-display text-xl mb-2">Press <span className="text-gradient">START</span> above</div>
                <p className="text-sm text-muted-foreground">Day 1 begins the moment you commit. 60 days from now you'll be unrecognizable.</p>
              </div>
            )}

            {/* Time-of-day grouped checklist */}
            {buckets.map((b, bi) => {
              const bDone = b.tasks.filter((t) => checks[t.id]).length;
              return (
                <section key={b.key} className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{b.emoji}</span>
                      <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">{b.label.toUpperCase()}</span>
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">{bDone}/{b.tasks.length}</span>
                  </div>
                  {b.tasks.map((t, i) => (
                    <div key={t.id} className="animate-rise" style={{ animationDelay: `${(bi * 50) + i * 20}ms` }}>
                      <TaskRow task={t} done={!!checks[t.id]} onToggle={() => toggleTask(t.id)} />
                    </div>
                  ))}
                </section>
              );
            })}

            <div className="rounded-3xl p-5 glass relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-aura opacity-30 pointer-events-none" />
              <div className="relative">
                <div className="font-mono text-[10px] tracking-[0.3em] text-primary mb-2">THE MINDSET</div>
                <p className="font-display text-lg leading-snug">{phase.vibe}</p>
              </div>
            </div>

            {/* Quick fuel snapshot — full logger lives in Progress tab */}
            {store.startDate && (
              <button
                onClick={() => setTab("progress")}
                className="w-full text-left rounded-3xl p-4 glass-strong active:scale-[0.99] transition-transform"
              >
                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-primary">FUEL · TODAY</span>
                  <span className="text-[10px] font-mono text-muted-foreground">tap to log →</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="font-display text-2xl leading-none">
                      {Math.round(fuel.kcal)}<span className="text-sm text-muted-foreground"> kcal</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">calories logged</div>
                  </div>
                  <div>
                    <div className="font-display text-2xl leading-none">
                      {Math.round(fuel.protein)}<span className="text-sm text-muted-foreground">g</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">protein</div>
                  </div>
                </div>
              </button>
            )}

            {/* Unlocks preview */}
            <section className="space-y-3 pt-2">
              <div className="flex items-center justify-between px-1">
                <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">🏆 UNLOCKS</span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {Object.values(unlockMap).filter(Boolean).length}/{UNLOCKS.length}
                </span>
              </div>
              {UNLOCKS.filter((u) => !unlockMap[u.id]).slice(0, 3).map((u) => (
                <LockedCard key={u.id} unlock={u} ctx={unlockCtx} />
              ))}
              {UNLOCKS.every((u) => unlockMap[u.id]) && (
                <div className="rounded-3xl p-4 glass text-center text-sm text-muted-foreground">
                  All unlocks earned. You are him. 👑
                </div>
              )}
            </section>

            {/* Daily Summary — end of day recap */}
            {store.startDate && (
              <DailySummary
                day={day}
                tasks={tasks}
                checks={checks}
                xpToday={xpToday}
                streak={streak}
                weight={store.weights[tk]}
                weightDelta={weightDelta}
                studyDoneToday={studyDoneToday}
                prayedToday={!!checks["pray_am"] || !!checks["pray_pm"]}
                weeklyXP={weeklyXP}
              />
            )}
          </>
        )}

        {tab === "plan" && (
          <>
            {/* Phase 2 + Phase 3 are gated, but Plan tab itself is always visible */}
            <PlanTab activePhaseId={phaseId} />
            {!unlockMap.phase2 && (
              <LockedCard unlock={unlockOf("phase2")} ctx={unlockCtx} />
            )}
            {!unlockMap.phase3 && (
              <LockedCard unlock={unlockOf("phase3")} ctx={unlockCtx} />
            )}
          </>
        )}
        {tab === "study" && (
          <StudyTab
            currentDay={day || 1}
            done={store.studyDone || {}}
            onToggle={toggleStudy}
          />
        )}
        {tab === "faith" && <FaithTab />}
        {tab === "progress" && (
          <ProgressTab
            weights={store.weights}
            notes={store.notes}
            onLog={logProgress}
            startDate={store.startDate}
            day={store.startDate ? day : 0}
            phaseId={phaseId}
            meals={(store.meals || {})[tk] || []}
            onAddMeal={addMeal}
            onRemoveMeal={removeMeal}
          />
        )}
        {tab === "settings" && (
          <ReminderSheet
            enabled={!!store.notifEnabled}
            fromHour={store.remindFromHour ?? 8}
            toHour={store.remindToHour ?? 22}
            alarmMode={!!store.alarmMode}
            alarmUnlocked={!!unlockMap.alarm}
            startDate={store.startDate}
            onChange={setReminders}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
