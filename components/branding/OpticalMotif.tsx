export function OpticalMotif({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 600" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="ecl-focal" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#b69a62" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#b69a62" stopOpacity="0" />
        </radialGradient>
      </defs>
      {[260, 210, 160, 110].map((r) => (
        <circle key={r} cx="300" cy="300" r={r} fill="none" stroke="white" strokeOpacity="0.14" strokeWidth="1" />
      ))}
      <circle cx="300" cy="300" r="60" fill="url(#ecl-focal)" />
      <circle cx="300" cy="300" r="14" fill="#b69a62" />
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const x1 = 300 + Math.cos(angle) * 270;
        const y1 = 300 + Math.sin(angle) * 270;
        const x2 = 300 + Math.cos(angle) * 285;
        const y2 = 300 + Math.sin(angle) * 285;
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeOpacity="0.2" strokeWidth="1.5" />
        );
      })}
      <g opacity="0.15">
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 60} x2="600" y2={i * 60} stroke="white" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 60} y1="0" x2={i * 60} y2="600" stroke="white" strokeWidth="0.5" />
        ))}
      </g>
    </svg>
  );
}
