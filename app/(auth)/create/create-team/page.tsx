import type { Metadata } from 'next';
import CreateTeamForm from '@/features/auth/components/team-form';
import { withProtectedPage } from '@/lib/auth/with-page-guards';

export const metadata: Metadata = {
  title: 'Create Team',
  description: 'Create a new team to manage your players and playbook.',
  openGraph: {
    title: 'Create Team',
    description: 'Create a new team to manage your players and playbook.',
  },
};

async function CreateTeamPage() {
  return (
    <main className="max flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="flex h-screen w-full flex-row items-center justify-center border-2">
        <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-white px-4">
          <h2 className="font-righteous text-4xl tracking-wide text-neutral-400">
            My Team
          </h2>
          <CreateTeamForm />
        </div>
      </div>
    </main>
  );
}

export default withProtectedPage(CreateTeamPage);
