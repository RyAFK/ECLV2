"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseClient, isSupabaseConfigured } from "./client";
import type { ProfileRow } from "./database.types";

interface AuthState {
  isConfigured: boolean;
  loading: boolean;
  user: User | null;
  profile: ProfileRow | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  /** Sends a one-time numeric code to `email` (referring-partner passwordless sign-in). */
  sendPartnerOtp: (email: string) => Promise<{ error: string | null }>;
  /** Verifies the numeric code sent by sendPartnerOtp and establishes a session. */
  verifyPartnerOtp: (email: string, token: string) => Promise<{ error: string | null }>;
  /** Re-fetches the current user's profile row (e.g. right after onboarding completes). */
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const userRef = useRef<User | null>(null);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync of configuration state on mount, not derivable from render
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadProfile(currentUser: User | null) {
      if (!currentUser) {
        if (!cancelled) setProfile(null);
        return;
      }
      const { data } = await supabase!.from("profiles").select("*").eq("user_id", currentUser.id).maybeSingle();
      if (!cancelled) setProfile((data as ProfileRow) ?? null);
    }

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setUser(data.session?.user ?? null);
      loadProfile(data.session?.user ?? null).finally(() => {
        if (!cancelled) setLoading(false);
      });
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      loadProfile(session?.user ?? null);
    });

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      isConfigured: isSupabaseConfigured,
      loading,
      user,
      profile,
      async signIn(email, password) {
        const supabase = getSupabaseClient();
        if (!supabase) return { error: "Supabase is not configured." };
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message ?? null };
      },
      async signUp(email, password, fullName) {
        const supabase = getSupabaseClient();
        if (!supabase) return { error: "Supabase is not configured." };
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { role: "partner", full_name: fullName } },
        });
        return { error: error?.message ?? null };
      },
      async sendPartnerOtp(email) {
        const supabase = getSupabaseClient();
        if (!supabase) return { error: "Supabase is not configured." };
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { shouldCreateUser: true },
        });
        return { error: error?.message ?? null };
      },
      async verifyPartnerOtp(email, token) {
        const supabase = getSupabaseClient();
        if (!supabase) return { error: "Supabase is not configured." };
        const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
        return { error: error?.message ?? null };
      },
      async refreshProfile() {
        const supabase = getSupabaseClient();
        const currentUser = userRef.current;
        if (!supabase || !currentUser) return;
        const { data } = await supabase.from("profiles").select("*").eq("user_id", currentUser.id).maybeSingle();
        setProfile((data as ProfileRow) ?? null);
      },
      async signOut() {
        const supabase = getSupabaseClient();
        if (!supabase) return;
        await supabase.auth.signOut();
      },
    }),
    [loading, user, profile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
