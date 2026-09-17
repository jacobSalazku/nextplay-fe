import {
  THEME,
  type Theme,
} from '@/features/playbook/components/sheet/phase-block-theme';
import { PhaseCaption } from '@/features/playbook/components/sheet/phase-caption';
import { PhaseCourtCard } from '@/features/playbook/components/sheet/phase-court-card';
import { PhaseFullRow } from '@/features/playbook/components/sheet/phase-full-row';
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

  // on screen, a fixed two-column grid has no room to shrink the court below
  // lg — the desktop sidebar eats enough width that sm/md are still cramped
  // (same breakpoint the hero right above already switches on)
  const fullCols =
    name === 'paper'
      ? 'grid-cols-[38%_1fr]'
      : diagram.court === 'full'
        ? 'grid-cols-1 lg:grid-cols-[minmax(0,10rem)_1fr]'
        : 'grid-cols-1 lg:grid-cols-[minmax(0,16rem)_1fr]';

  // the court itself is capped too, at roughly half its old size — otherwise
  // a stacked (<lg) row lets it balloon to the row's full width
  const courtMaxWidth =
    name === 'paper'
      ? undefined
      : diagram.court === 'full'
        ? 'max-w-[10rem]'
        : 'max-w-[16rem]';

  return (
    <div className="flex flex-col">
      {blocks.map((block, i) =>
        block.kind === 'full' ? (
          <PhaseFullRow
            key={`f${block.index}`}
            diagram={diagram}
            index={block.index}
            theme={theme}
            cols={fullCols}
            courtMaxWidth={courtMaxWidth}
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
                <PhaseCourtCard diagram={diagram} index={index} theme={theme} />
                <PhaseCaption
                  text={autoNote(diagram.phases[index])}
                  theme={theme}
                />
              </div>
            ))}
          </section>
        ),
      )}
    </div>
  );
}
