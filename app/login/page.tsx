"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, ClipboardCheck, Link2, Stethoscope, Users } from "lucide-react";
import { ECLLogoPlaceholder } from "@/components/branding/ECLLogoPlaceholder";
import { OpticalMotif } from "@/components/branding/OpticalMotif";
import { LOGIN_DISCLAIMER } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/supabase/auth-context";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

const FEATURES = [
  { icon: Link2, label: "Refer patients in minutes" },
  { icon: ClipboardCheck, label: "Follow every referral journey" },
  { icon: Users, label: "Strengthen professional relationships" },
];

const DEMO_OPTIONS = [
  {
    id: "partner",
    title: "Referring Partner Demo",
    subtitle: "Refer patients, track pathways and access clinical resources.",
    icon: Stethoscope,
    href: "/partner",
  },
  {
    id: "clinic",
    title: "Clinic Team Demo",
    subtitle: "Manage referrals, partners and business development activity.",
    icon: Users,
    href: "/clinic",
  },
  {
    id: "executive",
    title: "Executive Analytics Demo",
    subtitle: "Explore referral KPIs, commercial insights and growth opportunities.",
    icon: BarChart3,
    href: "/executive",
  },
];

const ROLE_HOME: Record<string, string> = {
  partner: "/partner",
  clinic: "/clinic",
  executive: "/executive",
};

export default function LoginPage() {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { isConfigured, signIn, user, profile } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (user && profile) {
      router.push(ROLE_HOME[profile.portal_role] ?? "/login");
    }
  }, [user, profile, router]);

  function handleSelect(id: string, href: string) {
    if (loadingId) return;
    setLoadingId(id);
    window.setTimeout(() => {
      router.push(href);
    }, 850);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) setFormError(error);
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
            Better connections. Clearer patient journeys.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/70">
            A smarter professional referral platform connecting trusted healthcare partners with consultant-led
            ophthalmology, advanced diagnostics and personalised eye-care pathways.
          </p>
          <ul className="mt-8 space-y-3">
            {FEATURES.map((f) => (
              <li key={f.label} className="flex items-center gap-3 text-sm text-white/85">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[var(--accent)]">
                  <f.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {f.label}
              </li>
            ))}
          </ul>
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
          <h2 className="font-serif-display text-2xl font-semibold text-[var(--text)]">Welcome to ECL Connect</h2>

          {isConfigured ? (
            <>
              <p className="mt-1.5 text-sm text-[var(--text-secondary)]">Choose how you&rsquo;d like to sign in.</p>

              <Link
                href="/login/partner"
                className="group relative mt-7 flex items-center gap-4 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-left shadow-sm transition hover:border-[var(--accent)] hover:shadow-md"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Stethoscope className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-serif-display text-base font-semibold text-[var(--text)]">Referring Partner Demo</span>
                  <span className="mt-0.5 block text-sm text-[var(--text-secondary)]">
                    Sign in with your email — we&rsquo;ll send you a one-time code, no password needed.
                  </span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-[var(--border)] transition group-hover:text-[var(--accent)]" />
              </Link>

              <div className="mt-6 flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">
                <span className="h-px flex-1 bg-[var(--border)]" />
                Clinic &amp; executive sign-in
                <span className="h-px flex-1 bg-[var(--border)]" />
              </div>

              <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
                <Input
                  type="email"
                  placeholder="Email address"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {formError && <p className="text-sm text-[var(--danger)]">{formError}</p>}
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Signing in…" : "Sign in"}
                </Button>
              </form>
              <details className="mt-6 rounded-xl bg-[var(--surface-soft)] p-4 text-xs text-[var(--text-secondary)]">
                <summary className="cursor-pointer font-medium text-[var(--text)]">Demo accounts</summary>
                <ul className="mt-2 space-y-1">
                  <li>Partner (OTP): priya.shah@example-opticians.co.uk</li>
                  <li>Clinic (password): ryan@eyecliniclondon.com</li>
                  <li>Executive (password): executive@eyecliniclondon.com</li>
                </ul>
                <p className="mt-2">Clinic/executive password: Demo-Passw0rd! (rotate before real use)</p>
              </details>
            </>
          ) : (
            <>
              <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
                Select a demo experience to explore the platform.
              </p>

              <div className="mt-7 flex flex-col gap-3">
                {DEMO_OPTIONS.map((option) => {
                  const isLoading = loadingId === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelect(option.id, option.href)}
                      disabled={loadingId !== null}
                      className={cn(
                        "group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-left shadow-sm transition disabled:cursor-not-allowed",
                        !loadingId && "hover:border-[var(--accent)] hover:shadow-md",
                        isLoading && "border-[var(--accent)]"
                      )}
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                        <option.icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-serif-display text-base font-semibold text-[var(--text)]">
                          {option.title}
                        </span>
                        <span className="mt-0.5 block text-sm text-[var(--text-secondary)]">{option.subtitle}</span>
                      </span>
                      {isLoading ? (
                        <span className="relative flex h-6 w-6 shrink-0 items-center justify-center">
                          <span className="absolute h-6 w-6 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
                        </span>
                      ) : (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--border)] transition group-hover:text-[var(--accent)]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <p className="mt-8 rounded-xl bg-[var(--surface-soft)] p-4 text-xs leading-relaxed text-[var(--text-secondary)]">
            {LOGIN_DISCLAIMER} All patients, referrals, practices, appointments and statistics shown are fictional.
          </p>
        </div>
      </div>
    </div>
  );
}
