"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SplashFan } from "@/components/branding/SplashFan";

const MIN_DISPLAY_MS = 2500;
const FADE_MS = 550;

/**
 * Full-screen branded loading moment shown once per hard page load (mounted
 * in the root layout, so client-side navigation between routes never
 * re-triggers it - only an initial visit or a refresh does).
 */
export function SplashScreen() {
  const [mounted, setMounted] = useState(false);
  const [fading, setFading] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time mount flag to trigger the entrance transition, not derivable from render
    setMounted(true);
    const fadeTimer = setTimeout(() => setFading(true), MIN_DISPLAY_MS);
    const removeTimer = setTimeout(() => setVisible(false), MIN_DISPLAY_MS + FADE_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-[#0a1512] transition-opacity ease-out",
        fading ? "opacity-0" : "opacity-100"
      )}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <div
        className={cn("relative flex flex-col items-center transition-all duration-700 ease-out", mounted ? "scale-100 opacity-100" : "scale-95 opacity-0")}
      >
        <div className="relative flex h-[clamp(220px,32vw,380px)] w-[clamp(220px,32vw,380px)] items-center justify-center">
          <div
            className="animate-ecl-orb-bloom absolute inset-[-40%] rounded-full blur-3xl"
            style={{
              background: "radial-gradient(circle, rgba(240,198,106,0.45) 0%, rgba(217,165,62,0.22) 40%, rgba(217,165,62,0) 72%)",
            }}
          />
          <SplashFan className="animate-ecl-wheel-to-orb relative h-full w-full drop-shadow-[0_0_28px_rgba(217,165,62,0.45)]" />
        </div>

        <p className="mt-10 font-mono text-xs font-medium uppercase tracking-[0.35em] text-[#c9a35f]">ECL Connect</p>
        <h1 className="mt-4 max-w-2xl px-6 text-center font-serif-display text-3xl font-medium leading-tight text-white sm:text-4xl lg:text-5xl">
          &ldquo;This is what <span className="italic text-[#e0b866]">clear</span>{" "}actually looks like.&rdquo;
        </h1>
      </div>
    </div>
  );
}
