import { Court, COURT_VIEWBOX } from './court';
import { projectPhase } from './project';
import { Route, RouteArrowMarker } from './route';
import { Token } from './tokens';
import type { CourtType, Phase } from './types';

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
