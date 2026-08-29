'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { teamInviteStatusCopy } from '../utils/status-copy';
import { useMutation } from '@apollo/client/react';
import { CheckCircle2, Loader2, ShieldAlert, TicketX } from 'lucide-react';
import { useSession } from 'next-auth/react';
import {
  AcceptTeamInviteDocument,
  AcceptTeamInviteMutation,
  AcceptTeamInviteMutationVariables,
  AcceptTeamInviteStatus,
} from '@/graphql/graphql';
import { Button } from '@/components/foundation/button/button';

type AcceptTeamInviteCardProps = {
  token: string;
};

export function AcceptTeamInviteCard({ token }: AcceptTeamInviteCardProps) {
  const router = useRouter();
  const { update } = useSession();
  const hasSubmittedRef = useRef(false);
  const [acceptTeamInvite, { data, loading, error }] = useMutation<
    AcceptTeamInviteMutation,
    AcceptTeamInviteMutationVariables
  >(AcceptTeamInviteDocument);

  useEffect(() => {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;

    void acceptTeamInvite({
      variables: {
        input: {
          token,
        },
      },
    });
  }, [acceptTeamInvite, token]);

  useEffect(() => {
    const status = data?.acceptTeamInvite.status;

    if (
      status === AcceptTeamInviteStatus.Success ||
      status === AcceptTeamInviteStatus.AlreadyJoined
    ) {
      void update({ hasOnBoarded: true });
    }
  }, [data?.acceptTeamInvite.status, update]);

  const result = data?.acceptTeamInvite;
  const copy = result ? teamInviteStatusCopy[result.status] : null;
  const canOpenTeam =
    result?.routeKey &&
    (result.status === AcceptTeamInviteStatus.Success ||
      result.status === AcceptTeamInviteStatus.AlreadyJoined);

  return (
    <section className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950/90 text-white shadow-2xl shadow-black/40">
      <div className="border-b border-white/10 bg-linear-to-br from-orange-500/18 via-slate-900 to-slate-950 px-6 py-7">
        <p className="text-xs font-black tracking-[0.28em] text-orange-200 uppercase">
          Team invite
        </p>
        <h1 className="font-righteous mt-3 text-3xl text-white">
          Join NextPlay team
        </h1>
        <p className="mt-2 text-sm text-white/55">
          We are checking your invite and adding you to the roster.
        </p>
      </div>

      <div className="px-6 py-8">
        {loading && (
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-orange-300" />
            <div>
              <h2 className="text-xl font-bold">Accepting invite...</h2>
              <p className="mt-1 text-sm text-white/50">
                Hang tight, we are adding your account to the team.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-4 text-center">
            <ShieldAlert className="h-10 w-10 text-red-300" />
            <div>
              <h2 className="text-xl font-bold">Invite could not be checked</h2>
              <p className="mt-1 text-sm text-white/50">{error.message}</p>
            </div>
          </div>
        )}

        {copy && (
          <div className="flex flex-col items-center gap-4 text-center">
            {copy.variant === 'success' ? (
              <CheckCircle2 className="h-10 w-10 text-emerald-300" />
            ) : (
              <TicketX className="h-10 w-10 text-orange-300" />
            )}
            <div>
              <h2 className="text-xl font-bold">{copy.title}</h2>
              <p className="mt-1 text-sm text-white/50">{copy.description}</p>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {canOpenTeam && (
            <Button
              type="button"
              variant="primary"
              className="flex-1 rounded-full"
              onClick={() => router.replace(`/team/${result.routeKey}`)}
            >
              Open team
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-full"
            onClick={() => router.replace('/club')}
          >
            Go to teams
          </Button>
        </div>
      </div>
    </section>
  );
}
