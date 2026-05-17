import { Suspense } from 'react';
import { Metadata } from 'next';
import { ScheduleBlock } from '@/features/schedule';
import { withProtectedPage } from '@/lib/auth/with-page-guards';
import { ScheduleSkeleton } from '@/components/skeleton/schedule-skeleton';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_BASE_URL ?? ''),
  title: 'Schedule ',
  description: "Schedule your team's activities and view their statistics.",
  openGraph: {
    title: 'Schedule',
    description: "Schedule your team's activities and view their statistics.",
  },
};

async function SchedulePage({
  params,
}: {
  params: Promise<{ routeKey: string }>;
}) {
  const { routeKey } = await params;
  return (
    <Suspense fallback={<ScheduleSkeleton />}>
      <ScheduleBlock routeKey={routeKey} />
    </Suspense>
  );
}
export default withProtectedPage(SchedulePage);
