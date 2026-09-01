'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getFullPosition } from '../utils';
import { useTeam } from '@/context/team-context';
import {
  playerAttendanceStatus,
  playerAttendanceStatusColor,
} from '@/features/attendance/utils/attendance-status';
import { deleteToastStyling } from '@/features/toast-notification/styling';
import { cn } from '@/utils/tw-merge';
import { useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Calendar, UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { gqlRequest } from '@/lib/graphql/client-request';
import {
  DeleteMemberDocument,
  GetUserProfileQuery,
  Role,
} from '@/graphql/graphql';
import { useConfirmedAction } from '@/components/feedback/confirm-provider';
import { Button } from '@/components/foundation/button/button';
import { CategoryBadge } from '@/components/foundation/category-badge';
import { Tabs, TabsList } from '@/components/foundation/tabs/tab-list';
import { TabsContent } from '@/components/foundation/tabs/tabs-content';
import { TabsTrigger } from '@/components/foundation/tabs/tabs-trigger';
import { PlayerDetailItem } from './player-detail-item';

const formatDateOfBirth = (value: unknown): string => {
  const normalized =
    value instanceof Date ? value.toISOString() : String(value);
  const datePart = normalized.split('T')[0];
  const [year, month, day] = datePart.split('-');

  if (!year || !month || !day) {
    return normalized;
  }

  return `${day}-${month}-${year}`;
};

const PlayerDetailPanel = ({
  userProfile,
}: {
  userProfile: GetUserProfileQuery['getUserProfile'];
}) => {
  const { routeKey } = useTeam();
  const router = useRouter();
  const { mutate: deletePlayer } = useMutation({
    mutationFn: (id: string) =>
      gqlRequest(DeleteMemberDocument, { input: { id, routeKey } }),
    onSuccess: () => {
      // Soft-deleted, so this profile URL still resolves — leave it for the
      // now-stale roster link instead of re-rendering a removed member.
      router.push(`/team/${routeKey}/players`);
      router.refresh();
      toast.success('Player removed from team', {
        ...deleteToastStyling,
        position: 'top-center',
      });
    },
  });

  const handleDeletePlayer = useConfirmedAction(deletePlayer, {
    title: 'Remove this player?',
    description:
      'They drop off the roster but their stats and attendance stay on record. Re-inviting restores their access.',
    confirmLabel: 'Remove',
  });

  if (!userProfile) {
    return <div className="p-6 text-center text-white">Player not found.</div>;
  }

  const selectedPlayer = userProfile;
  const jerseyNumber = selectedPlayer.number
    ? `#${selectedPlayer.number}`
    : 'N/A';
  const fullPosition =
    selectedPlayer.position && selectedPlayer.position.length > 0
      ? getFullPosition(selectedPlayer.position)
      : 'Unknown position';
  const roleLabel = selectedPlayer.role === Role.Coach ? 'Coach' : 'Player';

  return (
    <div className="relative mx-auto w-full max-w-5xl px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-8 -z-10 h-60 bg-linear-to-r from-orange-500/15 via-transparent to-cyan-400/10 blur-3xl" />

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-linear-to-b from-slate-900/85 to-slate-950/85 p-5 shadow-xl backdrop-blur-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {selectedPlayer.user?.image ? (
              <Image
                width={140}
                height={140}
                src={selectedPlayer.user.image}
                alt={selectedPlayer.user?.name ?? 'Player image'}
                className="h-28 w-28 rounded-3xl border border-white/20 object-cover sm:h-32 sm:w-32"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-3xl border border-white/15 bg-white/5 sm:h-32 sm:w-32">
                <UserIcon className="h-14 w-14 text-white/40" strokeWidth={1} />
              </div>
            )}

            <div>
              <h2 className="text-2xl leading-tight font-bold sm:text-3xl">
                {selectedPlayer.name}
              </h2>
              <p className="mt-1 text-sm text-white/70">{fullPosition}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
                <CategoryBadge
                  label={roleLabel}
                  className="rounded-full border border-orange-300/35 bg-orange-300/10 px-3 py-1 text-orange-200"
                />

                <CategoryBadge
                  label={jerseyNumber}
                  className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-white/85"
                />

                <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-cyan-100">
                  {fullPosition}
                </span>
              </div>
            </div>
          </div>

          {selectedPlayer.role === Role.Coach && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDeletePlayer(selectedPlayer.id)}
            >
              Remove From Team
            </Button>
          )}
        </div>
      </section>

      <Tabs defaultValue="info" className="mt-7">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-slate-900/75 p-2">
          <TabsTrigger
            className="cursor-pointer rounded-xl border border-transparent px-4 py-2.5 text-sm text-white/70 transition data-[state=active]:border-white/10 data-[state=active]:bg-white data-[state=active]:text-slate-900"
            value="info"
          >
            Personal Info
          </TabsTrigger>
          <TabsTrigger
            className="cursor-pointer rounded-xl border border-transparent px-4 py-2.5 text-sm text-white/70 transition data-[state=active]:border-white/10 data-[state=active]:bg-white data-[state=active]:text-slate-900"
            value="attendance"
          >
            Attendance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <PlayerDetailItem
              label="Full Name"
              value={selectedPlayer.user?.name}
            />
            <PlayerDetailItem
              label="Email"
              value={selectedPlayer.user?.email}
            />
            {selectedPlayer.user?.dateOfBirth && (
              <PlayerDetailItem
                label="Date of Birth"
                value={formatDateOfBirth(selectedPlayer.user.dateOfBirth)}
              />
            )}
            <PlayerDetailItem label="Jersey Number" value={jerseyNumber} />
            <PlayerDetailItem label="Position" value={fullPosition} />
            <PlayerDetailItem
              label="Height"
              value={selectedPlayer.user?.height}
            />
            <PlayerDetailItem
              label="Weight"
              value={selectedPlayer.user?.weight}
            />
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="mt-5">
          <div className="rounded-2xl border border-white/10 bg-slate-900/65 p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/80">
              <Calendar className="h-4 w-4 text-orange-200/85" />
              Recent Attendance
            </div>

            {selectedPlayer.attendances.length > 0 ? (
              <div className="scrollbar-none max-h-[26rem] space-y-3 overflow-y-auto pr-1">
                {selectedPlayer.attendances.map((attendance) => (
                  <article
                    key={attendance.id}
                    className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/3 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white/90">
                        {attendance.activity?.title ?? 'Unnamed activity'}
                      </p>
                      <p className="text-xs text-white/60">
                        {attendance.activity
                          ? `${attendance.activity.time} · ${format(attendance.activity.date, 'dd MMM yyyy')}`
                          : 'No schedule info'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          playerAttendanceStatusColor(
                            attendance.attendanceStatus,
                          ),
                          'rounded-full px-3 py-1 text-xs font-semibold',
                        )}
                      >
                        {playerAttendanceStatus(attendance.attendanceStatus)}
                      </span>

                      {attendance.reason && (
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                          {attendance.reason}
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/60 italic">
                No attendance data available yet.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlayerDetailPanel;
