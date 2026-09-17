const LINE = 'rgba(0,0,0,0.6)';
const LINE_FAINT = 'rgba(0,0,0,0.34)';

export function HalfCourtLines({ flip = false }: { flip?: boolean }) {
  return (
    <g
      transform={flip ? 'translate(0,188) scale(1,-1)' : undefined}
      fill="none"
      stroke={LINE}
      strokeWidth={0.5}
      strokeLinecap="round"
    >
      {/* baseline + sidelines */}
      <line x1="3" y1="3" x2="97" y2="3" />
      <line x1="3" y1="3" x2="3" y2="94" />
      <line x1="97" y1="3" x2="97" y2="94" />

      {/* the paint, with the free-throw line at its far edge */}
      <rect x="34" y="3" width="32" height="38" />
      <circle cx="50" cy="41" r="12" />

      {/* backboard + rim + restricted area */}
      <line x1="43" y1="11" x2="57" y2="11" strokeWidth={0.8} />
      <circle cx="50" cy="13.5" r="1.4" />
      <path d="M42 13.5 A8 8 0 0 0 58 13.5" stroke={LINE_FAINT} />

      {/* three-point line: corners at 3ft, arc 23.75ft from the rim */}
      <path d="M9 3 V37.5 A47.5 47.5 0 0 0 91 37.5 V3" />

      {/* centre circle at the division line — only the near half shows */}
      <circle cx="50" cy="94" r="12" stroke={LINE_FAINT} />

      {/* lane hash marks */}
      <g stroke={LINE_FAINT}>
        <line x1="32" y1="15" x2="34" y2="15" />
        <line x1="32" y1="23" x2="34" y2="23" />
        <line x1="32" y1="31" x2="34" y2="31" />
        <line x1="66" y1="15" x2="68" y2="15" />
        <line x1="66" y1="23" x2="68" y2="23" />
        <line x1="66" y1="31" x2="68" y2="31" />
      </g>
    </g>
  );
}
