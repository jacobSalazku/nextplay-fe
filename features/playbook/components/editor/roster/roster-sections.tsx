'use client';

import type {
  PlacedObject,
  PlayObjectKind,
} from '@/features/playbook/utils/diagram/types';
import { slotId } from '@/features/playbook/utils/editor/roster';
import { AddSlot } from './add-slot';
import { RosterChip } from './roster-chip';

export type RosterSectionsProps = {
  objects: PlacedObject[];
  rosterCount: Record<PlayObjectKind, number>;
  ballHolderId?: string;
  selectedId: string | null;
  onBench: (id: string) => void;
  onUnbench: (id: string) => void;
  onAddSlot: (kind: PlayObjectKind) => void;
  onSetBall: (id: string) => void;
  onSelect: (id: string) => void;
};

export function RosterSections({
  objects,
  rosterCount,
  ballHolderId,
  selectedId,
  onBench,
  onUnbench,
  onAddSlot,
  onSetBall,
  onSelect,
}: RosterSectionsProps) {
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

  const section = (title: string, kind: PlayObjectKind) => (
    <section>
      <h2 className="mb-3 border-b border-white/10 pb-2 text-sm font-bold tracking-wide text-white">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {slots(kind)}
        <AddSlot kind={kind} count={rosterCount[kind]} onAdd={onAddSlot} />
      </div>
    </section>
  );

  return (
    <>
      {section('Your team', 'offense')}
      {section('Opponent', 'defense')}
    </>
  );
}
