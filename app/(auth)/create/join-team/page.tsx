import type { Metadata } from 'next';
import Link from 'next/link';
import { withCreateFlowPage } from '@/lib/auth/with-page-guards';

export const metadata: Metadata = {
  title: 'Join Team',
  description: 'Join an existing team through a coach invite link.',
  openGraph: {
    title: 'Join Team',
    description: 'Join an existing team through a coach invite link.',
  },
};

async function JoinTeamPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-white">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950/85 p-6 text-center shadow-2xl shadow-black/40">
        <p className="text-xs font-black tracking-[0.24em] text-orange-300 uppercase">
          Invite required
        </p>
        <h1 className="font-righteous mt-3 text-3xl tracking-wide text-white">
          Ask your coach for an invite link
        </h1>
        <p className="mt-3 text-sm leading-6 text-white/60">
          Joining with a team code is no longer available. Coaches now add
          players through single-use invite links, so every new member is
          approved before they enter the team.
        </p>
        <Link
          href="/club"
          className="mt-6 inline-flex rounded-full border border-orange-300/30 bg-orange-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-orange-300"
        >
          Back to teams
        </Link>
      </div>
    </main>
  );
}
export default withCreateFlowPage(JoinTeamPage);
