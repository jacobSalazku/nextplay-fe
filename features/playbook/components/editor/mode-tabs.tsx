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
  return (
    <div
      role="tablist"
      aria-label="Editor mode"
      className="flex rounded-lg border border-white/10 bg-slate-900 p-0.5"
    >
      {TABS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          role="tab"
          aria-selected={mode === value}
          onClick={() => onChange(value)}
          className={cn(
            'flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 text-sm transition',
            mode === value
              ? 'bg-slate-700 text-white'
              : 'text-gray-400 hover:text-white',
          )}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
}
