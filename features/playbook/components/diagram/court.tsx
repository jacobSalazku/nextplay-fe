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
    >
      <line x1="6" y1="4" x2="94" y2="4" />
      <line x1="6" y1="4" x2="6" y2="94" />
      <line x1="94" y1="4" x2="94" y2="94" />

      <rect x="38" y="4" width="24" height="36" />
      <line x1="45" y1="4" x2="45" y2="40" stroke={LINE_FAINT} />
      <line x1="55" y1="4" x2="55" y2="40" stroke={LINE_FAINT} />
      <circle cx="50" cy="40" r="9" />
      <circle cx="50" cy="13" r="1.6" />
      <line x1="45" y1="9" x2="55" y2="9" strokeWidth={0.9} />
      <path d="M42 13 a8 8 0 0 0 16 0" stroke={LINE_FAINT} />

      <path d="M12 4 v18 A44 44 0 0 0 88 22 V4" />
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
            <line x1="6" y1="94" x2="94" y2="94" />
            <circle cx="50" cy="94" r="9" />
          </g>
        </>
      )}
    </>
  );
}
