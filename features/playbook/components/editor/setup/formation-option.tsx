import { CourtDiagram } from '@/features/playbook/components/diagram/court-diagram';
import type {
  CourtType,
  PlacedObject,
} from '@/features/playbook/utils/diagram/types';
import { cn } from '@/utils/tw-merge';

// A pickable formation card with a live court preview.
export function FormationOption({
  name,
  court,
  objects = [],
  selected,
  onSelect,
}: {
  name: string;
  court: CourtType;
  objects?: PlacedObject[];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'flex cursor-pointer flex-col gap-2 rounded-xl border p-2 text-left transition',
        selected
          ? 'border-orange-300/60 bg-orange-500/10'
          : 'border-white/10 bg-slate-900/60 hover:border-orange-300/40',
      )}
    >
      <CourtDiagram
        court={court}
        phase={{ id: 'preview', objects, actions: [] }}
        className="w-full rounded-lg"
      />
      <span className="text-xs font-medium text-gray-200">{name}</span>
    </button>
  );
}
