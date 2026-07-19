"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { PortalHeader } from "@/components/layout/PortalHeader";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { CLINIC_NAV, CLINIC_MOBILE_NAV, CLINIC_MORE_LINKS } from "@/lib/constants";
import { CLINIC_DEMO_USER } from "@/data/demo-users";
import { useAuth } from "@/lib/supabase/auth-context";

export function ClinicShell({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();
  const userName = profile?.full_name || CLINIC_DEMO_USER.name;
  const userRole = profile ? (profile.role === "executive" ? "Executive" : "Clinic team") : "Business Development Manager";

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar navItems={CLINIC_NAV} subtitle="Professional Referral Management" footerLabel="Exit demo" />
      <div className="flex min-h-screen flex-1 flex-col">
        <PortalHeader userName={userName} userRole={userRole} />
        <main className="flex-1 px-4 pb-24 pt-6 lg:px-8 lg:pb-8">{children}</main>
        <Footer className="mb-16 lg:mb-0" />
      </div>
      <MobileNav primaryItems={CLINIC_MOBILE_NAV} moreItems={CLINIC_MORE_LINKS} rootHref="/clinic" />
    </div>
  );
}
