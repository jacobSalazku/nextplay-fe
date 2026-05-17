import { Suspense } from 'react';
import { withProtectedPage } from '@/lib/auth/with-page-guards';

async function StatisticsPage() {
  return (
    <div className="scrollbar-none overflow-y-auto">
      <Suspense>Stats</Suspense>
    </div>
  );
}
export default withProtectedPage(StatisticsPage);
