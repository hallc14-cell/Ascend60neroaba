import { useEffect, useState } from "react";
import { QUOTES } from "@/data/protocol";

export function QuoteCard() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % QUOTES.length);
        setFade(true);
      }, 300);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative grain rounded-3xl p-6 glass-strong overflow-hidden">
      <div className="absolute inset-0 bg-gradient-aura opacity-50 pointer-events-none" />
      <div className="relative">
        <div className="font-mono text-[10px] tracking-[0.3em] text-primary mb-3">DAILY MANTRA</div>
        <div
          className={`font-display text-2xl leading-tight transition-opacity duration-300 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          "{QUOTES[idx]}"
        </div>
      </div>
    </div>
  );
}