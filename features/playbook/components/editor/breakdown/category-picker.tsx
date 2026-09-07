'use client';

import { cn } from '@/utils/tw-merge';
import { Category } from '@/graphql/graphql';

const CATEGORIES: { value: Category; label: string }[] = [
  { value: Category.Offensive, label: 'Offense' },
  { value: Category.Defensive, label: 'Defense' },
  { value: Category.Special, label: 'Special' },
];

type CategoryPickerProps = {
  value: Category;
  onChange: (category: Category) => void;
};

export function CategoryPicker({ value, onChange }: CategoryPickerProps) {
  return (
    <div
      role="group"
      aria-label="Category"
      className="flex shrink-0 rounded-lg border border-black/10 p-0.5 text-xs"
    >
      {CATEGORIES.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'cursor-pointer rounded-md px-2.5 py-1 font-medium transition',
            value === option.value
              ? 'bg-slate-800 text-white'
              : 'text-slate-500 hover:text-slate-900',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
