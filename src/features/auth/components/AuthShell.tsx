import type { ReactNode } from "react";

/** Shared visual shell for the auth screens — matches the app's glass aesthetic. */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-dvh max-w-[480px] mx-auto flex flex-col justify-center px-5 py-10">
      <div className="mb-6 text-center">
        <div className="font-display text-3xl">
          <span className="text-gradient">Ascend</span>60
        </div>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>

      <div className="rounded-3xl glass-strong p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-aura opacity-20 pointer-events-none" />
        <div className="relative">
          <h1 className="font-display text-xl mb-5">{title}</h1>
          {children}
        </div>
      </div>

      {footer && (
        <div className="mt-5 text-center text-sm text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  );
}

export default AuthShell;
