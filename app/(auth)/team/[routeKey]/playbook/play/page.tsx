import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExportMenu } from '@/features/playbook/components/editor/export-menu';
import { PlayPlayer } from '@/features/playbook/components/play/play-player';
import { PhaseBlocks } from '@/features/playbook/components/sheet/phase-blocks';
import PlanViewSkeleton from '@/features/playbook/components/skeleton/plan-view-skeleton';
import { getPlay } from '@/features/playbook/queries/play/get-play';
import { asPlayDiagram } from '@/features/playbook/utils/diagram/parse';
import { categoryLabel } from '@/features/playbook/utils/play-category-color';
import { autoNote } from '@/features/playbook/utils/sheet/auto-note';
import { playbookSearchParamsCache } from '@/utils/search-params';
import { Pencil } from 'lucide-react';
import { sanitizeRichText } from '@/lib/sanitize-rich-text';

type PageProps = {
  params: Promise<{ routeKey: string }>;
  searchParams: Promise<{ id: string }>;
};

export const metadata = {
  title: 'Play',
  description: 'View the details of a specific play.',
  openGraph: {
    title: 'Play',
    description: 'View the details of a specific play.',
  },
};

// navy hairline with an orange tick at the start — the coaching sheet's rule,
// carried onto the screen so the two surfaces read as one playbook
function Rule() {
  return (
    <div className="relative mt-6 h-px bg-[#2b3a5c]">
      <span className="absolute top-0 left-0 h-px w-10 bg-[#f97316]" />
    </div>
  );
}

async function PlayView({ params, searchParams }: PageProps) {
  const { routeKey } = await params;
  const { id } = await playbookSearchParamsCache.parse(searchParams);

  return (
    <Suspense fallback={<PlanViewSkeleton />}>
      <PlayContent id={id} routeKey={routeKey} />
    </Suspense>
  );
}

async function PlayContent({ id, routeKey }: { id: string; routeKey: string }) {
  const play = await getPlay(id, routeKey);
  if (!play) notFound();

  const diagram = asPlayDiagram(play.diagram);
  const description = sanitizeRichText(play.description);
  const editHref = `/team/${routeKey}/playbook/play/${play.id}/edit`;
  const updated = new Date(play.updatedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const phaseCount = diagram?.phases.length ?? 0;
  const heroMax = diagram?.court === 'full' ? 'max-w-[360px]' : 'max-w-[520px]';

  return (
    <div className="scrollbar-none h-screen overflow-y-auto">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <header>
          <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
            <div className="min-w-0">
              <p className="font-righteous text-[11px] tracking-[0.3em] text-[#f97316] uppercase">
                {categoryLabel(play.category)}
              </p>
              <h1 className="font-righteous mt-2 text-4xl leading-[1.05] text-white sm:text-[3.25rem]">
                {play.name}
              </h1>
              {diagram && (
                <p className="mt-2.5 text-sm text-[#8b93a7]">
                  {phaseCount} {phaseCount === 1 ? 'phase' : 'phases'}
                  <span className="mx-2 text-[#5f6b85]">·</span>
                  updated {updated}
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {diagram && (
                <ExportMenu
                  court={diagram.court}
                  phases={diagram.phases}
                  activeIndex={0}
                  playName={play.name}
                  routeKey={routeKey}
                  playId={play.id}
                />
              )}
              <Link
                href={editHref}
                className="flex items-center gap-2 rounded-md border border-white/15 px-3 py-1.5 text-sm text-gray-200 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
            </div>
          </div>
          <Rule />
        </header>

        {diagram ? (
          <>
            {description && (
              <div
                className="prose prose-sm prose-invert mt-6 max-w-prose text-[#c9cedd]"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}

            <section className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
              <div
                className={`w-full ${heroMax} shrink-0 bg-[#16213b] p-3 sm:p-4`}
              >
                <PlayPlayer court={diagram.court} phases={diagram.phases} />
              </div>

              <ol className="space-y-3 lg:flex-1 lg:pt-1">
                {diagram.phases.map((phase, i) => (
                  <li
                    key={phase.id}
                    className="flex gap-3 text-sm leading-relaxed"
                  >
                    <span className="font-righteous shrink-0 text-[#f97316] tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[#c9cedd]">
                      {autoNote(phase) || 'Players hold their spots'}
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            <div className="mt-16">
              <h2 className="font-righteous text-lg text-white">
                Phase by phase
              </h2>
              <Rule />
            </div>
            <PhaseBlocks diagram={diagram} theme="dark" />
          </>
        ) : (
          <div className="mt-10 flex flex-col items-start gap-4">
            {description && (
              <div
                className="prose prose-sm prose-invert max-w-prose text-[#c9cedd]"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
            <p className="text-sm text-[#8b93a7]">
              This play doesn&apos;t have a diagram yet.
            </p>
            <Link
              href={editHref}
              className="rounded-md bg-[#f97316] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#fb8a3c]"
            >
              Open the editor
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayView;
