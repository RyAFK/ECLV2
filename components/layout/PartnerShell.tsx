import { PlusCircle } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { PortalHeader } from "@/components/layout/PortalHeader";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { LinkButton } from "@/components/ui/Button";
import { PARTNER_NAV, PARTNER_MOBILE_NAV, PARTNER_MORE_LINKS } from "@/lib/constants";
import { PARTNER_DEMO_USER } from "@/data/demo-users";

export function PartnerShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar navItems={PARTNER_NAV} subtitle="Professional Referral Hub" footerLabel="Exit demo" />
      <div className="flex min-h-screen flex-1 flex-col">
        <PortalHeader
          userName={PARTNER_DEMO_USER.name}
          userRole={PARTNER_DEMO_USER.role}
          action={
            <LinkButton href="/partner/refer" size="sm" className="hidden sm:inline-flex">
              <PlusCircle className="h-4 w-4" />
              Refer a patient
            </LinkButton>
          }
        />
        <main className="flex-1 px-4 pb-24 pt-6 lg:px-8 lg:pb-8">{children}</main>
        <Footer className="mb-16 lg:mb-0" />
      </div>
      <MobileNav primaryItems={PARTNER_MOBILE_NAV} moreItems={PARTNER_MORE_LINKS} rootHref="/partner" />
    </div>
  );
}
