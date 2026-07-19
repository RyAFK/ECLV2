import { PartnerShell } from "@/components/layout/PartnerShell";
import { RequireRole } from "@/components/layout/RequireRole";

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole role="partner">
      <PartnerShell>{children}</PartnerShell>
    </RequireRole>
  );
}
