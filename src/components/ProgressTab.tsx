import { useState } from "react";
import { Card } from "@/components/ui/card";
import { CalorieLogger } from "@/components/CalorieLogger";
import { MealEntry } from "@/lib/storage";

type Props = {
  weights: Record<string, number>;
  notes: Record<string, string>;
  onLog: (date: string, weight?: number, note?: string) => void;
  startDate?: string;
  day: number;
  phaseId: number;
  meals: MealEntry[];
  onAddMeal: (date: string, entry: MealEntry) => void;
  onRemoveMeal: (date: string, id: string) => void;
};

function todayKey() { return new Date().toISOString().slice(0, 10); }

export function ProgressTab({ weights, notes, onLog, startDate, day, phaseId, meals, onAddMeal, onRemoveMeal }: Props) {
  const [w, setW] = useState("");
  const [n, setN] = useState("");
  const tk = todayKey();

  const entries = Object.keys(weights).sort();
  const first = entries[0] ? weights[entries[0]] : null;
  const latest = entries[entries.length - 1] ? weights[entries[entries.length - 1]] : null;
  const delta = first !== null && latest !== null ? latest - first : 0;

  const max = Math.max(...Object.values(weights), 1);
  const min = Math.min(...Object.values(weights), max);

  return (
    <div className="space-y-4">
      {/* Hero progress */}
      <Card className="glass-strong border-0 p-5 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-aura opacity-40 pointer-events-none" />
        <div className="relative">
          <div className="font-mono text-[10px] tracking-[0.3em] text-primary mb-2">TRANSFORMATION</div>
          <div className="flex items-baseline gap-3">
            <span className="font-display text-6xl text-gradient leading-none">{day}</span>
            <span className="font-mono text-sm text-muted-foreground">/ 60 DAYS</span>
          </div>
          {startDate && (
            <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-gradient-primary" style={{ width: `${(day / 60) * 100}%` }} />
            </div>
          )}
          <div className="mt-3 flex justify-between text-[10px] font-mono text-muted-foreground tracking-wider">
            <span>P1 PRIMER</span><span>P2 PEAK</span><span>P3 RECOVERY</span>
          </div>
        </div>
      </Card>

      {/* Calorie + meal log */}
      <CalorieLogger
        dateKey={tk}
        phaseId={phaseId}
        meals={meals}
        onAdd={(entry) => onAddMeal(tk, entry)}
        onRemove={(id) => onRemoveMeal(tk, id)}
      />

      {/* Weight log */}
      <Card className="glass border-0 p-5 rounded-3xl">
        <div className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground mb-3">WEIGHT LOG</div>
        {first !== null && latest !== null ? (
          <div className="flex items-baseline gap-4 mb-4">
            <div>
              <div className="font-display text-4xl">{latest}<span className="text-base text-muted-foreground"> lb</span></div>
              <div className="text-xs text-muted-foreground">today</div>
            </div>
            <div className={`text-sm font-bold ${delta < 0 ? "text-primary" : "text-muted-foreground"}`}>
              {delta > 0 ? "+" : ""}{delta.toFixed(1)} lb
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground mb-4">Log your weight to track the change.</div>
        )}

        {/* mini chart */}
        {entries.length > 1 && (
          <div className="flex items-end gap-1 h-20 mb-4">
            {entries.slice(-30).map((d, i) => {
              const v = weights[d];
              const pct = max === min ? 50 : ((v - min) / (max - min)) * 100;
              return (
                <div key={d} className="flex-1 bg-gradient-primary rounded-t opacity-80" style={{ height: `${20 + pct * 0.8}%` }} title={`${d}: ${v}`} />
              );
            })}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="number"
            inputMode="decimal"
            placeholder={weights[tk] ? `Today: ${weights[tk]}` : "Today's weight"}
            value={w}
            onChange={(e) => setW(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={() => { if (w) { onLog(tk, parseFloat(w)); setW(""); } }}
            className="px-5 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-sm shadow-glow active:scale-95"
          >
            LOG
          </button>
        </div>
      </Card>

      {/* Note */}
      <Card className="glass border-0 p-5 rounded-3xl">
        <div className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground mb-3">JOURNAL — TODAY</div>
        <textarea
          rows={3}
          placeholder={notes[tk] || "3 wins · 1 fix · how do you feel?"}
          value={n}
          onChange={(e) => setN(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
        <button
          onClick={() => { if (n) { onLog(tk, undefined, n); setN(""); } }}
          className="mt-2 w-full py-2.5 rounded-xl bg-foreground/10 hover:bg-foreground/15 text-foreground font-semibold text-sm transition-colors"
        >
          SAVE ENTRY
        </button>
      </Card>
    </div>
  );
}