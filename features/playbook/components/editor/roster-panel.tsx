'use client';

import type {
  PlacedObject,
  PlayObjectKind,
} from '@/features/playbook/utils/diagram/types';
import { slotId } from '@/features/playbook/utils/editor/roster';
import { AddSlot } from './roster/add-slot';
import { RosterChip } from './roster/roster-chip';

type Props = {
  objects: PlacedObject[];
  rosterCount: Record<PlayObjectKind, number>;
  ballHolderId?: string;
  selectedId: string | null;
  onBench: (id: string) => void;
  onUnbench: (id: string) => void;
  onAddSlot: (kind: PlayObjectKind) => void;
  onMatchManToMan: () => void;
  onSetBall: (id: string) => void;
  onSelect: (id: string) => void;
};

export function RosterPanel({
  objects,
  rosterCount,
  ballHolderId,
  selectedId,
  onBench,
  onUnbench,
  onAddSlot,
  onMatchManToMan,
  onSetBall,
  onSelect,
}: Props) {
  const onCourt = new Set(objects.map((o) => o.id));

  const slots = (kind: PlayObjectKind) =>
    Array.from({ length: rosterCount[kind] }, (_, i) => {
      const id = slotId(kind, i + 1);
      const present = onCourt.has(id);
      return (
        <RosterChip
          key={id}
          n={i + 1}
          kind={kind}
          present={present}
          hasBall={ballHolderId === id}
          selected={selectedId === id}
          onToggle={() => (present ? onBench(id) : onUnbench(id))}
          onBall={() => onSetBall(id)}
          onSelect={() => onSelect(id)}
        />
      );
    });

  return (
    <aside
      aria-label="Roster"
      className="w-full shrink-0 space-y-5 overflow-y-auto rounded-xl border border-white/10 bg-slate-900/60 p-3 lg:w-52"
    >
      <section className="space-y-2">
        <h2 className="text-xs font-semibold tracking-wide text-gray-300 uppercase">
          Your team
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {slots('offense')}
          <AddSlot
            kind="offense"
            count={rosterCount.offense}
            onAdd={onAddSlot}
          />
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold tracking-wide text-gray-300 uppercase">
            Opponent
          </h2>
          <button
            type="button"
            onClick={onMatchManToMan}
            className="cursor-pointer text-[11px] font-medium text-orange-300 hover:text-orange-200"
          >
            Match man-to-man
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {slots('defense')}
          <AddSlot
            kind="defense"
            count={rosterCount.defense}
            onAdd={onAddSlot}
          />
        </div>
      </section>
    </aside>
  );
}
