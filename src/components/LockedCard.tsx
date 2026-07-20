import { Unlock } from "@/data/protocol";

type Props = {
  unlock: Unlock;
  ctx: { day: number; streak: number; xp: number };
};

/** Visual "locked" placeholder for features not yet earned. */
export function LockedCard({ unlock, ctx }: Props) {
  const reqs: string[] = [];
  if (unlock.requireDay && ctx.day < unlock.requireDay)
    reqs.push(`Reach Day ${unlock.requireDay} (you're on ${Math.max(ctx.day, 0)})`);
  if (unlock.requireStreak && ctx.streak < unlock.requireStreak)
    reqs.push(`Hit a ${unlock.requireStreak}-day streak (you're at ${ctx.streak})`);
  if (unlock.requireXP && ctx.xp < unlock.requireXP)
    reqs.push(`Earn ${unlock.requireXP} XP total (you have ${ctx.xp})`);

  return (
    <div className="relative rounded-3xl glass p-5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-muted/40 to-transparent pointer-events-none" />
      <div className="relative flex items-start gap-4">
        <div className="text-4xl grayscale opacity-60">{unlock.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground mb-1">🔒 LOCKED</div>
          <div className="font-display text-xl leading-tight mb-1">{unlock.name}</div>
          <p className="text-xs text-muted-foreground mb-3 leading-snug">{unlock.blurb}</p>
          <ul className="space-y-1">
            {reqs.map((r) => (
              <li key={r} className="text-[11px] font-mono text-foreground/80 flex gap-2">
                <span className="text-primary">▸</span><span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}