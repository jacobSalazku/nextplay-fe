import { cn } from '@/utils/tw-merge';

export const PlayerDetailItem = ({
  label,
  value,
  className,
}: {
  label: string;
  value: string | number | null | undefined;
  className?: string;
}) => (
  <div
    className={cn(
      'rounded-2xl border border-white/10 bg-white/3 p-4 shadow-sm backdrop-blur-sm',
      className,
    )}
  >
    <span className="text-xs font-semibold tracking-[0.16em] text-orange-300/70 uppercase">
      {label}
    </span>
    <span className="mt-2 block text-base text-white/90">
      {value !== null && value !== undefined && value !== '' ? value : '—'}
    </span>
  </div>
);
