import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../context/AuthContext";
import { AuthShell } from "../components/AuthShell";

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await requestPasswordReset(email.trim());
    setLoading(false);
    if (error) {
      toast.error(error);
      return;
    }
    setSent(true);
    toast.success("If that email exists, a reset link is on its way.");
  }

  return (
    <AuthShell
      title="Reset password"
      subtitle="We'll email you a secure link."
      footer={
        <Link to="/login" className="text-primary font-medium">
          Back to log in
        </Link>
      }
    >
      {sent ? (
        <p className="text-sm text-muted-foreground">
          Check your inbox for a password reset link. It may take a minute to
          arrive — remember to check spam.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
