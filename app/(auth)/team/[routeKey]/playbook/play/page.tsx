import { Suspense } from 'react';
import Image from 'next/image';
import PlanViewSkeleton from '@/features/playbook/components/skeleton/plan-view-skeleton';
import { getPlay } from '@/features/playbook/queries/get-play';
import { playbookSearchParamsCache } from '@/utils/search-params';
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

  if (!play) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-white">
        <h1 className="text-2xl font-bold">Play is not available</h1>
      </div>
    );
  }

  return (
    <div className="scrollbar-none h-screen overflow-y-auto px-4 pt-10">
      <div className="mx-auto max-w-7xl md:px-4">
        <h1 className="font-righteous mb-4 text-3xl font-bold text-white">
          Play
        </h1>

        <div className="flex flex-col p-0 sm:flex-row sm:items-start md:gap-8">
          <div
            className="prose prose-invert prose-h1:text-2xl prose-ul:py-0 prose-li:py-0 prose-strong:font-extrabold prose-h2:text-lg max-w-none text-white"
            dangerouslySetInnerHTML={{
              __html: sanitizeRichText(play.description),
            }}
          />
          <div className="mb-4 shrink-0 sm:mr-6 sm:mb-0 sm:w-2/5">
            <Image
              src={play?.canvas}
              alt={play.name}
              className="h-auto w-full rounded-xl border-2 object-cover"
              width={600}
              height={600}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayView;
