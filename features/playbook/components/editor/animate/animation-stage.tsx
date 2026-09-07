'use client';

import {
  Court,
  COURT_VIEWBOX,
} from '@/features/playbook/components/diagram/court';
import {
  Route,
  RouteArrowMarker,
} from '@/features/playbook/components/diagram/route';
import { Token } from '@/features/playbook/components/diagram/tokens';
import type { AnimationFrame } from '@/features/playbook/utils/diagram/interpolate';
import { courtScaleY } from '@/features/playbook/utils/diagram/project';
import type { CourtType, Phase } from '@/features/playbook/utils/diagram/types';
import { BALL } from '@/features/playbook/utils/editor/colors';

type Props = {
  court: CourtType;
  phases: Phase[];
  frame: AnimationFrame;
};

// Read-only playback surface: the drawn routes of the phase being left, drawn
// against their static start positions, with the tokens moving over them.
export function AnimationStage({ court, phases, frame }: Props) {
  const { w, h } = COURT_VIEWBOX[court];
  const sy = courtScaleY(court);

  const from = phases[frame.fromIndex];
  const routeObjects = from.objects.map((o) => ({ ...o, y: o.y * sy }));
  const routeOpacity = 1 - 0.7 * frame.t;

  return (
    <div
      className="relative h-full max-w-full"
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label={`Play animation, phase ${frame.fromIndex + 1}`}
      >
        <defs>
          <RouteArrowMarker />
        </defs>

        <Court court={court} />

        <g opacity={routeOpacity}>
          {from.actions.map((action) => (
            <Route key={action.id} action={action} objects={routeObjects} />
          ))}
        </g>

        {frame.objects.map((object) => (
          <g key={object.id} opacity={object.opacity}>
            <Token object={{ ...object, y: object.y * sy }} hasBall={false} />
          </g>
        ))}

        {frame.ball && (
          <circle
            cx={frame.ball.x}
            cy={frame.ball.y * sy}
            r={1.1}
            fill={BALL}
            stroke="white"
            strokeWidth={0.4}
          />
        )}
      </svg>
    </div>
  );
}
