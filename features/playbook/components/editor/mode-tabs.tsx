'use client';

import { cn } from '@/utils/tw-merge';
import { MessageSquare, Pencil, Play } from 'lucide-react';

export type EditorMode = 'draw' | 'animate' | 'breakdown';

export const EDITOR_TABS: {
  value: EditorMode;
  label: string;
  icon: typeof Pencil;
}[] = [
  { value: 'draw', label: 'Draw', icon: Pencil },
  { value: 'animate', label: 'Animate', icon: Play },
  { value: 'breakdown', label: 'Breakdown', icon: MessageSquare },
];

// a hint of overshoot so the pill settles rather than stopping dead
const SPRING = 'cubic-bezier(0.34, 1.4, 0.64, 1)';

type ModeTabsProps = {
  mode: EditorMode;
  onChange: (mode: EditorMode) => void;
};

export function ModeTabs({ mode, onChange }: ModeTabsProps) {
  const activeIndex = EDITOR_TABS.findIndex((t) => t.value === mode);

  return (
    <div
      role="tablist"
      aria-label="Editor mode"
      className="relative grid w-[22rem] max-w-full shrink-0 grid-cols-3 rounded-full bg-[#e9dcc0] p-1 ring-1 ring-black/5"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-1 left-1 rounded-full bg-[#1f2d4d] shadow-sm transition-transform duration-300 motion-reduce:transition-none"
        style={{
          width: `calc((100% - 0.5rem) / ${EDITOR_TABS.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
          transitionTimingFunction: SPRING,
        }}
      />
      {EDITOR_TABS.map(({ value, label, icon: Icon }) => {
        const active = mode === value;
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(value)}
            className={cn(
              'relative z-10 flex cursor-pointer items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-medium outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1f2d4d]/40',
              active ? 'text-white' : 'text-[#8a7a5c] hover:text-[#1f2d4d]',
            )}
          >
            <Icon
              className={cn(
                'h-4 w-4 transition-transform duration-300 motion-reduce:transition-none',
                active && 'scale-105',
              )}
              style={{ transitionTimingFunction: SPRING }}
            />
            {label}
          </button>
        );
      })}
    </div>
  );
}
