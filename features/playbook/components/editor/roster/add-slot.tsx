import type { PlayObjectKind } from '@/features/playbook/utils/diagram/types';
import { MAX_PER_SIDE } from '@/features/playbook/utils/editor/roster';
import { Plus } from 'lucide-react';

// The dashed "+" that adds another roster slot for a side.
export function AddSlot({
  kind,
  count,
  onAdd,
}: {
  kind: PlayObjectKind;
  count: number;
  onAdd: (kind: PlayObjectKind) => void;
}) {
  if (count >= MAX_PER_SIDE) return null;
  return (
    <button
      type="button"
      aria-label={`Add ${kind === 'offense' ? 'player' : 'opponent'}`}
      onClick={() => onAdd(kind)}
      className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border border-dashed border-white/15 text-gray-500 hover:border-white/30 hover:text-gray-300"
    >
      <Plus className="h-4 w-4" />
    </button>
  );
}
