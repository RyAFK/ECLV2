"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Check, X } from "lucide-react";
import { NOTIFICATIONS } from "@/data/notifications";
import { useLocalStorageState } from "@/lib/demo-storage";
import { cn } from "@/lib/utils";

export function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [readIds, setReadIds] = useLocalStorageState<string[]>("notifications-read", []);
  const [dismissedIds, setDismissedIds] = useLocalStorageState<string[]>("notifications-dismissed", []);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const items = NOTIFICATIONS.filter((n) => !dismissedIds.includes(n.id)).map((n) => ({
    ...n,
    read: n.read || readIds.includes(n.id),
  }));
  const visible = unreadOnly ? items.filter((n) => !n.read) : items;
  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-secondary)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--accent)]" />
        )}
      </button>
      {open && (
        <div className="animate-ecl-fade-in absolute right-0 z-40 mt-2 w-[340px] rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xl">
          <div className="flex items-center justify-between border-b border-[var(--border)] p-4">
            <p className="text-sm font-semibold text-[var(--text)]">Notifications</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setUnreadOnly((u) => !u)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium transition",
                  unreadOnly ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "text-[var(--text-secondary)] hover:bg-[var(--surface-soft)]"
                )}
              >
                Unread
              </button>
              <button
                onClick={() => setReadIds(items.map((i) => i.id))}
                className="rounded-full px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-soft)]"
              >
                Mark all read
              </button>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {visible.length === 0 && (
              <p className="p-6 text-center text-sm text-[var(--text-secondary)]">No notifications to show.</p>
            )}
            {visible.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "flex items-start gap-2.5 border-b border-[var(--border)] p-4 last:border-0",
                  !n.read && "bg-[var(--accent-soft)]/20"
                )}
              >
                <span
                  className={cn(
                    "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                    !n.read ? "bg-[var(--accent)]" : "bg-transparent"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[var(--text)]">{n.message}</p>
                  <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{n.time}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  {!n.read && (
                    <button
                      aria-label="Mark as read"
                      onClick={() => setReadIds([...readIds, n.id])}
                      className="rounded-full p-1 text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    aria-label="Dismiss"
                    onClick={() => setDismissedIds([...dismissedIds, n.id])}
                    className="rounded-full p-1 text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
