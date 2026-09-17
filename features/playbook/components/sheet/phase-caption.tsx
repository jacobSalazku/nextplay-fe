import type { ThemeTokens } from '@/features/playbook/components/sheet/phase-block-theme';
import { cn } from '@/utils/tw-merge';

export function PhaseCaption({
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
