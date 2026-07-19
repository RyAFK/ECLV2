"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ECLLogoPlaceholder } from "@/components/branding/ECLLogoPlaceholder";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/supabase/auth-context";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function PartnerSetupPage() {
  const router = useRouter();
  const { isConfigured, loading, user, profile, refreshProfile, signOut } = useAuth();
  const [form, setForm] = useState({ displayName: "", practiceName: "", professionalRole: "", contactNumber: "" });
  const [hydrated, setHydrated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConfigured || loading) return;
    if (!user) {
      router.replace("/login/partner");
      return;
    }
    if (profile && profile.portal_role !== "partner") {
      void signOut();
      router.replace("/login/partner");
      return;
    }
    if (profile?.onboarding_complete) {
      router.replace("/partner");
      return;
    }
    if (profile && !hydrated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time form hydration from the loaded profile, not derivable from render
      setForm({
        displayName: /@/.test(profile.display_name) ? "" : profile.display_name,
        practiceName: profile.practice_name,
        professionalRole: profile.professional_role,
        contactNumber: profile.contact_number,
      });
      setHydrated(true);
    }
  }, [isConfigured, loading, user, profile, hydrated, router, signOut]);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.rpc("complete_partner_onboarding", {
      p_display_name: form.displayName,
      p_practice_name: form.practiceName,
      p_professional_role: form.professionalRole,
      p_contact_number: form.contactNumber,
    });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    await refreshProfile();
    router.push("/partner");
  }

  if (!isConfigured || loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-6 py-14">
      <div className="mb-8">
        <ECLLogoPlaceholder variant="full" theme="light" />
      </div>
      <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8">
        <h1 className="font-serif-display text-2xl font-semibold text-[var(--text)]">Complete your profile</h1>
        <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
          Tell us a little about your practice so we can set up your referring-partner account.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <Field label="Full name" htmlFor="displayName" required>
            <Input id="displayName" required value={form.displayName} onChange={(e) => update("displayName", e.target.value)} />
          </Field>
          <Field label="Email address" htmlFor="email">
            <Input id="email" value={user.email ?? ""} disabled readOnly />
          </Field>
          <Field label="Practice name" htmlFor="practiceName" required>
            <Input id="practiceName" required value={form.practiceName} onChange={(e) => update("practiceName", e.target.value)} />
          </Field>
          <Field label="Professional role" htmlFor="professionalRole" required hint="e.g. Optometrist, Practice Manager, Private GP">
            <Input id="professionalRole" required value={form.professionalRole} onChange={(e) => update("professionalRole", e.target.value)} />
          </Field>
          <Field label="Contact number" htmlFor="contactNumber" required>
            <Input id="contactNumber" required value={form.contactNumber} onChange={(e) => update("contactNumber", e.target.value)} />
          </Field>

          {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

          <Button type="submit" disabled={submitting} className="mt-2">
            {submitting ? "Saving…" : "Continue to dashboard"}
          </Button>
        </form>
      </div>
    </div>
  );
}
