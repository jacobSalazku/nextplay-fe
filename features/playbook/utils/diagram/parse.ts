import type { PlayDiagram } from './types';

// Shallow shape check — enough to pick "render/edit the diagram" over the
// legacy canvas image. The backend Zod schema owns full validation on write,
// so anything persisted is already structurally sound.
export function asPlayDiagram(value: unknown): PlayDiagram | null {
  if (!value || typeof value !== 'object') return null;

  const d = value as Partial<PlayDiagram>;
  const courtOk = d.court === 'half' || d.court === 'full';
  const phasesOk = Array.isArray(d.phases) && d.phases.length > 0;

  return d.version === 1 && courtOk && phasesOk ? (d as PlayDiagram) : null;
}
