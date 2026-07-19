"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/supabase/auth-context";

/**
 * Gates every /partner route:
 *  1. Unauthenticated -> /login/partner
 *  2. Authenticated but portal_role !== "partner" -> signed out, sent to /login/partner
 *  3. Authenticated partner, onboarding not complete -> /partner-setup
 *  4. Otherwise renders children, with the authenticated profile already
 *     available app-wide via useAuth() (the "reusable React context").
 *
 * When Supabase isn't configured (local dev without env vars), this is a
 * no-op passthrough so the existing no-login demo experience keeps working.
 */
export function PartnerGuard({ children }: { children: React.ReactNode }) {
  const { isConfigured, loading, user, profile, signOut } = useAuth();
  const router = useRouter();

  const wrongRole = isConfigured && !loading && !!user && !!profile && profile.portal_role !== "partner";
  const unauthenticated = isConfigured && !loading && !user;
  const needsOnboarding = isConfigured && !loading && !!user && !!profile && profile.portal_role === "partner" && !profile.onboarding_complete;

  useEffect(() => {
    if (wrongRole) {
      void signOut();
      router.replace("/login/partner");
      return;
    }
    if (unauthenticated) {
      router.replace("/login/partner");
      return;
    }
    if (needsOnboarding) {
      router.replace("/partner-setup");
    }
  }, [wrongRole, unauthenticated, needsOnboarding, router, signOut]);

  if (!isConfigured) return <>{children}</>;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  if (wrongRole || unauthenticated || needsOnboarding) return null;

  return <>{children}</>;
}
