import {
  actionEndpoints,
  routePath,
} from '@/features/playbook/utils/diagram/geometry';
import { projectPhase } from '@/features/playbook/utils/diagram/project';
import type { CourtType, Phase } from '@/features/playbook/utils/diagram/types';
import { COURT_VIEWBOX } from './court';

const TAN = '#d3ac7d';
const NAVY = '#1f2d4d';

// A stripped-down phase picture for the strip / rail: just the players as navy
// dots and their routes on a plain tan card — no court markings, no numbers.
export function PhaseThumbnail({
  court,
  phase,
  className,
}: {
  court: CourtType;
  phase: Phase;
  className?: string;
}) {
  const { w, h } = COURT_VIEWBOX[court];
  const p = projectPhase(phase, court);

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-hidden
    >
      <rect x={0} y={0} width={w} height={h} fill={TAN} />

      {p.actions.map((action) => {
        const ends = actionEndpoints(action, p.objects);
        if (!ends) return null;
        return (
          <path
            key={action.id}
            d={routePath(action.type, ends.a, ends.b, ends.ctrl)}
            fill="none"
            stroke={NAVY}
            strokeWidth={1}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}

      {p.objects.map((object) => (
        <circle
          key={object.id}
          cx={object.x}
          cy={object.y}
          r={3.4}
          fill={NAVY}
        />
      ))}
    </svg>
  );
}
