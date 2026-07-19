import { ExecutiveShell } from "@/components/layout/ExecutiveShell";
import { RequireRole } from "@/components/layout/RequireRole";

export default function ExecutiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole role="executive">
      <ExecutiveShell>{children}</ExecutiveShell>
    </RequireRole>
  );
}
