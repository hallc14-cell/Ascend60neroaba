import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/features/auth";
import { listProtocols } from "@/features/checklist/services/protocolLoader";
import { getProfile, updateProfile } from "../services/profileService";
import type { UserProfile } from "@/types/auth";

/**
 * Profile & settings screen. Lets the user set a display name and choose their
 * active protocol / addiction type (Phase 1 prep for multiple recovery tracks),
 * and sign out. Works in both authenticated and guest modes.
 */
export default function ProfilePage() {
  const { user, authEnabled, signOut } = useAuth();
  const navigate = useNavigate();
  const protocols = listProtocols();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [protocolId, setProtocolId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    getProfile()
      .then((p) => {
        if (!mounted) return;
        setProfile(p);
        setDisplayName(p.display_name ?? "");
        setProtocolId(p.protocol_id);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const selected = protocols.find((p) => p.id === protocolId);
    const { error } = await updateProfile({
      display_name: displayName.trim() || null,
      protocol_id: protocolId,
      addiction_type: selected?.addictionType ?? profile?.addiction_type ?? "looksmax",
    });
    setSaving(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Profile saved.");
  }

  async function onSignOut() {
    await signOut();
    toast.success("Signed out.");
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-dvh max-w-[480px] mx-auto flex flex-col px-5 py-8">
      <header className="flex items-center justify-between mb-6">
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
          ← Back
        </Link>
        <div className="font-display text-lg">
          <span className="text-gradient">Ascend</span>60
        </div>
      </header>

      <div className="rounded-3xl glass-strong p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-aura opacity-20 pointer-events-none" />
        <div className="relative">
          <h1 className="font-display text-xl mb-1">Profile</h1>
          <p className="text-sm text-muted-foreground mb-5">
            {authEnabled && user?.email
              ? user.email
              : "Guest mode — data is stored on this device."}
          </p>

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <form onSubmit={onSave} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="displayName">Display name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="protocol">Program</Label>
                <Select value={protocolId} onValueChange={setProtocolId}>
                  <SelectTrigger id="protocol">
                    <SelectValue placeholder="Choose a program" />
                  </SelectTrigger>
                  <SelectContent>
                    {protocols.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  More recovery tracks are coming. Looksmax is the default program.
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </form>
          )}
        </div>
      </div>

      {authEnabled && user && (
        <Button
          variant="ghost"
          className="mt-5 text-muted-foreground"
          onClick={onSignOut}
        >
          Sign out
        </Button>
      )}
    </div>
  );
}
