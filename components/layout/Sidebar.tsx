"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { ECLLogoPlaceholder } from "@/components/branding/ECLLogoPlaceholder";
import { NavIcon } from "@/components/navigation/NavIcon";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/supabase/auth-context";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  emphasize?: boolean;
}

export function Sidebar({
  navItems,
  subtitle,
  footerLabel,
}: {
  navItems: NavItem[];
  subtitle: string;
  footerLabel: string;
}) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-[var(--sidebar)] text-white lg:flex">
      <div className="flex flex-col gap-1 border-b border-white/10 p-5">
        <ECLLogoPlaceholder variant="full" theme="dark" />
        <p className="mt-1 text-xs text-white/50">{subtitle}</p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const active = item.href === "/partner" || item.href === "/clinic" ? pathname === item.href : pathname.startsWith(item.href);
          if (item.emphasize) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="my-2 flex items-center gap-2.5 rounded-xl bg-[var(--accent)] px-3.5 py-2.5 text-sm font-medium text-white shadow-md transition hover:brightness-105"
              >
                <NavIcon name={item.icon} className="h-4.5 w-4.5" />
                {item.label}
              </Link>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition",
                active ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/5 hover:text-white"
              )}
            >
              <NavIcon name={item.icon} className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <Link
          href="/login"
          onClick={() => void signOut()}
          className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4.5 w-4.5" aria-hidden="true" />
          {footerLabel}
        </Link>
      </div>
    </aside>
  );
}
