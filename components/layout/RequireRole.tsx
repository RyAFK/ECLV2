"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/supabase/auth-context";
import type { PortalRole } from "@/lib/supabase/database.types";

/**
 * Gates a portal section to a single role once Supabase auth is configured.
 * When Supabase isn't configured (local dev without env vars), this is a
 * no-op passthrough so the existing no-login demo experience keeps working.
 */
export function RequireRole({ role, children }: { role: PortalRole; children: React.ReactNode }) {
  const { isConfigured, loading, user, profile } = useAuth();
  const router = useRouter();

  const mismatched = isConfigured && !loading && (!user || !profile || profile.role !== role);

  useEffect(() => {
    if (mismatched) router.replace("/login");
  }, [mismatched, router]);

  if (!isConfigured) return <>{children}</>;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  if (mismatched) return null;

  return <>{children}</>;
}
