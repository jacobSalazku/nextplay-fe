import type { PlayObjectKind } from '@/features/playbook/utils/diagram/types';
import { cn } from '@/utils/tw-merge';
import { Eyebrows } from './eyebrows';

// One roster slot: a toggle for on/off the court, with a ball button for
// on-court offense players.
export function RosterChip({
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
          'flex aspect-square w-full cursor-pointer items-center justify-center rounded-lg border pt-1 text-lg font-bold transition',
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
            'absolute -top-1 -right-1 h-4 w-4 cursor-pointer rounded-full border border-slate-900 transition',
            hasBall ? 'bg-orange-500' : 'bg-white/70 hover:bg-white',
          )}
        />
      )}
    </div>
  );
}
