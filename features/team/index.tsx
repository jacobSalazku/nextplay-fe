'use client';

import { useState, type FC } from 'react';
import { toastStyling } from '../toast-notification/styling';
import { useTeam } from '@/context/team-context';
import { useMutation } from '@apollo/client/react';
import { Check, Copy, LinkIcon, Loader2, UserPlus, Users } from 'lucide-react';
import { toast } from 'sonner';
import {
  CreateTeamInviteDocument,
  CreateTeamInviteMutation,
  CreateTeamInviteMutationVariables,
  TeamInformation,
} from '@/graphql/graphql';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/card';
import { Button } from '@/components/foundation/button/button';
import { Link } from '@/components/foundation/button/link';
import { Table } from '@/components/foundation/table/table';
import { TableBody } from '@/components/foundation/table/table-body';
import { TableCell } from '@/components/foundation/table/table-cell';
import { TableHead } from '@/components/foundation/table/table-head';
import { TableHeader } from '@/components/foundation/table/table-header';
import { TableRow } from '@/components/foundation/table/table-row';
import { getFullPosition } from './utils';

type PlayerBlockProps = {
  team: TeamInformation;
};

export const PlayerBlock: FC<PlayerBlockProps> = ({ team }) => {
  const { routeKey } = useTeam();
  const [invite, setInvite] = useState<
    CreateTeamInviteMutation['createTeamInvite'] | null
  >(null);
  const [hasCopiedInvite, setHasCopiedInvite] = useState(false);

  const [createTeamInvite, { loading: creatingInvite }] = useMutation<
    CreateTeamInviteMutation,
    CreateTeamInviteMutationVariables
  >(CreateTeamInviteDocument);

  const handleCreateInvite = async () => {
    const resolvedRouteKey = routeKey ?? team.routeKey;

    if (!resolvedRouteKey) {
      toast.error('Missing team route key.');
      return;
    }

    try {
      const response = await createTeamInvite({
        variables: {
          input: {
            routeKey: resolvedRouteKey,
          },
        },
      });

      const createdInvite = response.data?.createTeamInvite;

      if (!createdInvite) {
        toast.error('No invite link returned.');
        return;
      }

      setInvite(createdInvite);
      setHasCopiedInvite(false);
      toast.success('Invite link created', toastStyling);
    } catch (error) {
      console.error(error);
      toast.error('Failed to create invite link.');
    }
  };

  const handleCopyInvite = async () => {
    if (!invite?.inviteLink) return;

    try {
      await navigator.clipboard.writeText(invite.inviteLink);
      setHasCopiedInvite(true);
      toast.success('Invite link copied', toastStyling);
    } catch (error) {
      console.error(error);
      toast.error('Failed to copy invite link.');
    }
  };

  return (
    <div className="flex w-full flex-col gap-8 px-2 pt-4 md:px-6 md:pt-2">
      <Card className="w-full overflow-hidden rounded-3xl border py-5 border-white/10 bg-linear-to-b from-slate-900/85 to-slate-950/85 shadow-xl backdrop-blur-sm text-white">
        <CardHeader className="border-b border-white/10 px-4 sm:px-8  py-5">
          <div className="flex flex-col gap-5">
            <div>
              <CardTitle className="text-3xl font-bold">
                {team.name} Players
              </CardTitle>
              <CardDescription className="text-sm text-white/60">
                Manage your basketball team roster and access player details.
              </CardDescription>
            </div>
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-orange-300/30 bg-orange-300/10 px-3 py-1.5 text-sm text-orange-200">
              <Users className="h-3.5 w-3.5" />
              <span>{team.members?.length ?? 0} players</span>
            </div>
          </div>
          <div className="mt-5 rounded-3xl border border-orange-300/20 bg-orange-300/8 p-4 shadow-inner shadow-orange-950/20">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm font-semibold text-orange-200">
                  <LinkIcon className="h-4 w-4" />
                  Invite player
                </div>
                <p className="mt-1 max-w-2xl text-sm text-white/55">
                  Create a single-use invite link. Send it through WhatsApp,
                  mail, or any channel you already use with the player.
                </p>
              </div>

              <Button
                type="button"
                variant="primary"
                onClick={handleCreateInvite}
                disabled={creatingInvite}
                className="rounded-full px-5"
              >
                {creatingInvite ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Generate invite
                  </>
                )}
              </Button>
            </div>

            {invite && (
              <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/70 p-3">
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold tracking-[0.18em] text-white/35 uppercase">
                      Invite link
                    </p>
                    <p className="mt-1 truncate font-mono text-sm text-orange-100">
                      {invite.inviteLink}
                    </p>
                    <p className="mt-1 text-xs text-white/40">
                      Expires{' '}
                      {new Date(invite.expiresAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                      {' · '}
                      {invite.usedCount}/{invite.maxUses} used
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCopyInvite}
                    className="rounded-full"
                  >
                    {hasCopiedInvite ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-300" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy link
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-4 md:px-8 py-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-white/10">
                  <TableHead className="w-16 py-4 text-xs uppercase tracking-widest text-white/40">
                    No.
                  </TableHead>
                  <TableHead className="py-4 text-xs uppercase tracking-widest text-white/40">
                    Player
                  </TableHead>
                  <TableHead className="hidden md:table-cell py-4 text-xs uppercase tracking-widest text-white/40">
                    Position
                  </TableHead>
                  <TableHead className="hidden lg:table-cell py-4 text-xs uppercase tracking-widest text-white/40">
                    Height
                  </TableHead>
                  <TableHead className="py-4 text-right" />
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-white/5">
                {team.members && team.members.length > 0 ? (
                  team.members.map((member) => (
                    <TableRow
                      key={member.id}
                      className="group border-0 transition hover:bg-white/4"
                    >
                      <TableCell className="py-5">
                        <span className="font-mono text-lg font-semibold text-orange-300">
                          {member.number ? `#${member.number}` : '—'}
                        </span>
                      </TableCell>

                      <TableCell className="py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-bold text-white/80">
                            {member.user.name?.[0]}
                          </div>
                          <div>
                            <div className="font-semibold text-white/90">
                              {member.name}
                            </div>
                            <div className="text-xs text-white/50">
                              {member.user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="hidden md:table-cell py-5 text-sm text-white/70">
                        {getFullPosition(member.position ?? '')}
                      </TableCell>

                      <TableCell className="hidden lg:table-cell py-5 text-sm text-white/70">
                        {member.user.height}
                      </TableCell>

                      <TableCell className="py-5 text-right">
                        <Link
                          aria-label="View Player Profile"
                          href={{
                            pathname: `/team/${routeKey}/players/profile`,
                            query: { id: member.user.id },
                          }}
                          variant="outline"
                          size="sm"
                          className="rounded-full border border-white/10 px-4 text-white/80 hover:border-orange-300/40 hover:text-orange-300 transition"
                        >
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="py-16 text-center">
                      <p className="text-sm text-white/60 italic">
                        No players on the roster yet.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
