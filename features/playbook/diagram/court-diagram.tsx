import { Court, COURT_VIEWBOX } from './court';
import { Route, RouteArrowMarker } from './route';
import { Token } from './tokens';
import type { CourtType, Phase, Point } from './types';

// Stored coords are 0..100 on both axes; scale y into the court's viewBox height
// so the same diagram renders correctly on a half or full court.
function projectPhase(phase: Phase, court: CourtType): Phase {
  const sy = COURT_VIEWBOX[court].h / 100;
  const scaleY = <T extends Point>(p: T): T => ({ ...p, y: p.y * sy });

  return {
    ...phase,
    objects: phase.objects.map(scaleY),
    actions: phase.actions.map((action) => ({
      ...action,
      ...(action.toPoint ? { toPoint: scaleY(action.toPoint) } : null),
      ...(action.bend ? { bend: scaleY(action.bend) } : null),
    })),
  };
}

export function CourtDiagram({
  court,
  phase,
  ballHolderId,
  className,
}: {
  court: CourtType;
  phase: Phase;
  ballHolderId?: string;
  className?: string;
}) {
  const { w, h } = COURT_VIEWBOX[court];
  const projected = projectPhase(phase, court);

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      role="img"
      aria-label={`Play diagram, ${phase.objects.length} players`}
    >
      <defs>
        <RouteArrowMarker />
      </defs>
      <Court court={court} />
      {projected.actions.map((action) => (
        <Route key={action.id} action={action} objects={projected.objects} />
      ))}
      {projected.objects.map((object) => (
        <Token
          key={object.id}
          object={object}
          hasBall={object.id === ballHolderId}
        />
      ))}
    </svg>
  );
}
