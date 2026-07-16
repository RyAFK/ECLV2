import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PATHWAYS } from "@/data/services";
import { REFERRALS_BY_PATHWAY } from "@/data/analytics";

export default function ClinicServicesPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif-display text-2xl font-semibold text-[var(--text)] sm:text-3xl">Services</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-[var(--text-secondary)]">
          Overview of Eye Clinic London pathways available to referring professionals, with current fictional
          referral demand.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {PATHWAYS.filter((p) => p.id !== "not-sure").map((pathway) => {
          const demand = REFERRALS_BY_PATHWAY.find((r) => r.pathway.toLowerCase().includes(pathway.name.split(" ")[0].toLowerCase()));
          return (
            <Card key={pathway.id} className="flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-serif-display text-base font-semibold text-[var(--text)]">{pathway.name}</h3>
                {demand && <Badge tone="accent">{demand.value} referrals</Badge>}
              </div>
              <p className="text-sm text-[var(--text-secondary)]">{pathway.description}</p>
              {pathway.elements.length > 0 && (
                <ul className="mt-1 flex flex-col gap-1 text-xs text-[var(--text-secondary)]">
                  {pathway.elements.slice(0, 3).map((el) => (
                    <li key={el} className="flex items-start gap-1.5">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                      {el}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
