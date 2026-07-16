"use client";

import { useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Checkbox, Field, Input, Select } from "@/components/ui/Field";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { useLocalStorageState, clearAllDemoStorage } from "@/lib/demo-storage";
import { RYAN_CONTACT } from "@/lib/constants";

export default function ClinicSettingsPage() {
  const { showToast } = useToast();
  const [resetOpen, setResetOpen] = useState(false);
  const [contact, setContact] = useLocalStorageState("ryan-contact-override", {
    name: RYAN_CONTACT.name,
    email: RYAN_CONTACT.email,
    phone: RYAN_CONTACT.phone,
  });
  const [settings, setSettings] = useLocalStorageState("clinic-settings", {
    emailNotifications: true,
    inAppNotifications: true,
    compactTables: false,
    darkMode: false,
    defaultLocation: "Harley Street",
    defaultDateRange: "Last 30 days",
    logoVariant: "Full wordmark",
  });

  function save(message: string) {
    showToast({ variant: "success", title: "Settings saved", description: message });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif-display text-2xl font-semibold text-[var(--text)] sm:text-3xl">Settings</h1>
        <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
          Demo settings only — nothing here is sent to a backend.
        </p>
      </div>

      <Card>
        <CardBody>
          <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Notifications</p>
          <div className="mt-3 flex flex-col gap-3">
            <Checkbox
              label="Email-style demo notifications"
              checked={settings.emailNotifications}
              onChange={(e) => { setSettings({ ...settings, emailNotifications: e.target.checked }); save("Notification preference updated."); }}
            />
            <Checkbox
              label="In-app notifications"
              checked={settings.inAppNotifications}
              onChange={(e) => { setSettings({ ...settings, inAppNotifications: e.target.checked }); save("Notification preference updated."); }}
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Appearance</p>
          <div className="mt-3 flex flex-col gap-3">
            <Checkbox
              label="Compact table mode"
              checked={settings.compactTables}
              onChange={(e) => { setSettings({ ...settings, compactTables: e.target.checked }); save("Table density updated."); }}
            />
            <Checkbox
              label="Dark mode (preference saved, demo only)"
              checked={settings.darkMode}
              onChange={(e) => { setSettings({ ...settings, darkMode: e.target.checked }); save("Appearance preference updated."); }}
            />
            <Field label="Default logo variant" htmlFor="logo-variant" className="max-w-xs">
              <Select
                id="logo-variant"
                value={settings.logoVariant}
                onChange={(e) => { setSettings({ ...settings, logoVariant: e.target.value }); save("Logo variant updated."); }}
              >
                <option>Full wordmark</option>
                <option>Compact mark</option>
                <option>Icon only</option>
              </Select>
            </Field>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Referral form defaults</p>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Default clinic location" htmlFor="default-location">
              <Select
                id="default-location"
                value={settings.defaultLocation}
                onChange={(e) => { setSettings({ ...settings, defaultLocation: e.target.value }); save("Default location updated."); }}
              >
                <option>Harley Street</option>
                <option>East Grinstead</option>
                <option>No preference</option>
              </Select>
            </Field>
            <Field label="Default dashboard date range" htmlFor="default-range">
              <Select
                id="default-range"
                value={settings.defaultDateRange}
                onChange={(e) => { setSettings({ ...settings, defaultDateRange: e.target.value }); save("Default date range updated."); }}
              >
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Year to date</option>
              </Select>
            </Field>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Contact details</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Update Ryan&rsquo;s displayed contact details (demo front-end state only).</p>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Name" htmlFor="contact-name">
              <Input id="contact-name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
            </Field>
            <Field label="Email" htmlFor="contact-email">
              <Input id="contact-email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
            </Field>
            <Field label="Phone" htmlFor="contact-phone">
              <Input id="contact-phone" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
            </Field>
          </div>
          <Button size="sm" className="mt-4" onClick={() => save("Contact details updated across the demo portal.")}>
            Save contact details
          </Button>
        </CardBody>
      </Card>

      <Card className="border-[var(--danger)]/30">
        <CardBody>
          <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Demo privacy controls and data reset</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Resetting demo data clears any locally saved demo state (tasks, favourites, notification read status) and
            restores the default demonstration data.
          </p>
          <Button variant="danger" size="sm" className="mt-4" onClick={() => setResetOpen(true)}>
            Reset demo data
          </Button>
        </CardBody>
      </Card>

      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={() => {
          clearAllDemoStorage();
          showToast({ variant: "success", title: "Demo data reset", description: "All locally saved demo state has been cleared." });
        }}
        title="Reset demo data?"
        description="This clears locally saved demo state such as tasks, favourites and notification status. This cannot be undone."
        confirmLabel="Reset demo data"
        variant="danger"
      />
    </div>
  );
}
