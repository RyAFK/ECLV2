"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { ECLLogoPlaceholder } from "@/components/branding/ECLLogoPlaceholder";
import { OpticalMotif } from "@/components/branding/OpticalMotif";
import { LOGIN_DISCLAIMER } from "@/lib/constants";
import { useAuth } from "@/lib/supabase/auth-context";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

type Step = "email" | "code";

export default function PartnerLoginPage() {
  const router = useRouter();
  const { isConfigured, sendPartnerOtp, verifyPartnerOtp, user, profile, loading, signOut } = useAuth();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Once a session + profile exist, route based on role/onboarding state.
  useEffect(() => {
    if (loading || !user || !profile) return;
    if (profile.portal_role !== "partner") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time redirect guard reacting to a session/profile change, not derivable from render
      setError("This account is not a referring partner account. Please use the clinic or executive sign-in instead.");
      void signOut();
      return;
    }
    router.push(profile.onboarding_complete ? "/partner" : "/partner-setup");
  }, [loading, user, profile, router, signOut]);

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error } = await sendPartnerOtp(email);
    setSubmitting(false);
    if (error) {
      setError(error);
      return;
    }
    setStep("code");
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error } = await verifyPartnerOtp(email, code);
    setSubmitting(false);
    if (error) setError(error);
    // On success, the useEffect above handles redirecting once the profile loads.
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-[var(--sidebar)] px-12 py-14 text-white lg:flex lg:flex-col lg:justify-between">
        <OpticalMotif className="pointer-events-none absolute -bottom-32 -left-32 h-[520px] w-[520px] opacity-60" />
        <div className="relative">
          <ECLLogoPlaceholder variant="full" theme="dark" />
        </div>
        <div className="relative max-w-md">
          <h1 className="font-serif-display text-4xl font-semibold leading-tight tracking-tight">
            Referring partner sign-in
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/70">
            No password needed — we&rsquo;ll email you a one-time code to sign in securely.
          </p>
        </div>
        <p className="relative text-xs text-white/40">
          Professional referrals. Clearer pathways. Stronger relationships.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center bg-[var(--background)] px-6 py-14 lg:px-16">
        <div className="mb-8 lg:hidden">
          <ECLLogoPlaceholder variant="full" theme="light" />
        </div>
        <div className="w-full max-w-md">
          <Link href="/login" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text)]">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          {!isConfigured ? (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-5 text-sm text-[var(--text-secondary)]">
              Supabase is not configured in this environment, so email sign-in is unavailable. Set
              <code className="mx-1 rounded bg-[var(--surface)] px-1.5 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_URL</code>
              and
              <code className="mx-1 rounded bg-[var(--surface)] px-1.5 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
              to enable it.
            </div>
          ) : step === "email" ? (
            <>
              <h2 className="font-serif-display text-2xl font-semibold text-[var(--text)]">Sign in with your email</h2>
              <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
                We&rsquo;ll send a one-time code to your email address. No password required.
              </p>
              <form onSubmit={handleSendCode} className="mt-7 flex flex-col gap-3">
                <Input
                  type="email"
                  placeholder="Email address"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Sending code…" : "Send code"}
                </Button>
              </form>
            </>
          ) : (
            <>
              <h2 className="font-serif-display text-2xl font-semibold text-[var(--text)]">Enter your code</h2>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                <CheckCircle2 className="h-4 w-4 text-[var(--success)]" />
                We sent a code to {email}
              </p>
              <form onSubmit={handleVerifyCode} className="mt-7 flex flex-col gap-3">
                <Input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="6-digit code"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="text-center text-lg tracking-[0.3em]"
                />
                {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Verifying…" : "Verify & sign in"}
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setCode("");
                    setError(null);
                  }}
                  className="text-sm font-medium text-[var(--accent)] hover:underline"
                >
                  Use a different email
                </button>
              </form>
            </>
          )}

          <p className="mt-8 rounded-xl bg-[var(--surface-soft)] p-4 text-xs leading-relaxed text-[var(--text-secondary)]">
            {LOGIN_DISCLAIMER}
          </p>
        </div>
      </div>
    </div>
  );
}
