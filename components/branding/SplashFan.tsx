/**
 * Faceted pinwheel/fan motif for the splash screen: triangular wedges
 * radiating from a shared centre point, outlined in gold. Slight per-wedge
 * radius variation gives it the same organic, hand-folded-fan silhouette as
 * the approved ad concept, rather than a perfectly regular sunburst.
 */

const WEDGE_COUNT = 16;
// Cycle of outer radii (as a fraction of the max radius) walked around the
// circle - repeats to fill WEDGE_COUNT, giving an irregular faceted edge.
const RADIUS_CYCLE = [1, 0.76, 0.94, 0.82, 0.98, 0.78, 0.92, 0.84];

export function SplashFan({ className }: { className?: string }) {
  const cx = 110;
  const cy = 110;
  const maxR = 98;

  const points = Array.from({ length: WEDGE_COUNT }, (_, i) => {
    const angle = (i / WEDGE_COUNT) * Math.PI * 2 - Math.PI / 2; // start pointing up
    const r = maxR * RADIUS_CYCLE[i % RADIUS_CYCLE.length];
    return {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
    };
  });

  return (
    <svg viewBox="0 0 220 220" className={className} aria-hidden="true">
      {points.map((p, i) => {
        const next = points[(i + 1) % points.length];
        return (
          <path
            key={i}
            d={`M${cx},${cy} L${p.x.toFixed(2)},${p.y.toFixed(2)} L${next.x.toFixed(2)},${next.y.toFixed(2)} Z`}
            fill="#0f2a22"
            stroke="#d1ab68"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
        );
      })}
    </svg>
  );
}
