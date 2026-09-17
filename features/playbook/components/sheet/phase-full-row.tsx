import type { ThemeTokens } from '@/features/playbook/components/sheet/phase-block-theme';
import { PhaseCaption } from '@/features/playbook/components/sheet/phase-caption';
import { PhaseCourtCard } from '@/features/playbook/components/sheet/phase-court-card';
import type { PlayDiagram } from '@/features/playbook/utils/diagram/types';
import { autoNote } from '@/features/playbook/utils/sheet/auto-note';
import { cn } from '@/utils/tw-merge';
import { sanitizeRichText } from '@/lib/sanitize-rich-text';

export function PhaseFullRow({
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
      <PhaseCourtCard diagram={diagram} index={index} theme={theme} />
      {note ? (
        <div
          className={theme.notes}
          dangerouslySetInnerHTML={{ __html: note }}
        />
      ) : (
        <PhaseCaption
          text={autoNote(diagram.phases[index])}
          theme={theme}
          beside
        />
      )}
    </section>
  );
}
