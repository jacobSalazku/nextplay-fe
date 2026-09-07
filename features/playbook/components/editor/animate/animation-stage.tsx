'use client';

import {
  Court,
  COURT_VIEWBOX,
} from '@/features/playbook/components/diagram/court';
import { RouteArrowMarker } from '@/features/playbook/components/diagram/route';
import { Token } from '@/features/playbook/components/diagram/tokens';
import {
  actionEndpoints,
  ARROW_ACTIONS,
  routePath,
} from '@/features/playbook/utils/diagram/geometry';
import type { AnimationFrame } from '@/features/playbook/utils/diagram/interpolate';
import { courtScaleY } from '@/features/playbook/utils/diagram/project';
import type { CourtType, Phase } from '@/features/playbook/utils/diagram/types';
import { BALL } from '@/features/playbook/utils/editor/colors';

const INK = '#1E1B16';

type Props = {
  court: CourtType;
  phases: Phase[];
  frame: AnimationFrame;
};

// Read-only playback surface. Each route inks itself in as its beat runs, and
// the tokens move along it at the same time.
export function AnimationStage({ court, phases, frame }: Props) {
  const { w, h } = COURT_VIEWBOX[court];
  const sy = courtScaleY(court);

  const from = phases[frame.fromIndex];
  const routeObjects = from.objects.map((o) => ({ ...o, y: o.y * sy }));
  const inkOpacity = 1 - 0.5 * frame.t;

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

        {from.actions.map((action) => {
          const ends = actionEndpoints(action, routeObjects);
          if (!ends) return null;
          const d = routePath(action.type, ends.a, ends.b, ends.ctrl);
          const p = frame.routes.find((r) => r.id === action.id)?.progress ?? 0;
          return (
            <g key={action.id}>
              <path
                d={d}
                fill="none"
                stroke={INK}
                strokeWidth={0.45}
                opacity={0.1}
              />
              <path
                d={d}
                fill="none"
                stroke={INK}
                strokeWidth={0.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - p}
                opacity={inkOpacity}
                markerEnd={
                  p > 0.98 && ARROW_ACTIONS.has(action.type)
                    ? 'url(#route-arrow)'
                    : undefined
                }
              />
            </g>
          );
        })}

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
