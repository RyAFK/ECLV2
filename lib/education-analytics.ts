import type { EducationAnalyticsEntry, EducationAnalyticsEvent } from "@/lib/types";

const ANALYTICS_KEY = "referToRyanEducationAnalytics";

export function logEducationEvent(event: EducationAnalyticsEvent, moduleId: string, moduleTitle: string, pathway: string): void {
  if (typeof window === "undefined") return;
  try {
    const entry: EducationAnalyticsEntry = { event, moduleId, moduleTitle, pathway, timestamp: new Date().toISOString() };
    const existing = readEducationAnalytics();
    window.localStorage.setItem(ANALYTICS_KEY, JSON.stringify([...existing, entry]));
  } catch {
    // ignore quota / privacy-mode errors in demo environment
  }
}

export function readEducationAnalytics(): EducationAnalyticsEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ANALYTICS_KEY);
    return raw ? (JSON.parse(raw) as EducationAnalyticsEntry[]) : [];
  } catch {
    return [];
  }
}
