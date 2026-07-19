import { ClinicShell } from "@/components/layout/ClinicShell";
import { RequireRole } from "@/components/layout/RequireRole";

export default function ClinicLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole role="clinic">
      <ClinicShell>{children}</ClinicShell>
    </RequireRole>
  );
}
