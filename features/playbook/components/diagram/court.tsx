import { HalfCourtLines } from '@/features/playbook/components/diagram/half-court-lines';
import type { CourtType } from '@/features/playbook/utils/diagram/types';

// A full half-court: 100 units wide = 50ft, 94 tall = the full 47ft from the
// baseline to the division line. 2 units/ft on both axes, so nothing is
// distorted. Full court stacks two of these.
export const COURT_VIEWBOX: Record<CourtType, { w: number; h: number }> = {
  half: { w: 100, h: 94 },
  full: { w: 100, h: 188 },
};

const LINE = 'rgba(0,0,0,0.6)';

export function Court({ court }: { court: CourtType }) {
  const { w, h } = COURT_VIEWBOX[court];
  return (
    <>
      <defs>
        <linearGradient id="court-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CE9E62" />
          <stop offset="1" stopColor="#B98850" />
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
          <g fill="none" stroke={LINE} strokeWidth={0.5}>
            <line x1="3" y1="94" x2="97" y2="94" />
            <circle cx="50" cy="94" r="12" />
          </g>
        </>
      )}
    </>
  );
}
