'use client';

import { cn } from '@/utils/tw-merge';
import { MessageSquare, Pencil, Play } from 'lucide-react';

export type EditorMode = 'draw' | 'animate' | 'breakdown';

const TABS: { value: EditorMode; label: string; icon: typeof Pencil }[] = [
  { value: 'draw', label: 'Draw', icon: Pencil },
  { value: 'animate', label: 'Animate', icon: Play },
  { value: 'breakdown', label: 'Breakdown', icon: MessageSquare },
];

type ModeTabsProps = {
  mode: EditorMode;
  onChange: (mode: EditorMode) => void;
};

export function ModeTabs({ mode, onChange }: ModeTabsProps) {
  const activeIndex = TABS.findIndex((t) => t.value === mode);

  return (
    <div
      role="tablist"
      aria-label="Editor mode"
      className="relative flex w-[22rem] max-w-full shrink-0 rounded-xl border border-white/10 bg-slate-900 p-1"
    >
      <span
        aria-hidden
        className="absolute inset-y-1 left-1 rounded-lg bg-slate-700 shadow transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        style={{
          width: `calc((100% - 0.5rem) / ${TABS.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {TABS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          role="tab"
          aria-selected={mode === value}
          onClick={() => onChange(value)}
          className={cn(
            'relative z-10 flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-colors',
            mode === value ? 'text-white' : 'text-gray-400 hover:text-white',
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
