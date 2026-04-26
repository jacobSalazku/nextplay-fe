import { Metadata } from 'next';
import { withProtectedPage } from '@/lib/auth/with-page-guards';

export const metadata: Metadata = {
  title: 'Players',
  description: "View and manage your team's players.",
  openGraph: {
    title: 'Players',
    description: "View and manage your team's players.",
  },
};

async function PlayerPage() {
  return (
    <div className="flex min-h-screen flex-col items-center overflow-auto text-white">
      players
    </div>
  );
}
export default withProtectedPage(PlayerPage);
