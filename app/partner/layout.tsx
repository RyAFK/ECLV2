import { PartnerShell } from "@/components/layout/PartnerShell";
import { PartnerGuard } from "@/components/layout/PartnerGuard";

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <PartnerGuard>
      <PartnerShell>{children}</PartnerShell>
    </PartnerGuard>
  );
}
