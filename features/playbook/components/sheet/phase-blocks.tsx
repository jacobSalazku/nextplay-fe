import { CourtDiagram } from '@/features/playbook/components/diagram/court-diagram';
import type { PlayDiagram } from '@/features/playbook/utils/diagram/types';
import { autoNote } from '@/features/playbook/utils/sheet/auto-note';
import { cn } from '@/utils/tw-merge';
import { sanitizeRichText } from '@/lib/sanitize-rich-text';

// On paper: a written-note phase gets a full-width row (court + prose), the
// rest pack two courts to a row to save space.
type Block =
  | { kind: 'full'; index: number }
  | { kind: 'pair'; indices: number[] };

function packedBlocks(diagram: PlayDiagram): Block[] {
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

type ThemeTokens = {
  row: string;
  tag: string;
  frame: string;
  notes: string;
  caption: string;
  lead: string;
};

const THEME: Record<Theme, ThemeTokens> = {
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

function Court({
  diagram,
  index,
  theme,
}: {
  diagram: PlayDiagram;
  index: number;
  theme: ThemeTokens;
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
  beside = false,
}: {
  text: string;
  theme: ThemeTokens;
  beside?: boolean;
}) {
  const [lead, rest] = text
    ? (['Movement', text] as const)
    : (['Reset', 'players hold their spots'] as const);
  return (
    <p
      className={cn(
        'leading-relaxed',
        beside ? 'text-[15px]' : 'mt-2 text-[11px]',
        theme.caption,
      )}
    >
      <span
        className={cn(
          'font-mono font-bold tracking-wider uppercase',
          beside ? 'text-[9px]' : 'text-[8px]',
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

  // paper packs movement-only phases two to a row to save paper; on screen every
  // phase gets its own full-size court with the movement/notes beside it
  const blocks: Block[] =
    name === 'paper'
      ? packedBlocks(diagram)
      : diagram.phases.map((_, index) => ({ kind: 'full', index }));

  const fullCols =
    name === 'paper'
      ? 'grid-cols-[38%_1fr]'
      : diagram.court === 'full'
        ? 'grid-cols-[minmax(0,20rem)_1fr]'
        : 'grid-cols-[minmax(0,32rem)_1fr]';

  return (
    <div className="flex flex-col">
      {blocks.map((block, i) =>
        block.kind === 'full' ? (
          <FullRow
            key={`f${block.index}`}
            diagram={diagram}
            index={block.index}
            theme={theme}
            cols={fullCols}
            divided={i > 0}
          />
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

// A full-size court with its text beside it: the coach's notes if there are
// any, otherwise the auto-described movement (which top-aligns with a long
// note but centres against a one-line caption).
function FullRow({
  diagram,
  index,
  theme,
  cols,
  divided,
}: {
  diagram: PlayDiagram;
  index: number;
  theme: ThemeTokens;
  cols: string;
  divided: boolean;
}) {
  // sanitised on write (BE) and again here, like the play view page
  const note = sanitizeRichText(diagram.phases[index].note);
  return (
    <section
      className={cn(
        'grid gap-8 py-6',
        cols,
        note ? 'items-start' : 'items-center',
        divided && cn('border-t', theme.row),
      )}
      style={{ breakInside: 'avoid' }}
    >
      <Court diagram={diagram} index={index} theme={theme} />
      {note ? (
        <div
          className={theme.notes}
          dangerouslySetInnerHTML={{ __html: note }}
        />
      ) : (
        <Caption text={autoNote(diagram.phases[index])} theme={theme} beside />
      )}
    </section>
  );
}
