import { cn } from "@/lib/utils";

/**
 * Temporary placeholder brand mark. Replace with the approved Eye Clinic
 * London SVG/PNG assets in /public/branding when available — swap the
 * <ECLMonogram> svg below and the wordmark typography, keeping the same
 * component API (variant + theme props) so callers do not need to change.
 */

function ECLMonogram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />
      <circle cx="20" cy="20" r="13.5" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="20" cy="20" r="5.5" fill="currentColor" />
      <path d="M2 20c4.5-7 12-11 18-11s13.5 4 18 11c-4.5 7-12 11-18 11S6.5 27 2 20Z" fill="none" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1" />
    </svg>
  );
}

interface LogoProps {
  variant?: "full" | "compact" | "icon";
  theme?: "light" | "dark";
  className?: string;
}

export function ECLLogoPlaceholder({ variant = "full", theme = "light", className }: LogoProps) {
  const textColor = theme === "dark" ? "text-white" : "text-[var(--text)]";
  const accentColor = "text-[var(--accent)]";

  if (variant === "icon") {
    return (
      <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-full", accentColor, className)}>
        <ECLMonogram className="h-9 w-9" />
      </span>
    );
  }

  if (variant === "compact") {
    return (
      <span className={cn("inline-flex items-center gap-2", className)}>
        <ECLMonogram className={cn("h-7 w-7", accentColor)} />
        <span className={cn("font-serif-display text-sm font-semibold tracking-wide", textColor)}>ECL</span>
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <ECLMonogram className={cn("h-8 w-8 shrink-0", accentColor)} />
      <span className="flex flex-col leading-tight">
        <span className={cn("font-serif-display text-lg font-semibold tracking-wide", textColor)}>
          Eye Clinic London
        </span>
        <span className={cn("text-[11px] font-medium uppercase tracking-[0.16em]", accentColor)}>
          ECL Connect
        </span>
      </span>
    </span>
  );
}
