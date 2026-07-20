/**
 * Route guard. Behaviour:
 *  - Auth disabled (no Supabase config): always allow (local guest mode).
 *  - Auth enabled + loading: show a lightweight splash.
 *  - Auth enabled + not signed in: redirect to /login (preserving intended path).
 *  - Auth enabled + signed in: render children.
 */
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { status, authEnabled } = useAuth();
  const location = useLocation();

  if (!authEnabled) return <>{children}</>;

  if (status === "loading") {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="font-mono text-[11px] tracking-[0.3em]">LOADING…</span>
        </div>
      </div>
    );
  }

  if (status !== "authenticated") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
