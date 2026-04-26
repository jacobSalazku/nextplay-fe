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
  params: Promise<{ teamRef: string }>;
}) {
  const { teamRef } = await params;
  return (
    <Suspense fallback={<ScheduleSkeleton />}>
      <ScheduleBlock teamRef={teamRef} />
    </Suspense>
  );
}
export default withProtectedPage(SchedulePage);
