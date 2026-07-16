import { ArrowRight, Compass, LineChart, Link2 } from "lucide-react";
import { ECLLogoPlaceholder } from "@/components/branding/ECLLogoPlaceholder";
import { OpticalMotif } from "@/components/branding/OpticalMotif";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DEMO_DISCLAIMER, RYAN_CONTACT } from "@/lib/constants";

const BENEFITS = [
  {
    icon: Link2,
    title: "Refer with confidence",
    description: "Submit patient referrals through a simple guided process.",
  },
  {
    icon: Compass,
    title: "Stay informed",
    description: "Follow each referral from receipt through consultation, treatment and completion.",
  },
  {
    icon: LineChart,
    title: "Build stronger pathways",
    description:
      "Access service information, education, resources and direct relationship support in one place.",
  },
];

export default function PublicLandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <header className="flex items-center justify-between px-6 py-5 lg:px-12">
        <ECLLogoPlaceholder variant="full" theme="light" />
        <LinkButton href="/login" variant="outline" size="sm">
          Sign in to demo
        </LinkButton>
      </header>

      <section className="relative overflow-hidden bg-[var(--sidebar)] px-6 py-20 text-white lg:px-12 lg:py-28">
        <OpticalMotif className="pointer-events-none absolute -right-40 top-1/2 h-[560px] w-[560px] -translate-y-1/2 opacity-70" />
        <div className="relative mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">ECL Connect</p>
          <h1 className="mt-4 font-serif-display text-4xl font-semibold leading-tight tracking-tight lg:text-5xl">
            Connecting professional referrals with exceptional specialist eye care.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 lg:text-lg">
            A modern professional referral experience helping trusted partners make referrals, follow patient
            pathways and access Eye Clinic London services, education and relationship support.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/login" variant="secondary" size="lg">
              Explore partner portal
              <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton href="/login" variant="outline" size="lg" className="border-white/25 text-white hover:bg-white/10">
              View clinic dashboard
            </LinkButton>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-12">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
          {BENEFITS.map((benefit) => (
            <Card key={benefit.title} className="p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                <benefit.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-serif-display text-lg font-semibold text-[var(--text)]">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{benefit.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20 lg:px-12">
        <Card className="mx-auto max-w-5xl bg-[var(--surface-soft)] p-8 text-center">
          <h2 className="font-serif-display text-2xl font-semibold text-[var(--text)]">
            Ready to see ECL Connect in action?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--text-secondary)]">
            Explore the referring-partner journey, the clinic team dashboard or the executive analytics view — no
            account required.
          </p>
          <div className="mt-6 flex justify-center">
            <LinkButton href="/login" size="lg">
              Enter the demonstration
              <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
          <p className="mx-auto mt-4 max-w-xl text-xs text-[var(--text-secondary)]">
            Or contact {RYAN_CONTACT.name}, {RYAN_CONTACT.role}, at {RYAN_CONTACT.email}.
          </p>
        </Card>
      </section>

      <footer className="border-t border-[var(--border)] px-6 py-6 text-center text-xs text-[var(--text-secondary)] lg:px-12">
        {DEMO_DISCLAIMER}
      </footer>
    </div>
  );
}
