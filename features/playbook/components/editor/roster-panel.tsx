'use client';

import type {
  PlacedObject,
  PlayObjectKind,
} from '@/features/playbook/utils/diagram/types';
import { MAX_PER_SIDE, slotId } from '@/features/playbook/utils/editor/roster';
import { cn } from '@/utils/tw-merge';
import { Plus } from 'lucide-react';

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
        <Chip
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
      className="w-full shrink-0 space-y-6 overflow-y-auto rounded-xl border border-white/10 bg-slate-900/60 p-4 lg:w-64"
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
            className="text-[11px] font-medium text-orange-300 hover:text-orange-200"
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

function AddSlot({
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
      className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-white/15 text-gray-500 hover:border-white/30 hover:text-gray-300"
    >
      <Plus className="h-4 w-4" />
    </button>
  );
}

function Chip({
  n,
  kind,
  present,
  hasBall,
  selected,
  onToggle,
  onBall,
  onSelect,
}: {
  n: number;
  kind: PlayObjectKind;
  present: boolean;
  hasBall: boolean;
  selected: boolean;
  onToggle: () => void;
  onBall: () => void;
  onSelect: () => void;
}) {
  const offense = kind === 'offense';

  return (
    <div className="relative">
      <button
        type="button"
        aria-pressed={present}
        aria-label={`${offense ? 'Player' : 'Opponent'} ${n}, ${present ? 'on court' : 'benched'}`}
        onClick={() => {
          if (present) onSelect();
          onToggle();
        }}
        className={cn(
          'flex aspect-square w-full items-center justify-center rounded-lg border pt-1 text-lg font-bold transition',
          present && offense && 'border-slate-500 bg-slate-700 text-white',
          present && !offense && 'border-red-400 bg-red-600 text-white',
          !present &&
            offense &&
            'border-white/10 bg-slate-900/40 text-gray-600',
          !present &&
            !offense &&
            'border-red-400/25 bg-transparent text-red-300/40',
          selected && 'ring-2 ring-orange-400',
        )}
      >
        {!offense && <Eyebrows />}
        {n}
      </button>

      {offense && present && (
        <button
          type="button"
          aria-label={
            hasBall ? `Take the ball from ${n}` : `Give the ball to ${n}`
          }
          onClick={onBall}
          className={cn(
            'absolute -top-1 -right-1 h-4 w-4 rounded-full border border-slate-900 transition',
            hasBall ? 'bg-orange-500' : 'bg-white/70 hover:bg-white',
          )}
        />
      )}
    </div>
  );
}

function Eyebrows() {
  return (
    <svg
      viewBox="-10 -8 20 8"
      className="pointer-events-none absolute top-1.5 h-2 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
    >
      <path d="M-8 -1 Q-5 -5 -2 -2" />
      <path d="M8 -1 Q5 -5 2 -2" />
    </svg>
  );
}
