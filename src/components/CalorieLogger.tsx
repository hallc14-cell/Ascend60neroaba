import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { RECOMMENDED_FOODS, CALORIE_TARGETS, FoodItem } from "@/data/protocol";
import { MealEntry } from "@/lib/storage";

type Props = {
  dateKey: string;
  phaseId: number;
  meals: MealEntry[];
  onAdd: (entry: MealEntry) => void;
  onRemove: (id: string) => void;
};

const GROUPS: { id: FoodItem["group"]; label: string }[] = [
  { id: "protein", label: "Protein" },
  { id: "dairy",   label: "Dairy" },
  { id: "carb",    label: "Carbs" },
  { id: "veg",     label: "Veg" },
  { id: "fat",     label: "Fats" },
  { id: "fruit",   label: "Fruit" },
  { id: "snack",   label: "Snacks" },
  { id: "drink",   label: "Drinks" },
];

export function CalorieLogger({ dateKey, phaseId, meals, onAdd, onRemove }: Props) {
  const target = CALORIE_TARGETS[phaseId] ?? CALORIE_TARGETS[0];
  const [group, setGroup] = useState<FoodItem["group"]>("protein");
  const [query, setQuery] = useState("");
  const [customOpen, setCustomOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customKcal, setCustomKcal] = useState("");
  const [customProtein, setCustomProtein] = useState("");

  const totals = useMemo(() => {
    return meals.reduce(
      (a, m) => ({ kcal: a.kcal + m.kcal * m.servings, protein: a.protein + m.protein * m.servings }),
      { kcal: 0, protein: 0 }
    );
  }, [meals]);

  const kcalPct = Math.min(100, Math.round((totals.kcal / target.kcal) * 100));
  const proteinPct = Math.min(100, Math.round((totals.protein / target.protein) * 100));
  const remaining = target.kcal - totals.kcal;
  const over = totals.kcal > target.kcal;

  const filtered = RECOMMENDED_FOODS
    .filter((f) => f.group === group)
    .filter((f) => !query || f.name.toLowerCase().includes(query.toLowerCase()));

  function add(food: FoodItem, servings = 1) {
    onAdd({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      foodId: food.id,
      name: food.name,
      kcal: food.kcal,
      protein: food.protein,
      servings,
      at: Date.now(),
    });
  }

  function addCustom() {
    const k = parseFloat(customKcal);
    const p = parseFloat(customProtein || "0");
    if (!customName.trim() || isNaN(k)) return;
    onAdd({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: customName.trim(),
      kcal: k,
      protein: isNaN(p) ? 0 : p,
      servings: 1,
      at: Date.now(),
    });
    setCustomName(""); setCustomKcal(""); setCustomProtein(""); setCustomOpen(false);
  }

  return (
    <Card className="glass-strong border-0 p-5 rounded-3xl">
      <div className="flex items-baseline justify-between mb-3">
        <div className="font-mono text-[10px] tracking-[0.3em] text-primary">CALORIE LOG · TODAY</div>
        <div className="font-mono text-[10px] text-muted-foreground">target {target.kcal} kcal</div>
      </div>

      {/* Big numbers */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-2xl p-3 bg-surface/70">
          <div className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground mb-1">CALORIES</div>
          <div className="flex items-baseline gap-2">
            <span className={`font-display text-3xl leading-none ${over ? "text-destructive" : "text-gradient"}`}>
              {Math.round(totals.kcal)}
            </span>
            <span className="text-xs text-muted-foreground">/ {target.kcal}</span>
          </div>
          <div className={`text-[11px] mt-1 ${over ? "text-destructive font-bold" : "text-muted-foreground"}`}>
            {over ? `over by ${Math.round(totals.kcal - target.kcal)}` : `${Math.round(remaining)} left`}
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full ${over ? "bg-destructive" : "bg-gradient-primary"}`}
              style={{ width: `${kcalPct}%` }}
            />
          </div>
        </div>
        <div className="rounded-2xl p-3 bg-surface/70">
          <div className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground mb-1">PROTEIN</div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl leading-none">{Math.round(totals.protein)}</span>
            <span className="text-xs text-muted-foreground">/ {target.protein}g</span>
          </div>
          <div className="text-[11px] mt-1 text-muted-foreground">
            {totals.protein >= target.protein ? "✓ hit · muscle protected" : `${Math.round(target.protein - totals.protein)}g to go`}
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-accent" style={{ width: `${proteinPct}%` }} />
          </div>
        </div>
      </div>

      {/* Group chips */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-3 -mx-1 px-1">
        {GROUPS.map((g) => (
          <button
            key={g.id}
            onClick={() => setGroup(g.id)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wider whitespace-nowrap transition-colors ${
              group === g.id
                ? "bg-gradient-primary text-primary-foreground shadow-glow"
                : "bg-surface/70 text-muted-foreground"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="search recommended foods…"
        className="w-full px-4 py-2.5 mb-3 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {/* Food list */}
      <div className="space-y-1.5 mb-3 max-h-64 overflow-y-auto pr-1">
        {filtered.map((f) => (
          <button
            key={f.id}
            onClick={() => add(f)}
            className="w-full flex items-center gap-3 p-2.5 rounded-2xl bg-surface/60 hover:bg-surface text-left transition-colors active:scale-[0.99]"
          >
            <span className="text-xl">{f.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm leading-tight truncate">{f.name}</div>
              <div className="text-[11px] text-muted-foreground">{f.serving} · {f.kcal} kcal · {f.protein}g P</div>
            </div>
            <span className="font-mono text-base text-primary">+</span>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="text-xs text-muted-foreground italic text-center py-4">
            Nothing in this group matches. Try a different group or add a custom entry.
          </div>
        )}
      </div>

      {/* Custom add */}
      <div className="mb-4">
        {!customOpen ? (
          <button
            onClick={() => setCustomOpen(true)}
            className="w-full py-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-sm font-semibold transition-colors"
          >
            + Add custom food
          </button>
        ) : (
          <div className="space-y-2 p-3 rounded-2xl bg-surface/60">
            <input
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Food name (e.g. Chipotle bowl)"
              className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                value={customKcal}
                onChange={(e) => setCustomKcal(e.target.value)}
                inputMode="decimal"
                placeholder="kcal"
                className="px-3 py-2 rounded-lg bg-surface border border-border text-sm"
              />
              <input
                value={customProtein}
                onChange={(e) => setCustomProtein(e.target.value)}
                inputMode="decimal"
                placeholder="protein (g)"
                className="px-3 py-2 rounded-lg bg-surface border border-border text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={addCustom}
                className="flex-1 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-bold text-sm"
              >
                LOG IT
              </button>
              <button
                onClick={() => setCustomOpen(false)}
                className="px-4 py-2 rounded-lg bg-foreground/10 text-sm"
              >
                Cancel
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground italic">
              Be honest — log it even if it's off-plan. Awareness is the cure.
            </p>
          </div>
        )}
      </div>

      {/* Today's entries */}
      <div>
        <div className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground mb-2">
          LOGGED ({meals.length})
        </div>
        {meals.length === 0 ? (
          <div className="text-xs text-muted-foreground italic text-center py-4">
            Nothing logged yet. Tap a food above to start.
          </div>
        ) : (
          <div className="space-y-1.5">
            {meals
              .slice()
              .sort((a, b) => b.at - a.at)
              .map((m) => (
                <div key={m.id} className="flex items-center gap-2 p-2 rounded-xl bg-surface/60">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">
                      {m.name}
                      {m.servings !== 1 && <span className="text-muted-foreground"> ×{m.servings}</span>}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      {Math.round(m.kcal * m.servings)} kcal · {Math.round(m.protein * m.servings)}g P · {new Date(m.at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove(m.id)}
                    className="px-2 py-1 rounded-lg text-xs text-muted-foreground hover:bg-foreground/10"
                    aria-label="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </Card>
  );
}