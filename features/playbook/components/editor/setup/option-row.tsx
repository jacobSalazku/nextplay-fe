import { cn } from '@/utils/tw-merge';

// A row of single-select pill buttons (court type on the setup screen).
export function OptionRow<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T | undefined;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'cursor-pointer rounded-lg border px-4 py-2 text-sm transition',
            value === option.value
              ? 'border-orange-300/50 bg-orange-500/15 text-white'
              : 'border-white/10 bg-slate-900/60 text-gray-200 hover:border-orange-300/40',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
