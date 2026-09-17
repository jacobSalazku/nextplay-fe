import { cn } from '@/utils/tw-merge';

export type Theme = 'paper' | 'dark';

export type ThemeTokens = {
  row: string;
  tag: string;
  frame: string;
  notes: string;
  caption: string;
  lead: string;
};

export const THEME: Record<Theme, ThemeTokens> = {
  paper: {
    row: 'border-[#e4dcc9]',
    tag: 'bg-[#1f2d4d] text-white',
    frame: 'border border-[#e4dcc9] bg-white',
    notes: cn(
      'prose prose-sm max-w-none text-[13px] text-[#1b1b1b]',
      '[&_h1]:text-[#1f2d4d] [&_h2]:text-[#1f2d4d] [&_h3]:text-[#1f2d4d]',
      '[&_mark]:bg-[#fdf1c4]',
    ),
    caption: 'text-[#3a3a3a]',
    lead: 'text-[#8a7a5c]',
  },
  dark: {
    row: 'border-white/10',
    tag: 'bg-[#1f2d4d] text-white',
    frame: 'border border-white/10 bg-[#16213b] p-1.5',
    notes: cn(
      'prose prose-sm prose-invert max-w-none text-sm text-[#c9cedd]',
      '[&_h1]:text-white [&_h2]:text-white [&_h3]:text-white',
      '[&_mark]:bg-amber-200/80 [&_mark]:text-black',
    ),
    caption: 'text-[#8b93a7]',
    lead: 'text-[#5f6b85]',
  },
};
