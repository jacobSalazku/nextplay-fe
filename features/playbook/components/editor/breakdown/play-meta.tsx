'use client';

import { useState } from 'react';
import { cn } from '@/utils/tw-merge';
import { Category } from '@/graphql/graphql';

const CATEGORIES: { value: Category; label: string }[] = [
  { value: Category.Offensive, label: 'Offense' },
  { value: Category.Defensive, label: 'Defense' },
  { value: Category.Special, label: 'Special' },
];

// Play-level metadata on the Breakdown screen: title + category.
export function PlayMeta({
  name,
  category,
  onRename,
  onCategoryChange,
}: {
  name: string;
  category: Category;
  onRename: (name: string) => void;
  onCategoryChange: (category: Category) => void;
}) {
  const [draft, setDraft] = useState(name);

  const commit = () => {
    const next = draft.trim();
    if (next && next !== name) onRename(next);
    else setDraft(name);
  };

  return (
    <section className="space-y-4 rounded-xl border border-white/10 bg-slate-900/40 p-4">
      <label className="block space-y-1">
        <span className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
          Title
        </span>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.currentTarget.blur();
            if (event.key === 'Escape') setDraft(name);
          }}
          className="w-full rounded-lg bg-slate-800 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-orange-400"
        />
      </label>

      <fieldset className="space-y-1">
        <legend className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
          Category
        </legend>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={category === option.value}
              onClick={() => onCategoryChange(option.value)}
              className={cn(
                'cursor-pointer rounded-lg border px-4 py-2 text-sm transition',
                category === option.value
                  ? 'border-orange-300/50 bg-orange-500/15 text-white'
                  : 'border-white/10 bg-slate-900/60 text-gray-200 hover:border-orange-300/40',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>
    </section>
  );
}
