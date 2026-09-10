'use client';

import { useSyncExternalStore } from 'react';
import { CourtDiagram } from '@/features/playbook/components/diagram/court-diagram';
import type {
  CourtType,
  PlayDiagram,
} from '@/features/playbook/utils/diagram/types';
import { autoNote } from '@/features/playbook/utils/sheet/auto-note';
import { cn } from '@/utils/tw-merge';
import { ArrowLeft, Printer } from 'lucide-react';
import { createPortal } from 'react-dom';
import { sanitizeRichText } from '@/lib/sanitize-rich-text';

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

// A phase the coach wrote notes for gets a full-width row; phases with only
// auto-described movement pack two to a row so the page isn't half empty.
type Block =
  | { kind: 'full'; index: number }
  | { kind: 'pair'; indices: number[] };

function toBlocks(diagram: PlayDiagram): Block[] {
  const blocks: Block[] = [];
  let pair: number[] = [];
  const flush = () => {
    if (pair.length) blocks.push({ kind: 'pair', indices: pair });
    pair = [];
  };
  diagram.phases.forEach((phase, index) => {
    if (sanitizeRichText(phase.note)) {
      flush();
      blocks.push({ kind: 'full', index });
    } else {
      pair.push(index);
      if (pair.length === 2) flush();
    }
  });
  flush();
  return blocks;
}

function Court({
  court,
  diagram,
  index,
}: {
  court: CourtType;
  diagram: PlayDiagram;
  index: number;
}) {
  const phase = diagram.phases[index];
  return (
    <div>
      <span className="mb-1.5 inline-block rounded bg-[#1f2d4d] px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase">
        Phase {index + 1}
      </span>
      <div className="border border-[#e4dcc9] bg-white p-1">
        <CourtDiagram
          court={court}
          phase={phase}
          ballHolderId={phase.ballHolderId}
          className="block w-full"
        />
      </div>
    </div>
  );
}

function Caption({ text }: { text: string }) {
  const [lead, rest] = text
    ? (['Movement', text] as const)
    : (['Reset', 'players hold their spots'] as const);
  return (
    <p className="mt-1.5 text-[11px] leading-relaxed text-[#3a3a3a]">
      <span className="font-mono text-[8px] font-bold tracking-wider text-[#8a7a5c] uppercase">
        {lead}
      </span>{' '}
      {rest}
    </p>
  );
}

function Notes({ html }: { html: string }) {
  return (
    <div
      className={cn(
        'prose prose-sm max-w-none text-[13px] text-[#1b1b1b]',
        '[&_h1]:mt-0 [&_h1]:mb-1 [&_h1]:text-[15px] [&_h1]:text-[#1f2d4d]',
        '[&_h2]:mt-0 [&_h2]:mb-1 [&_h2]:text-[14px] [&_h2]:text-[#1f2d4d]',
        '[&_h3]:mt-0 [&_h3]:mb-1 [&_h3]:text-[13px] [&_h3]:text-[#1f2d4d]',
        '[&_p]:my-1.5 [&_ul]:my-1.5 [&_ol]:my-1.5 [&_li]:my-0.5',
        '[&_mark]:bg-[#fdf1c4] [&_mark]:px-0.5',
      )}
      // sanitised on write (BE) and again here, same as the play view page
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

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
  const blocks = toBlocks(diagram);

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

      <div className="flex flex-col">
        {blocks.map((block, i) =>
          block.kind === 'full' ? (
            <section
              key={`f${block.index}`}
              className={cn(
                'grid grid-cols-[38%_1fr] items-start gap-8 py-6',
                i > 0 && 'border-t border-[#e4dcc9]',
              )}
              style={{ breakInside: 'avoid' }}
            >
              <Court
                court={diagram.court}
                diagram={diagram}
                index={block.index}
              />
              <Notes
                html={sanitizeRichText(diagram.phases[block.index].note)}
              />
            </section>
          ) : (
            <section
              key={`p${block.indices.join('-')}`}
              className={cn(
                'grid grid-cols-2 items-start gap-8 py-6',
                i > 0 && 'border-t border-[#e4dcc9]',
              )}
              style={{ breakInside: 'avoid' }}
            >
              {block.indices.map((index) => (
                <div key={diagram.phases[index].id}>
                  <Court
                    court={diagram.court}
                    diagram={diagram}
                    index={index}
                  />
                  <Caption text={autoNote(diagram.phases[index])} />
                </div>
              ))}
            </section>
          ),
        )}
      </div>

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
