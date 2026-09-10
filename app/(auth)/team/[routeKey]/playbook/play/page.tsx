import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExportMenu } from '@/features/playbook/components/editor/export-menu';
import { PlayPlayer } from '@/features/playbook/components/play/play-player';
import { PhaseBlocks } from '@/features/playbook/components/sheet/phase-blocks';
import PlanViewSkeleton from '@/features/playbook/components/skeleton/plan-view-skeleton';
import { getPlay } from '@/features/playbook/queries/play/get-play';
import { asPlayDiagram } from '@/features/playbook/utils/diagram/parse';
import { getCategoryColor } from '@/features/playbook/utils/play-category-color';
import { playbookSearchParamsCache } from '@/utils/search-params';
import { cn } from '@/utils/tw-merge';
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

const CATEGORY_LABEL: Record<string, string> = {
  OFFENSIVE: 'Offense',
  DEFENSIVE: 'Defense',
  SPECIAL: 'Special teams',
};

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

  return (
    <div className="scrollbar-none h-screen overflow-y-auto">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        {/* masthead */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <span
              className={cn(
                'inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase',
                getCategoryColor(play.category),
              )}
            >
              {CATEGORY_LABEL[play.category] ?? play.category}
            </span>
            <h1 className="font-righteous mt-2 text-4xl leading-tight font-bold text-white sm:text-5xl">
              {play.name}
            </h1>
            {diagram && (
              <p className="mt-1.5 text-sm text-gray-400">
                {diagram.phases.length}{' '}
                {diagram.phases.length === 1 ? 'phase' : 'phases'}
                {'  ·  updated '}
                {updated}
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

        {description && (
          <div
            className="prose prose-sm prose-invert mt-5 max-w-2xl text-gray-300"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}

        {diagram ? (
          <>
            {/* the play, running */}
            <div className="relative mt-8">
              <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.12),transparent_60%)]" />
              <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
                <PlayPlayer court={diagram.court} phases={diagram.phases} />
              </div>
            </div>

            {/* phase by phase */}
            <div className="mt-14 flex items-center gap-3">
              <h2 className="font-righteous text-lg text-white">
                Phase by phase
              </h2>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <PhaseBlocks diagram={diagram} theme="dark" />
          </>
        ) : (
          <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-white/15 p-10 text-center">
            <p className="text-sm text-gray-400">
              This play doesn&apos;t have a diagram yet.
            </p>
            <Link
              href={editHref}
              className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-400"
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
