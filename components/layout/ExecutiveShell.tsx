"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { ECLLogoPlaceholder } from "@/components/branding/ECLLogoPlaceholder";
import { Footer } from "@/components/layout/Footer";
import { EXECUTIVE_DEMO_USER } from "@/data/demo-users";
import { initials } from "@/lib/formatters";
import { useAuth } from "@/lib/supabase/auth-context";

export function ExecutiveShell({ children }: { children: React.ReactNode }) {
  const { profile, signOut } = useAuth();
  const userName = profile?.display_name || EXECUTIVE_DEMO_USER.name;
  const userRole = profile ? "Executive" : EXECUTIVE_DEMO_USER.role;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border)] bg-[var(--sidebar)] px-4 py-3.5 text-white lg:px-8">
        <ECLLogoPlaceholder variant="full" theme="dark" />
        <div className="flex items-center gap-4">
          <span className="hidden text-right sm:block">
            <span className="block text-xs font-medium leading-tight">{userName}</span>
            <span className="block text-[11px] leading-tight text-white/50">{userRole}</span>
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-semibold text-white">
            {initials(userName)}
          </span>
          <Link
            href="/login"
            onClick={() => void signOut()}
            className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            Exit demo
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 lg:px-8">{children}</main>
      <Footer />
    </div>
  );
}
