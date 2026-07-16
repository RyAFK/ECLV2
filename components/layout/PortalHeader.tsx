import { NotificationsDropdown } from "@/components/navigation/NotificationsDropdown";
import { initials } from "@/lib/formatters";
import { ECLLogoPlaceholder } from "@/components/branding/ECLLogoPlaceholder";

export function PortalHeader({
  userName,
  userRole,
  action,
}: {
  userName: string;
  userRole: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--background)]/95 px-4 py-3 backdrop-blur lg:px-8">
      <div className="flex items-center gap-2 lg:hidden">
        <ECLLogoPlaceholder variant="compact" theme="light" />
      </div>
      <div className="hidden lg:block" />
      <div className="flex items-center gap-3">
        {action}
        <NotificationsDropdown />
        <div className="flex items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--surface)] py-1 pl-1 pr-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-semibold text-white">
            {initials(userName)}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-xs font-medium leading-tight text-[var(--text)]">{userName}</span>
            <span className="block text-[11px] leading-tight text-[var(--text-secondary)]">{userRole}</span>
          </span>
        </div>
      </div>
    </header>
  );
}
