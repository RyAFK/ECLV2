"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, Mail, MessageSquare, Phone } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { RYAN_CONTACT } from "@/lib/constants";
import { PARTNER_DEMO_USER } from "@/data/demo-users";
import { useAuth } from "@/lib/supabase/auth-context";
import { initials } from "@/lib/formatters";

const REASONS = [
  "Discuss a patient referral",
  "Arrange a service presentation",
  "Organise a practice meeting",
  "Discuss a partnership opportunity",
  "Request educational materials",
  "Request patient leaflets",
  "Arrange a CPD discussion",
  "Request a referral performance review",
  "Other",
];

export default function ContactRyanPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { profile } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: PARTNER_DEMO_USER.name,
    organisation: PARTNER_DEMO_USER.organisation,
    email: PARTNER_DEMO_USER.email,
    phone: PARTNER_DEMO_USER.phone,
    reason: REASONS[0],
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  useEffect(() => {
    if (!profile) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time prefill from the loaded profile, not derivable from render
    setForm((prev) => ({
      ...prev,
      name: profile.display_name || prev.name,
      organisation: profile.practice_name || prev.organisation,
      email: profile.email || prev.email,
      phone: profile.contact_number || prev.phone,
    }));
  }, [profile]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    showToast({
      variant: "success",
      title: "Message sent to Ryan",
      description: "This is a demo simulation — Ryan will follow up shortly.",
    });
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <div>
        <h1 className="font-serif-display text-2xl font-semibold text-[var(--text)] sm:text-3xl">
          Your dedicated Eye Clinic London contact
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardBody className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)] text-lg font-semibold text-white">
                {initials(RYAN_CONTACT.name)}
              </span>
              <div>
                <p className="font-serif-display text-lg font-semibold text-[var(--text)]">{RYAN_CONTACT.name}</p>
                <p className="text-sm text-[var(--text-secondary)]">{RYAN_CONTACT.role}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
              Your direct point of contact for professional referrals, service information, patient pathways,
              educational meetings, practice engagement and partnership opportunities.
            </p>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" onClick={() => (window.location.href = `tel:${RYAN_CONTACT.phone.replace(/\s/g, "")}`)}>
                <Phone className="h-4 w-4" />
                Call Ryan · {RYAN_CONTACT.phone}
              </Button>
              <Button variant="outline" size="sm" onClick={() => (window.location.href = `mailto:${RYAN_CONTACT.email}`)}>
                <Mail className="h-4 w-4" />
                Email Ryan
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => showToast({ variant: "info", title: "Meeting request sent", description: "Ryan will confirm a suitable time." })}
              >
                <CalendarClock className="h-4 w-4" />
                Request a meeting
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => showToast({ variant: "info", title: "Practice visit requested", description: "Ryan will be in touch to arrange a visit." })}
              >
                <MessageSquare className="h-4 w-4" />
                Request a practice visit
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardBody>
            {submitted ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <p className="font-serif-display text-xl font-semibold text-[var(--text)]">Thank you — your message has been sent</p>
                <p className="max-w-sm text-sm text-[var(--text-secondary)]">
                  Ryan will follow up regarding &ldquo;{form.reason}&rdquo; shortly (demo simulation).
                </p>
                <div className="mt-3 flex gap-3">
                  <Button onClick={() => router.push("/partner")}>Return to dashboard</Button>
                  <Button variant="outline" onClick={() => setSubmitted(false)}>
                    Send another message
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Name" htmlFor="name" required>
                    <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
                  </Field>
                  <Field label="Practice or organisation" htmlFor="organisation" required>
                    <Input id="organisation" value={form.organisation} onChange={(e) => update("organisation", e.target.value)} required />
                  </Field>
                  <Field label="Email" htmlFor="email" required>
                    <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
                  </Field>
                  <Field label="Contact number" htmlFor="phone">
                    <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                  </Field>
                  <Field label="Reason for contact" htmlFor="reason" required>
                    <Select id="reason" value={form.reason} onChange={(e) => update("reason", e.target.value)}>
                      {REASONS.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Preferred date" htmlFor="preferredDate">
                    <Input id="preferredDate" type="date" value={form.preferredDate} onChange={(e) => update("preferredDate", e.target.value)} />
                  </Field>
                  <Field label="Preferred time" htmlFor="preferredTime">
                    <Input id="preferredTime" type="time" value={form.preferredTime} onChange={(e) => update("preferredTime", e.target.value)} />
                  </Field>
                </div>
                <Field label="Message" htmlFor="message" required>
                  <Textarea id="message" value={form.message} onChange={(e) => update("message", e.target.value)} required />
                </Field>
                <Button type="submit" className="w-fit">
                  Send message
                </Button>
              </form>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
