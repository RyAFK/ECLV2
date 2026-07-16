"use client";

import { useState } from "react";
import { CalendarClock, Mail, MessageSquare, Phone } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Field, Textarea, Input } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { RYAN_CONTACT } from "@/lib/constants";
import { initials } from "@/lib/formatters";

export function ContactRyanCard({ context }: { context?: string }) {
  const { showToast } = useToast();
  const [messageOpen, setMessageOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [preferredDate, setPreferredDate] = useState("");

  return (
    <Card className="p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Your dedicated contact</p>
      <div className="mt-3 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-semibold text-white">
          {initials(RYAN_CONTACT.name)}
        </span>
        <div>
          <p className="font-serif-display text-base font-semibold text-[var(--text)]">{RYAN_CONTACT.name}</p>
          <p className="text-sm text-[var(--text-secondary)]">{RYAN_CONTACT.role}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{RYAN_CONTACT.description}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" onClick={() => setMessageOpen(true)}>
          <MessageSquare className="h-4 w-4" />
          Send message
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            window.location.href = `tel:${RYAN_CONTACT.phone.replace(/\s/g, "")}`;
          }}
        >
          <Phone className="h-4 w-4" />
          Call Ryan
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            window.location.href = `mailto:${RYAN_CONTACT.email}`;
          }}
        >
          <Mail className="h-4 w-4" />
          Email Ryan
        </Button>
        <Button variant="outline" size="sm" onClick={() => setBookOpen(true)}>
          <CalendarClock className="h-4 w-4" />
          Book a chat
        </Button>
      </div>

      <Modal
        open={messageOpen}
        onClose={() => setMessageOpen(false)}
        title="Send a message to Ryan"
        description={context}
        footer={
          <>
            <Button variant="outline" onClick={() => setMessageOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setMessageOpen(false);
                setMessage("");
                showToast({
                  variant: "success",
                  title: "Message sent to Ryan",
                  description: "This is a demo simulation — no message has actually been sent.",
                });
              }}
            >
              Send message
            </Button>
          </>
        }
      >
        <Field label="Message" htmlFor="ryan-message">
          <Textarea
            id="ryan-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message for Ryan..."
          />
        </Field>
      </Modal>

      <Modal
        open={bookOpen}
        onClose={() => setBookOpen(false)}
        title="Book a conversation with Ryan"
        description="Suggest a date and time that works for you."
        footer={
          <>
            <Button variant="outline" onClick={() => setBookOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setBookOpen(false);
                setPreferredDate("");
                showToast({
                  variant: "success",
                  title: "Conversation requested",
                  description: "Ryan will confirm a time in this demo simulation.",
                });
              }}
            >
              Request conversation
            </Button>
          </>
        }
      >
        <Field label="Preferred date and time" htmlFor="preferred-date">
          <Input
            id="preferred-date"
            type="datetime-local"
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
          />
        </Field>
      </Modal>
    </Card>
  );
}
