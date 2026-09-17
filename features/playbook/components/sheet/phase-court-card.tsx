import { CourtDiagram } from '@/features/playbook/components/diagram/court-diagram';
import type { ThemeTokens } from '@/features/playbook/components/sheet/phase-block-theme';
import type { PlayDiagram } from '@/features/playbook/utils/diagram/types';
import { cn } from '@/utils/tw-merge';

export function PhaseCourtCard({
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
