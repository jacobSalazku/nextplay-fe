'use client';

import { EDITOR_TABS, type EditorMode } from '../mode-tabs';
import { cn } from '@/utils/tw-merge';

type Props = {
  mode: EditorMode;
  onChange: (mode: EditorMode) => void;
};

export function BottomTabBar({ mode, onChange }: Props) {
  return (
    <nav
      role="tablist"
      aria-label="Editor mode"
      className="grid shrink-0 grid-cols-3 border-t border-[#e0d5bb] bg-[#faf6ec] pb-[env(safe-area-inset-bottom)] text-[#1f2d4d]"
    >
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
              'flex cursor-pointer flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors',
              active ? 'text-[#1f2d4d]' : 'text-[#a89372] hover:text-[#1f2d4d]',
            )}
          >
            <Icon className={cn('h-5 w-5', active && 'scale-105')} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
