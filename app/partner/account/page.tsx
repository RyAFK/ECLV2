"use client";

import { Card, CardBody } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { useLocalStorageState } from "@/lib/demo-storage";
import { getPartner } from "@/data/partners";
import { PARTNER_DEMO_USER } from "@/data/demo-users";
import { RESOURCES } from "@/data/resources";
import { formatCurrency, formatPercent, initials } from "@/lib/formatters";

const partner = getPartner("marylebone-independent-opticians")!;

export default function PartnerAccountPage() {
  const { showToast } = useToast();
  const [favourites] = useLocalStorageState<string[]>("resource-favourites", []);
  const [prefs, setPrefs] = useLocalStorageState("notification-prefs", {
    emailUpdates: true,
    inAppNotifications: true,
    cpdInvites: true,
    dormantAlerts: false,
  });

  function togglePref(key: keyof typeof prefs) {
    setPrefs({ ...prefs, [key]: !prefs[key] });
    showToast({ variant: "success", title: "Preference updated", description: "Your demo notification setting has been saved." });
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif-display text-2xl font-semibold text-[var(--text)] sm:text-3xl">Account</h1>
        <p className="mt-1.5 text-sm text-[var(--text-secondary)]">Fictional demo account details for this practice.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardBody className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)] text-lg font-semibold text-white">
                {initials(PARTNER_DEMO_USER.name)}
              </span>
              <div>
                <p className="font-serif-display text-lg font-semibold text-[var(--text)]">{PARTNER_DEMO_USER.name}</p>
                <p className="text-sm text-[var(--text-secondary)]">{PARTNER_DEMO_USER.role}</p>
              </div>
            </div>
            <dl className="flex flex-col gap-3 text-sm">
              <Row label="Organisation" value={PARTNER_DEMO_USER.organisation} />
              <Row label="Primary practice" value={PARTNER_DEMO_USER.location} />
              <Row label="Email" value={PARTNER_DEMO_USER.email} />
              <Row label="Contact" value={PARTNER_DEMO_USER.phone} />
              <Row label="Member since" value={PARTNER_DEMO_USER.memberSince} />
              <Row label="Relationship manager" value="Ryan" />
            </dl>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Referral summary</p>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Stat label="Total referrals" value={String(partner.referrals)} />
              <Stat label="Active" value="3" />
              <Stat label="Completed" value="14" />
              <Stat label="Conversion" value={formatPercent(partner.conversion)} />
              <Stat label="Treatment bookings" value={String(partner.treatmentBookings)} />
              <Stat label="Most-referred pathway" value="Cataract" />
            </div>
            <p className="mt-4 text-xs text-[var(--text-secondary)]">
              Last referral sent {partner.lastReferralDaysAgo} days ago. All figures shown are fictional demo data.
            </p>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Saved resources</p>
            {favourites.length === 0 ? (
              <p className="mt-3 text-sm text-[var(--text-secondary)]">No favourites saved yet. Visit Practice resources to save materials.</p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2">
                {RESOURCES.filter((r) => favourites.includes(r.id)).map((r) => (
                  <li key={r.id} className="flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                    <span className="text-[var(--text)]">{r.title}</span>
                    <Badge tone="neutral">{r.type}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Demo notification settings</p>
            <div className="mt-3 flex flex-col gap-3">
              <Checkbox label="Email-style demo notifications" checked={prefs.emailUpdates} onChange={() => togglePref("emailUpdates")} />
              <Checkbox label="In-app notifications" checked={prefs.inAppNotifications} onChange={() => togglePref("inAppNotifications")} />
              <Checkbox label="CPD and education invitations" checked={prefs.cpdInvites} onChange={() => togglePref("cpdInvites")} />
              <Checkbox label="Practice engagement summaries" checked={prefs.dormantAlerts} onChange={() => togglePref("dormantAlerts")} />
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody>
          <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Portal activity</p>
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label="Education views" value={String(partner.educationViews ?? 0)} />
            <Stat label="Resources downloaded" value={String(partner.resourcesDownloaded ?? 0)} />
            <Stat label="CPD attendance" value={String(partner.cpdAttendance ?? 0)} />
            <Stat label="Estimated value" value={formatCurrency(partner.estimatedValue)} />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-[var(--text-secondary)]">{label}</dt>
      <dd className="text-right font-medium text-[var(--text)]">{value}</dd>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">{label}</p>
      <p className="mt-1 font-serif-display text-xl font-semibold text-[var(--text)]">{value}</p>
    </div>
  );
}
