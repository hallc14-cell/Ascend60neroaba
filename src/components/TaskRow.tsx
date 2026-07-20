import { Task } from "@/data/protocol";

const CAT_COLOR: Record<Task["cat"], string> = {
  looks: "bg-aura/20 text-aura",
  body: "bg-primary/20 text-primary",
  mind: "bg-accent/20 text-accent",
  fuel: "bg-gold/20 text-gold",
  ritual: "bg-secondary/20 text-secondary",
  money: "bg-gold/20 text-gold",
  faith: "bg-accent/20 text-accent",
  // recovery-oriented categories (Phase 2 addiction programs)
  cbt: "bg-accent/20 text-accent",
  mindfulness: "bg-secondary/20 text-secondary",
  physical: "bg-primary/20 text-primary",
  social: "bg-aura/20 text-aura",
  reflection: "bg-gold/20 text-gold",
};

const CAT_LABEL: Record<Task["cat"], string> = {
  looks: "LOOKS", body: "BODY", mind: "MIND", fuel: "FUEL", ritual: "RITUAL", money: "MONEY", faith: "FAITH",
  cbt: "CBT", mindfulness: "MINDFUL", physical: "PHYSICAL", social: "SOCIAL", reflection: "REFLECT",
};

function fmtHour(h: number) {
  const period = h >= 12 ? "PM" : "AM";
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display} ${period}`;
}

export function TaskRow({ task, done, onToggle }: { task: Task; done: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`w-full text-left flex items-start gap-3 p-4 rounded-2xl glass transition-all active:scale-[0.99] ${
        done ? "opacity-60" : "hover:bg-surface/80"
      }`}
    >
      <div
        className={`flex-shrink-0 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
          done
            ? "bg-gradient-primary shadow-glow animate-pop"
            : "border-2 border-border bg-transparent"
        }`}
      >
        {done && <span className="text-primary-foreground text-sm font-black">✓</span>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg leading-none">{task.emoji}</span>
          <span className={`text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded ${CAT_COLOR[task.cat]}`}>
            {CAT_LABEL[task.cat]}
          </span>
          {task.hour !== undefined && (
            <span className="text-[9px] font-mono text-muted-foreground">
              {fmtHour(task.hour)}
            </span>
          )}
          <span className={`ml-auto text-[10px] font-mono font-bold ${done ? "text-primary" : "text-muted-foreground"}`}>
            +{task.xp}XP
          </span>
        </div>
        <div className={`text-sm font-semibold leading-snug ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>
          {task.title}
        </div>
        <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{task.note}</div>
      </div>
    </button>
  );
}