import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AcceptTeamInviteCard } from '@/features/team-invite/components/accept-team-invite-card';
import { teamInviteTokenSchema } from '@/features/team-invite/zod';
import { getServerSession } from 'next-auth';
import { authServerOptions } from '@/lib/auth/server-options';
import { Link } from '@/components/foundation/button/link';

export const metadata: Metadata = {
  title: 'Join Team',
  description: 'Accept your NextPlay team invite.',
};

type JoinTeamInvitePageProps = {
  searchParams: Promise<{
    invite?: string;
  }>;
};

export default async function JoinTeamInvitePage({
  searchParams,
}: JoinTeamInvitePageProps) {
  const { invite } = await searchParams;
  const token = teamInviteTokenSchema.safeParse(invite).data;

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <section className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950/90 p-8 text-center shadow-2xl shadow-black/40">
          <p className="text-xs font-black tracking-[0.28em] text-orange-200 uppercase">
            Team invite
          </p>
          <h1 className="font-righteous mt-3 text-3xl">Missing invite</h1>
          <p className="mt-2 text-sm text-white/55">
            This invite link does not include a token. Ask your coach for a new
            invite link.
          </p>
          <Link href="/login" variant="outline" className="mt-6 rounded-full">
            Go to login
          </Link>
        </section>
      </main>
    );
  }

  const session = await getServerSession(authServerOptions);

  if (!session?.accessToken) {
    const callbackUrl = encodeURIComponent(`/join-team?invite=${token}`);

    redirect(`/login?callbackUrl=${callbackUrl}`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <AcceptTeamInviteCard token={token} />
    </main>
  );
}
