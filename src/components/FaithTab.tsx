import { Card } from "@/components/ui/card";
import { VERSES_BY_THEME, PRAYERS } from "@/data/protocol";

const GOSPEL_PLAN = [
  { range: "Day 1-15",  book: "Mark",    blurb: "The action gospel. Short, punchy, perfect for the Foundation phase." },
  { range: "Day 16-30", book: "Matthew", blurb: "The Sermon on the Mount lives here — your character blueprint." },
  { range: "Day 31-45", book: "Luke",    blurb: "The most stories. Parables that hit different in a deficit." },
  { range: "Day 46-60", book: "John",    blurb: "'I am' statements. End the 60 days knowing exactly who Christ is." },
];

const HALLOW_SESSIONS = [
  { time: "Morning",   name: "Daily Prayer / Morning Offering", note: "5-10 min. Set the tone before the world does." },
  { time: "Mid-day",   name: "Rosary or Lectio (1 decade)",     note: "Reset between work + lift. Even 5 min counts." },
  { time: "Pre-lift",  name: "Bible in a Year — short clip",    note: "Fr. Mike on the way to the gym. Built different." },
  { time: "Night",     name: "Examen + Night Prayer",           note: "Review the day with God. Sleep without weight." },
];

/**
 * Faith Vault — gospels + Hallow integration + verses for the moment.
 * "You can always look to God for help in the 2 months."
 */
export function FaithTab() {
  return (
    <div className="space-y-4">
      <Card className="glass-strong border-0 p-5 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-aura opacity-30 pointer-events-none" />
        <div className="relative">
          <div className="font-mono text-[10px] tracking-[0.3em] text-accent mb-2">FAITH · FOUNDATION</div>
          <div className="font-display text-2xl leading-tight mb-2">You are not doing this alone.</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The body is the temple. The 60 days are not for vanity — they are an act of stewardship.
            On the days you can't pull from yourself, pull from God. He's a verse away.
          </p>
        </div>
      </Card>

      {/* HALLOW INTEGRATION */}
      <Card className="glass-strong border-0 p-5 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="font-mono text-[10px] tracking-[0.3em] text-primary">HALLOW · DAILY RHYTHM</div>
            <a
              href="https://hallow.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-full bg-gradient-primary text-primary-foreground font-mono text-[9px] tracking-wider shadow-glow"
            >
              OPEN HALLOW ↗
            </a>
          </div>
          <div className="font-display text-xl leading-tight mb-3">Your Hallow plan, mapped to the day.</div>
          <div className="space-y-2">
            {HALLOW_SESSIONS.map((s) => (
              <div key={s.time} className="p-3 rounded-2xl bg-surface/70 flex items-start gap-3">
                <div className="font-mono text-[10px] tracking-wider text-primary mt-0.5 w-16 flex-shrink-0">{s.time.toUpperCase()}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm">{s.name}</div>
                  <div className="text-[11px] text-muted-foreground leading-snug">{s.note}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground italic mt-3">
            You already have Hallow. Use it. Link the streak to your physical streak.
          </p>
        </div>
      </Card>

      {/* GOSPEL READING PLAN */}
      <Card className="glass border-0 p-5 rounded-3xl">
        <div className="font-mono text-[10px] tracking-[0.3em] text-aura mb-2">60-DAY GOSPEL PLAN</div>
        <div className="font-display text-xl leading-tight mb-3">All four gospels in 60 days.</div>
        <div className="space-y-2 mb-3">
          {GOSPEL_PLAN.map((g) => (
            <div key={g.book} className="p-3 rounded-2xl bg-surface/70">
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-display text-lg">{g.book}</span>
                <span className="font-mono text-[10px] tracking-wider text-primary">{g.range}</span>
              </div>
              <div className="text-[11px] text-muted-foreground leading-snug">{g.blurb}</div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground italic">
          Read the stories of Christ. Not abstract wisdom — the man Himself, what He did, what He said.
        </p>
      </Card>

      <Card className="glass border-0 p-5 rounded-3xl">
        <div className="font-mono text-[10px] tracking-[0.3em] text-primary mb-3">VERSES — FOR THE MOMENT</div>
        <div className="space-y-4">
          {VERSES_BY_THEME.map((g) => (
            <div key={g.theme} className="pb-4 border-b border-border last:border-0 last:pb-0">
              <div className="font-mono text-[10px] tracking-wider text-accent mb-2">{g.theme.toUpperCase()}</div>
              <div className="space-y-2">
                {g.verses.map((v) => (
                  <div key={v.ref} className="p-3 rounded-2xl bg-surface/60">
                    <p className="font-display text-base leading-snug mb-1">"{v.text}"</p>
                    <div className="font-mono text-[10px] tracking-wider text-primary">— {v.ref}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="glass-strong border-0 p-5 rounded-3xl">
        <div className="font-mono text-[10px] tracking-[0.3em] text-primary mb-3">PRAYERS — START HERE</div>
        <div className="space-y-3">
          {PRAYERS.map((p) => (
            <details key={p.title} className="group rounded-2xl bg-surface/60 p-3">
              <summary className="cursor-pointer flex justify-between items-center list-none">
                <span className="font-bold text-sm">{p.title}</span>
                <span className="text-xs text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="text-sm text-muted-foreground leading-relaxed mt-3 italic">{p.body}</p>
            </details>
          ))}
        </div>
      </Card>
    </div>
  );
}