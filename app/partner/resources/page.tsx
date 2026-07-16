"use client";

import { useState } from "react";
import { Download, Eye, Heart, Mail, Printer } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { RESOURCES } from "@/data/resources";
import { useLocalStorageState } from "@/lib/demo-storage";

export default function ResourcesPage() {
  const { showToast } = useToast();
  const [favourites, setFavourites] = useLocalStorageState<string[]>("resource-favourites", []);
  const [preview, setPreview] = useState<string | null>(null);

  function toggleFavourite(id: string) {
    setFavourites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif-display text-2xl font-semibold text-[var(--text)] sm:text-3xl">Practice resources</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-[var(--text-secondary)]">
          Downloadable guides, leaflets and materials to support your patient conversations and referral process.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {RESOURCES.map((resource) => {
          const favourited = favourites.includes(resource.id);
          return (
            <Card key={resource.id} className="flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <Badge tone="neutral">{resource.type}</Badge>
                <button
                  aria-label={favourited ? "Remove from favourites" : "Add to favourites"}
                  onClick={() => toggleFavourite(resource.id)}
                  className="rounded-full p-1 text-[var(--text-secondary)] transition hover:bg-[var(--surface-soft)]"
                >
                  <Heart className={`h-4 w-4 ${favourited ? "fill-[var(--danger)] text-[var(--danger)]" : ""}`} />
                </button>
              </div>
              <h3 className="font-serif-display text-base font-semibold text-[var(--text)]">{resource.title}</h3>
              <p className="text-sm text-[var(--text-secondary)]">{resource.description}</p>
              <p className="text-xs text-[var(--text-secondary)]">{resource.fileName}</p>
              <div className="mt-auto flex flex-wrap gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setPreview(resource.id)}>
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  onClick={() => showToast({ variant: "success", title: "Demo PDF downloaded", description: resource.fileName })}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => showToast({ variant: "info", title: "Printed copies requested", description: `We'll send printed copies of ${resource.title} to your practice.` })}
                >
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => showToast({ variant: "info", title: "Share simulated", description: `${resource.title} shared by email (demo simulation).` })}
                >
                  <Mail className="h-4 w-4" />
                  Share
                </Button>
              </div>
              {preview === resource.id && (
                <div className="mt-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-4 text-center text-xs text-[var(--text-secondary)]">
                  Demo preview of {resource.fileName} — no real file is stored in this environment.
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
