import type { Phase } from '@/features/playbook/utils/diagram/types';

// When the coach didn't write step notes, describe the phase from its drawn
// actions so the sheet still says something.
export function autoNote(phase: Phase): string {
  if (phase.actions.length === 0) return '';

  const label = (id?: string | null) =>
    phase.objects.find((o) => o.id === id)?.label ?? '?';

  const phrase = (a: Phase['actions'][number]): string => {
    const who = label(a.fromId);
    switch (a.type) {
      case 'pass':
        return a.toId ? `${who} passes to ${label(a.toId)}` : `${who} passes`;
      case 'handoff':
        return a.toId
          ? `${who} hands off to ${label(a.toId)}`
          : `${who} hands off`;
      case 'screen':
        return a.toId
          ? `${who} screens for ${label(a.toId)}`
          : `${who} screens`;
      case 'dribble':
        return `${who} dribbles`;
      case 'cut':
        return `${who} cuts`;
      case 'shot':
        return `${who} shoots`;
    }
  };

  return phase.actions.map(phrase).join('   ·   ');
}
