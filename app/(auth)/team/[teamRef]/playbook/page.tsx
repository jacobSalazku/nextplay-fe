import { Suspense } from 'react';
import type { Metadata } from 'next';
import { withProtectedPage } from '@/lib/auth/with-page-guards';

export const metadata: Metadata = {
  title: 'Playbook Library',
  description:
    "Manage your team's playbook, game plans, and practice preparations.",
  openGraph: {
    title: 'Playbook Library',
    description:
      "Manage your team's playbook, game plans, and practice preparations.",
  },
};

async function PlaybookPage() {
  return <Suspense>Playbook</Suspense>;
}

export default withProtectedPage(PlaybookPage);
