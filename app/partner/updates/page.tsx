"use client";

import { useMemo, useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { UPDATES, UPDATE_CATEGORIES } from "@/data/updates";
import { formatDate } from "@/lib/formatters";

export default function UpdatesPage() {
  const [category, setCategory] = useState("All");
  const filtered = useMemo(
    () => (category === "All" ? UPDATES : UPDATES.filter((u) => u.category === category)),
    [category]
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif-display text-2xl font-semibold text-[var(--text)] sm:text-3xl">News and updates</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-[var(--text-secondary)]">
          The latest professional updates, service news and educational announcements from Eye Clinic London.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {UPDATE_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
              category === c
                ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-soft)]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map((update) => (
          <Card key={update.id}>
            <CardBody className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Badge tone="accent">{update.category}</Badge>
                  <span className="text-xs text-[var(--text-secondary)]">{formatDate(update.date)}</span>
                </div>
                <h3 className="mt-2 font-serif-display text-lg font-semibold text-[var(--text)]">{update.title}</h3>
                <p className="mt-1.5 max-w-2xl text-sm text-[var(--text-secondary)]">{update.description}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
