export function ChartTooltip({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean;
  label?: string | number;
  payload?: { name: string; value: number | string; color?: string }[];
  formatter?: (value: number | string, name: string) => string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 shadow-lg text-sm">
      {label && <p className="mb-1 font-medium text-[var(--text)]">{label}</p>}
      <div className="flex flex-col gap-1">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 text-[var(--text-secondary)]">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color ?? "var(--accent)" }}
            />
            <span>{entry.name}:</span>
            <span className="font-medium text-[var(--text)]">
              {formatter ? formatter(entry.value, entry.name) : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Adapts recharts' loosely-typed Tooltip content prop to ChartTooltip. */
export function tooltipContent(formatter?: (value: number | string, name: string) => string) {
  function RechartsTooltipAdapter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props: any
  ) {
    return <ChartTooltip active={props.active} label={props.label} payload={props.payload} formatter={formatter} />;
  }
  return RechartsTooltipAdapter;
}
