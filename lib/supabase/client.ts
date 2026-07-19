import { createBrowserClient } from "@supabase/ssr";
import type { EclV2Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True when NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are configured. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let browserClient: ReturnType<typeof createBrowserClient<EclV2Database, "eclv2">> | null = null;

/**
 * Browser Supabase client scoped to the `eclv2` schema. Returns null when the
 * environment variables are not configured, so callers can fall back to mock
 * data during local development without a Supabase project.
 */
export function getSupabaseClient() {
  if (!isSupabaseConfigured) return null;
  if (!browserClient) {
    browserClient = createBrowserClient<EclV2Database, "eclv2">(supabaseUrl!, supabaseAnonKey!, {
      db: { schema: "eclv2" },
    });
  }
  return browserClient;
}
