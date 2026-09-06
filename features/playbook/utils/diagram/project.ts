import { COURT_VIEWBOX } from '@/features/playbook/components/diagram/court';
import type { CourtType, Phase, Point } from './types';

// Stored coords are 0..100 on both axes. The court viewBox is 100 wide but
// shorter (84 half / 168 full), so y (and any y-bearing offset) scales into
// that height.
export const courtScaleY = (court: CourtType) => COURT_VIEWBOX[court].h / 100;

export function projectPhase(phase: Phase, court: CourtType): Phase {
  const sy = courtScaleY(court);
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
