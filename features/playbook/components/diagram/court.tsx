import type { CourtType } from '@/features/playbook/utils/diagram/types';

export const COURT_VIEWBOX: Record<CourtType, { w: number; h: number }> = {
  half: { w: 100, h: 94 },
  full: { w: 100, h: 188 },
};

const LINE = 'rgba(255,255,255,0.72)';
const LINE_FAINT = 'rgba(255,255,255,0.4)';

function HalfCourtLines({ flip = false }: { flip?: boolean }) {
  return (
    <g
      transform={flip ? 'translate(0,188) scale(1,-1)' : undefined}
      fill="none"
      stroke={LINE}
      strokeWidth={0.6}
      strokeLinecap="round"
    >
      {/* baseline + sidelines */}
      <line x1="5" y1="4" x2="95" y2="4" />
      <line x1="5" y1="4" x2="5" y2="94" />
      <line x1="95" y1="4" x2="95" y2="94" />

      {/* the paint, with the free-throw line at its far edge */}
      <rect x="36" y="4" width="28" height="36" />
      <circle cx="50" cy="40" r="10" />

      {/* backboard + rim + restricted area */}
      <line x1="43" y1="11" x2="57" y2="11" strokeWidth={0.9} />
      <circle cx="50" cy="14" r="1.5" />
      <path d="M43 14 A7 7 0 0 0 57 14" stroke={LINE_FAINT} />

      {/* three-point line: corners at 3ft, arc 23.75ft from the rim */}
      <path d="M11 4 V30 A42 42 0 0 0 89 30 V4" />

      {/* lane hash marks */}
      <g stroke={LINE_FAINT}>
        <line x1="34" y1="16" x2="36" y2="16" />
        <line x1="34" y1="24" x2="36" y2="24" />
        <line x1="34" y1="32" x2="36" y2="32" />
        <line x1="64" y1="16" x2="66" y2="16" />
        <line x1="64" y1="24" x2="66" y2="24" />
        <line x1="64" y1="32" x2="66" y2="32" />
      </g>
    </g>
  );
}

export function Court({ court }: { court: CourtType }) {
  const { w, h } = COURT_VIEWBOX[court];
  return (
    <>
      <defs>
        <linearGradient id="court-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#DEB887" />
          <stop offset="1" stopColor="#CFA068" />
        </linearGradient>
        <pattern
          id="court-planks"
          width="9"
          height={h}
          patternUnits="userSpaceOnUse"
        >
          <rect width="9" height={h} fill="url(#court-wood)" />
          <line
            x1="9"
            y1="0"
            x2="9"
            y2={h}
            stroke="rgba(0,0,0,0.05)"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect x="0" y="0" width={w} height={h} rx="2" fill="url(#court-planks)" />
      {court === 'half' ? (
        <HalfCourtLines />
      ) : (
        <>
          <HalfCourtLines />
          <HalfCourtLines flip />
          <g fill="none" stroke={LINE} strokeWidth={0.6}>
            <line x1="5" y1="94" x2="95" y2="94" />
            <circle cx="50" cy="94" r="10" />
          </g>
        </>
      )}
    </>
  );
}
