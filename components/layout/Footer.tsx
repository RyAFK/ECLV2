import { DEMO_DISCLAIMER } from "@/lib/constants";

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={`border-t border-[var(--border)] px-4 py-4 text-center text-xs text-[var(--text-secondary)] lg:px-8 ${className ?? ""}`}>
      {DEMO_DISCLAIMER}
    </footer>
  );
}
