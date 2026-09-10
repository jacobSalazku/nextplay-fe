'use client';

import { useSyncExternalStore } from 'react';
import type { PlayDiagram } from '@/features/playbook/utils/diagram/types';
import { ArrowLeft, Printer } from 'lucide-react';
import { createPortal } from 'react-dom';
import { PhaseBlocks } from './phase-blocks';

const CATEGORY_LABEL: Record<string, string> = {
  OFFENSIVE: 'Offense',
  DEFENSIVE: 'Defense',
  SPECIAL: 'Special teams',
};

type Props = {
  playName: string;
  coachName: string;
  category: string;
  diagram: PlayDiagram;
  backHref: string;
};

function Paper({
  playName,
  coachName,
  category,
  diagram,
}: Omit<Props, 'backHref'>) {
  const date = new Date().toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const count = diagram.phases.length;

  return (
    <article className="mx-auto my-4 max-w-[210mm] bg-white p-[16mm] shadow-[0_8px_40px_rgba(0,0,0,0.14)] print:my-0 print:max-w-none print:p-0 print:shadow-none">
      <header className="mb-8">
        <p className="font-righteous text-[13px] tracking-[0.28em] text-[#1f2d4d] uppercase">
          NextPlay
        </p>
        <h1 className="font-righteous mt-1 text-[34px] leading-tight text-[#1f2d4d]">
          {playName}
        </h1>
        <p className="mt-1.5 text-[12.5px] text-[#736b57]">
          <span className="font-semibold text-[#1b1b1b]">{coachName}</span>
          {'  ·  '}
          {CATEGORY_LABEL[category] ?? category}
          {'  ·  '}
          {date}
        </p>
        <div className="relative mt-6 h-0.5 bg-[#1f2d4d]">
          <span className="absolute top-0 left-0 h-0.5 w-8 bg-[#f97316]" />
        </div>
      </header>

      <PhaseBlocks diagram={diagram} theme="paper" />

      <div className="mt-10 flex justify-between border-t border-[#e4dcc9] pt-3 text-[10px] text-[#736b57]">
        <span>NextPlay — {playName}</span>
        <span>
          {count} {count === 1 ? 'phase' : 'phases'}
        </span>
      </div>
    </article>
  );
}

export function PlaySheet({ backHref, ...props }: Props) {
  // Portalled to <body> so, when printing, it escapes the app shell's
  // h-screen / overflow-hidden and flows across pages. On screen it covers the
  // shell; the print stylesheet in globals.css hides everything but this.
  const onClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  if (!onClient) return null;

  return createPortal(
    <div
      data-play-sheet
      className="fixed inset-0 z-50 overflow-y-auto bg-[#f3f2ee] print:static print:overflow-visible print:bg-white"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-[#1f2d4d] px-4 py-2.5 text-sm text-white print:hidden">
        {/* plain anchor — the sheet is its own tab, a full load back is fine */}
        <a
          href={backHref}
          className="flex items-center gap-1.5 rounded px-2 py-1 hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to editor
        </a>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex cursor-pointer items-center gap-2 rounded-full bg-[#f97316] px-4 py-1.5 font-semibold hover:bg-[#fb8a3c]"
        >
          <Printer className="h-4 w-4" />
          Print / Save as PDF
        </button>
      </div>
      <Paper {...props} />
    </div>,
    document.body,
  );
}
