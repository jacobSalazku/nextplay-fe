import { CourtDiagram } from '@/features/playbook/components/diagram/court-diagram';
import type { PlayDiagram } from '@/features/playbook/utils/diagram/types';
import { autoNote } from '@/features/playbook/utils/sheet/auto-note';
import { cn } from '@/utils/tw-merge';
import { sanitizeRichText } from '@/lib/sanitize-rich-text';

// A phase the coach wrote notes for gets a full-width row (court + prose);
// phases with only auto-described movement pack two to a row.
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

type Theme = 'paper' | 'dark';

const THEME: Record<
  Theme,
  {
    row: string;
    tag: string;
    frame: string;
    notes: string;
    caption: string;
    lead: string;
  }
> = {
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
    tag: 'bg-white/10 text-white',
    frame: 'rounded-lg border border-white/10 bg-white/[0.03] p-1',
    notes: cn(
      'prose prose-sm prose-invert max-w-none text-[13px] text-gray-200',
      '[&_h1]:text-white [&_h2]:text-white [&_h3]:text-white',
      '[&_mark]:bg-amber-200/80 [&_mark]:text-black',
    ),
    caption: 'text-gray-400',
    lead: 'text-gray-500',
  },
};

function Court({
  diagram,
  index,
  theme,
}: {
  diagram: PlayDiagram;
  index: number;
  theme: (typeof THEME)[Theme];
}) {
  const phase = diagram.phases[index];
  return (
    <div>
      <span
        className={cn(
          'mb-1.5 inline-block rounded px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase',
          theme.tag,
        )}
      >
        Phase {index + 1}
      </span>
      <div className={theme.frame}>
        <CourtDiagram
          court={diagram.court}
          phase={phase}
          ballHolderId={phase.ballHolderId}
          className="block w-full"
        />
      </div>
    </div>
  );
}

function Caption({
  text,
  theme,
}: {
  text: string;
  theme: (typeof THEME)[Theme];
}) {
  const [lead, rest] = text
    ? (['Movement', text] as const)
    : (['Reset', 'players hold their spots'] as const);
  return (
    <p className={cn('mt-2 text-[11px] leading-relaxed', theme.caption)}>
      <span
        className={cn(
          'font-mono text-[8px] font-bold tracking-wider uppercase',
          theme.lead,
        )}
      >
        {lead}
      </span>{' '}
      {rest}
    </p>
  );
}

export function PhaseBlocks({
  diagram,
  theme: name = 'paper',
}: {
  diagram: PlayDiagram;
  theme?: Theme;
}) {
  const theme = THEME[name];

  return (
    <div className="flex flex-col">
      {toBlocks(diagram).map((block, i) =>
        block.kind === 'full' ? (
          <section
            key={`f${block.index}`}
            className={cn(
              'grid grid-cols-[38%_1fr] items-start gap-8 py-6',
              i > 0 && cn('border-t', theme.row),
            )}
            style={{ breakInside: 'avoid' }}
          >
            <Court diagram={diagram} index={block.index} theme={theme} />
            <div
              className={theme.notes}
              // sanitised on write (BE) and again here, like the play view page
              dangerouslySetInnerHTML={{
                __html: sanitizeRichText(diagram.phases[block.index].note),
              }}
            />
          </section>
        ) : (
          <section
            key={`p${block.indices.join('-')}`}
            className={cn(
              'grid grid-cols-2 items-start gap-8 py-6',
              i > 0 && cn('border-t', theme.row),
            )}
            style={{ breakInside: 'avoid' }}
          >
            {block.indices.map((index) => (
              <div key={diagram.phases[index].id}>
                <Court diagram={diagram} index={index} theme={theme} />
                <Caption text={autoNote(diagram.phases[index])} theme={theme} />
              </div>
            ))}
          </section>
        ),
      )}
    </div>
  );
}
