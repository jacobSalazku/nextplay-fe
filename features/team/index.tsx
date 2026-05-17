'use client';

import { type FC } from 'react';
import { useRouter } from 'next/navigation';
import { toastStyling } from '../toast-notification/styling';
import { useTeam } from '@/context/team-context';
import { useMutation } from '@apollo/client/react';
import { Copy, UserPlus, Users } from 'lucide-react';
import { toast } from 'sonner';
import {
  AcceptTeamRequestDocument,
  GetPendingMembersQuery,
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
  pendingMembers: GetPendingMembersQuery['getPendingMembers'];
};

export const PlayerBlock: FC<PlayerBlockProps> = ({ team, pendingMembers }) => {
  const { routeKey } = useTeam();
  const router = useRouter();

  const [acceptRequest, { loading }] = useMutation(AcceptTeamRequestDocument, {
    refetchQueries: ['GetPendingMembers'],
  });

  const handleCopy = () => {
    navigator.clipboard
      .writeText(team.code)
      .then(() => {
        toast.success('Team code copied to clipboard!', toastStyling);
      })
      .catch(() => {
        toast.error('Failed to copy team code.');
      });
  };

  const handleAcceptRequest = async (id: string) => {
    if (!routeKey) return;

    try {
      await acceptRequest({
        variables: {
          input: {
            memberId: id,
            routeKey,
          },
        },
      });

      router.refresh();
      toast.success('Request accepted', toastStyling);
    } catch (error) {
      console.error(error);
      toast.error('Failed to accept request');
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full px-2 md:px-6 pt-2">
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
          <div className="mt-4 inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-4 py-2 hover:border-orange-300/40 transition">
            <span className="text-xs text-white/40 uppercase tracking-widest">
              Code
            </span>
            <span className="font-mono text-sm text-orange-200">
              {team.code}
            </span>
            <button
              onClick={handleCopy}
              className="ml-1 text-white/40 hover:text-orange-300 transition"
              aria-label="Copy team code"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
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

      <Card className="w-full overflow-hidden rounded-3xl border border-white/10 bg-linear-to-b from-slate-900/85 to-slate-950/85 shadow-xl backdrop-blur-sm text-white">
        <CardHeader className="border-b border-white/10 px-4 md:px-8 py-7 flex justify-between items-start">
          <CardTitle className="text-3xl font-bold">Players Request</CardTitle>

          {pendingMembers && pendingMembers.length > 0 && (
            <div className="flex items-center gap-2 rounded-full border border-orange-300/30 bg-orange-300/10 px-3 py-1.5 text-sm text-orange-200">
              <UserPlus className="h-3.5 w-3.5" />
              <span>{pendingMembers.length} pending</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="px-4 sm:px-8 py-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/10">
                <TableHead className="py-4 text-xs uppercase tracking-widest text-white/40">
                  Player
                </TableHead>
                <TableHead className="py-4 text-right" />
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-white/5">
              {pendingMembers && pendingMembers.length > 0 ? (
                pendingMembers.map((member) => (
                  <TableRow
                    key={member.id}
                    className="group border-0 hover:bg-white/4"
                  >
                    <TableCell className="py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-bold text-white/80">
                          {member.name?.[0] ?? '?'}
                        </div>

                        <div>
                          <div className="text-white/90 font-semibold">
                            {member.name}
                          </div>
                          <div className="text-xs text-white/50">
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-5 text-right">
                      <Button
                        onClick={() => handleAcceptRequest(member.id)}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-400 disabled:opacity-50"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        {loading ? 'Accepting...' : 'Accept'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="py-16 text-center">
                    <p className="text-sm text-white/60 italic">
                      No pending requests.
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
