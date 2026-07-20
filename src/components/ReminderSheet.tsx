import { useState } from "react";
import { requestNotifPermission, startHourlyReminders, stopHourlyReminders, fireTestAlarm } from "@/lib/notifications";
import { toast } from "@/hooks/use-toast";
import { subscribePush, unsubscribePush, updatePushWindow, pushSupported } from "@/lib/push";

type Props = {
  enabled: boolean;
  fromHour: number;
  toHour: number;
  alarmMode: boolean;
  alarmUnlocked: boolean;
  startDate?: string;
  onChange: (enabled: boolean, from: number, to: number, alarmMode: boolean) => void;
};

export function ReminderSheet({ enabled, fromHour, toHour, alarmMode, alarmUnlocked, startDate, onChange }: Props) {
  const [from, setFrom] = useState(fromHour);
  const [to, setTo] = useState(toHour);
  const [alarm, setAlarm] = useState(alarmMode);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (enabled) {
      stopHourlyReminders();
      unsubscribePush().catch(() => {});
      onChange(false, from, to, alarm);
      toast({ title: "Reminders off" });
      return;
    }
    setBusy(true);
    const res = await requestNotifPermission();
    if (res.ok !== true) {
      setBusy(false);
      const reason = res.reason;
      const msg =
        reason === "ios-needs-install"
          ? "iPhone/iPad: tap Share → Add to Home Screen, open the installed app, then enable reminders."
          : reason === "denied"
          ? "Notifications are blocked. Tap the lock icon in the address bar → Site settings → allow Notifications, then try again."
          : reason === "dismissed"
          ? "You dismissed the prompt. Tap the button again and choose Allow."
          : "This browser doesn't support notifications. Try Chrome, Safari, or Edge.";
      toast({ title: "Can't enable reminders", description: msg, variant: "destructive" });
      return;
    }
    startHourlyReminders(from, to, alarm);

    // Try to subscribe for background push (only works on installed PWA / real domain).
    let bg = false;
    if (pushSupported()) {
      bg = await subscribePush({ fromHour: from, toHour: to, alarmMode: alarm, startDate, taskReminders: true });
    }
    setBusy(false);

    onChange(true, from, to, alarm);
    toast({
      title: alarm ? "Alarm mode on 🚨" : "Hourly reminders on 🔔",
      description: bg
        ? `Background alerts active ${fmtHour(from)} – ${fmtHour(to)}. You'll be notified every hour even when the app is closed.`
        : `Tap Allow when prompted, then reopen this screen and tap the button again to activate background alerts.`,
    });
  }

  function setAlarmMode(next: boolean) {
    setAlarm(next);
    if (enabled) {
      startHourlyReminders(from, to, next);
      updatePushWindow({ fromHour: from, toHour: to, alarmMode: next, startDate, taskReminders: true }).catch(() => {});
      onChange(true, from, to, next);
      toast({ title: next ? "Alarm mode ENABLED 🚨" : "Switched to soft reminders" });
    }
  }

  return (
    <div className="glass-strong rounded-3xl p-5 space-y-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-aura opacity-30 pointer-events-none" />
      <div className="relative">
        <div className="font-mono text-[10px] tracking-[0.3em] text-primary mb-2">REMINDERS · ALARMS</div>
        <p className="text-sm text-muted-foreground mb-4">
          Get pinged every hour to stay locked in. Switch on <b>Alarm Mode</b> for a loud beep,
          vibration, and a full-screen check-in dialog you have to dismiss.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <Time label="FROM" v={from} onChange={setFrom} />
          <Time label="TO" v={to} onChange={setTo} />
        </div>

        <div className={`mb-3 p-3 rounded-2xl ${alarmUnlocked ? "bg-surface/60" : "bg-muted/40 opacity-60"}`}>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              disabled={!alarmUnlocked}
              checked={alarm}
              onChange={(e) => setAlarmMode(e.target.checked)}
              className="mt-1 w-4 h-4 accent-primary"
            />
            <div className="flex-1 text-left">
              <div className="text-sm font-bold flex items-center gap-2">
                🚨 Alarm Mode
                {!alarmUnlocked && <span className="text-[9px] font-mono text-muted-foreground">🔒 unlock at 3-day streak</span>}
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                Loud beep + vibrate + full-screen quote. Treats reminders like real alarms.
              </p>
            </div>
          </label>
        </div>

        <button
          disabled={busy}
          onClick={toggle}
          className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] ${
            enabled
              ? "bg-foreground/10 text-foreground"
              : "bg-gradient-primary text-primary-foreground shadow-glow animate-glow"
          }`}
        >
          {enabled ? "PAUSE REMINDERS" : busy ? "REQUESTING…" : alarm ? "TURN ON HOURLY ALARMS" : "TURN ON HOURLY REMINDERS"}
        </button>

        <button
          onClick={() => fireTestAlarm(alarm)}
          className="mt-2 w-full py-2.5 rounded-2xl bg-surface/60 text-foreground font-mono text-xs tracking-wider hover:bg-surface transition-colors"
        >
          🔊 TEST {alarm ? "ALARM" : "REMINDER"}
        </button>

        <details className="mt-3">
          <summary className="text-xs text-muted-foreground cursor-pointer">📲 Install on phone</summary>
          <div className="text-xs text-muted-foreground mt-2 space-y-1 leading-relaxed">
            <p><b>iPhone (Safari):</b> Tap Share → "Add to Home Screen".</p>
            <p><b>Android (Chrome):</b> Menu → "Install app" / "Add to Home screen".</p>
            <p>Once installed, reminders work even when the app is closed. For full-screen alarms keep the app open in a tab.</p>
          </div>
        </details>
      </div>
    </div>
  );
}

function Time({ label, v, onChange }: { label: string; v: number; onChange: (n: number) => void }) {
  return (
    <label className="block">
      <span className="font-mono text-[9px] tracking-wider text-muted-foreground">{label}</span>
      <select
        value={v}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="mt-1 w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {Array.from({ length: 24 }, (_, i) => (
          <option key={i} value={i}>{fmtHour(i)}</option>
        ))}
      </select>
    </label>
  );
}

function fmtHour(h: number) {
  const period = h >= 12 ? "PM" : "AM";
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display} ${period}`;
}