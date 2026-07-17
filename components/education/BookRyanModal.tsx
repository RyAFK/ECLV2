"use client";

import { CalendarClock, Mail, Phone } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { RYAN_CONTACT } from "@/lib/constants";
import { initials } from "@/lib/formatters";

export function BookRyanModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { showToast } = useToast();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Not sure whether a patient is suitable for referral?"
      description="Book a quick conversation with Ryan to discuss the case, possible treatment pathways or the most appropriate next step."
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)] text-lg font-semibold text-white">
            {initials(RYAN_CONTACT.name)}
          </span>
          <div>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">{RYAN_CONTACT.name}</p>
            <p className="text-sm text-[var(--text-secondary)]">{RYAN_CONTACT.role}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="outline" onClick={() => (window.location.href = `mailto:${RYAN_CONTACT.email}`)}>
            <Mail className="h-4 w-4" />
            Email Ryan
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = `tel:${RYAN_CONTACT.phone.replace(/\s/g, "")}`)}>
            <Phone className="h-4 w-4" />
            Call Ryan · {RYAN_CONTACT.phone}
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              showToast({
                variant: "success",
                title: "Callback requested",
                description: "This is a demo simulation — Ryan will call you back shortly.",
              })
            }
          >
            <CalendarClock className="h-4 w-4" />
            Request a callback
          </Button>
        </div>
      </div>
    </Modal>
  );
}
