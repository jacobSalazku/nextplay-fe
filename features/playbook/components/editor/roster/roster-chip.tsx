import type { PlayObjectKind } from '@/features/playbook/utils/diagram/types';
import { cn } from '@/utils/tw-merge';

type RosterChipProps = {
  n: number;
  kind: PlayObjectKind;
  present: boolean;
  hasBall: boolean;
  selected: boolean;
  onToggle: () => void;
  onBall: () => void;
  onSelect: () => void;
};

export function RosterChip({
  n,
  kind,
  present,
  hasBall,
  selected,
  onToggle,
  onBall,
  onSelect,
}: RosterChipProps) {
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
          'flex aspect-square w-full cursor-pointer items-center justify-center rounded-lg border pt-0.5 text-lg font-bold transition',
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
        {!offense && (
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
        )}
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
