"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { NavIcon } from "@/components/navigation/NavIcon";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  emphasize?: boolean;
}

export function MobileNav({
  primaryItems,
  moreItems,
  rootHref,
}: {
  primaryItems: NavItem[];
  moreItems: NavItem[];
  rootHref: string;
}) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-stretch border-t border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur lg:hidden">
        {primaryItems.map((item) => {
          if (item.href === "#more") {
            return (
              <button
                key="more"
                onClick={() => setMoreOpen(true)}
                className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[var(--text-secondary)]"
              >
                <NavIcon name={item.icon} className="h-5 w-5" />
                <span className="text-[11px] font-medium">{item.label}</span>
              </button>
            );
          }
          const active = item.href === rootHref ? pathname === item.href : pathname.startsWith(item.href);
          if (item.emphasize) {
            return (
              <Link key={item.href} href={item.href} className="flex flex-1 flex-col items-center justify-center py-1.5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-lg">
                  <NavIcon name={item.icon} className="h-5.5 w-5.5" />
                </span>
              </Link>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5",
                active ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"
              )}
            >
              <NavIcon name={item.icon} className="h-5 w-5" />
              <span className="text-[11px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {moreOpen && (
        <div className="fixed inset-0 z-40 flex items-end lg:hidden">
          <button aria-label="Close menu" className="absolute inset-0 bg-black/40" onClick={() => setMoreOpen(false)} />
          <div className="animate-ecl-fade-in relative z-10 w-full rounded-t-2xl border-t border-[var(--border)] bg-[var(--surface)] p-4 pb-8 shadow-2xl">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--text)]">More</p>
              <button onClick={() => setMoreOpen(false)} aria-label="Close" className="rounded-full p-1.5 hover:bg-[var(--surface-soft)]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {moreItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  className="flex flex-col items-center gap-2 rounded-xl border border-[var(--border)] p-3 text-center transition hover:bg-[var(--surface-soft)]"
                >
                  <NavIcon name={item.icon} className="h-5 w-5 text-[var(--accent)]" />
                  <span className="text-xs font-medium text-[var(--text)]">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
