import { useEffect, useState } from "react";
import { onAlarm } from "@/lib/notifications";

/**
 * Full-screen-ish alarm overlay that pops when an alarm fires while the app
 * is open. Persists until user taps DISMISS — that's the "alarm" feel.
 */
export function AlarmDialog() {
  const [quote, setQuote] = useState<string | null>(null);

  useEffect(() => {
    const off = onAlarm((q) => setQuote(q));
    return () => { off(); };
  }, []);

  if (!quote) return null;

  const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-background/85 backdrop-blur-md animate-rise">
      <div className="relative w-full max-w-sm rounded-3xl glass-strong p-6 shadow-glow overflow-hidden">
        <div className="absolute inset-0 bg-gradient-aura opacity-40 pointer-events-none" />
        <div className="absolute -top-1 left-0 right-0 h-1 bg-gradient-primary animate-glow" />
        <div className="relative text-center">
          <div className="text-5xl mb-3 animate-float">🚨</div>
          <div className="font-mono text-[10px] tracking-[0.3em] text-primary mb-1">CHECK-IN · {time}</div>
          <div className="font-display text-2xl leading-tight mb-5">"{quote}"</div>
          <button
            onClick={() => setQuote(null)}
            className="w-full py-3.5 rounded-2xl bg-gradient-primary text-primary-foreground font-bold text-sm shadow-glow active:scale-[0.98] transition-transform"
          >
            I'M LOCKED IN — DISMISS
          </button>
          <div className="text-[11px] text-muted-foreground mt-3 italic">
            "I can do all things through Christ who strengthens me." — Phil 4:13
          </div>
        </div>
      </div>
    </div>
  );
}