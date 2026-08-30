'use client';

import { useMemo, type FC } from 'react';
import useStore from '@/store/store';
import { cn } from '@/utils/tw-merge';
import { format } from 'date-fns';
import { Clock3, UserCheck, UserX, X } from 'lucide-react';
import { AttendanceStatus, Team } from '@/graphql/graphql';
import { Button } from '@/components/foundation/button/button';

type Mode = 'Game' | 'Practice';

type CoachAttendanceListModalProps = {
  mode: Mode;
  team: Team;
};

const CoachAttendanceListModal: FC<CoachAttendanceListModalProps> = ({
  mode,
  team,
}) => {
  const { selectedActivity, setOpenGameAttendance, setOpenPracticeAttendance } =
    useStore();

  const isGame = mode === 'Game';

  const closeModal = () => {
    if (isGame) {
      setOpenGameAttendance(false);
      return;
    }

    setOpenPracticeAttendance(false);
  };

  const attendanceByMemberId = useMemo(
    () =>
      new Map(
        (team.members ?? []).map((teamMember) => [teamMember.id, teamMember]),
      ),
    [team.members],
  );

  const attendees = useMemo(() => {
    if (!selectedActivity) {
      return [];
    }

    return [...selectedActivity.attendees]
      .map((attendance) => {
        const teamMember = attendanceByMemberId.get(attendance.memberId);
        return {
          ...attendance,
          memberName:
            teamMember?.name ?? `Member ${attendance.memberId.slice(0, 8)}`,
        };
      })
      .sort((a, b) => {
        const statusRank = (status: AttendanceStatus) => {
          if (status === AttendanceStatus.Attending) return 0;
          if (status === AttendanceStatus.Late) return 1;
          return 2;
        };

        const rankDiff =
          statusRank(a.attendanceStatus) - statusRank(b.attendanceStatus);
        if (rankDiff !== 0) return rankDiff;

        return a.memberName.localeCompare(b.memberName);
      });
  }, [attendanceByMemberId, selectedActivity]);

  const attendanceStats = useMemo(() => {
    const attending = attendees.filter(
      (attendance) =>
        attendance.attendanceStatus === AttendanceStatus.Attending,
    ).length;
    const late = attendees.filter(
      (attendance) => attendance.attendanceStatus === AttendanceStatus.Late,
    ).length;
    const notAttending = attendees.filter(
      (attendance) =>
        attendance.attendanceStatus === AttendanceStatus.NotAttending,
    ).length;

    return {
      total: attendees.length,
      attending,
      late,
      notAttending,
    };
  }, [attendees]);

  if (!selectedActivity) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-slate-900/95 to-slate-950 shadow-[0_0_30px_rgba(0,0,0,0.35)]">
        <div className="relative flex items-center justify-between border-b border-white/10 bg-slate-900/60 px-4 py-3 text-white">
          <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-orange-500 via-amber-300 to-orange-500 opacity-80" />
          <div>
            <h2 className="font-righteous text-lg font-normal sm:text-xl">
              Attendance List
            </h2>
            <p className="text-xs text-gray-400 sm:text-sm">
              {isGame ? 'Game' : 'Practice'} • {selectedActivity.title}
            </p>
          </div>
          <Button
            onClick={closeModal}
            className="border border-white/10 bg-transparent py-2 text-xl font-bold text-gray-300 shadow-none hover:bg-slate-900 hover:text-white"
            aria-label="Close Attendance List"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="grid max-h-[calc(92vh-76px)] gap-4 overflow-y-auto p-4 lg:grid-cols-[300px_1fr] lg:overflow-hidden">
          <aside className="space-y-3">
            <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3">
              <div className="text-xs tracking-wide text-gray-400 uppercase">
                Activity
              </div>
              <div className="text-sm text-white/90">
                {selectedActivity.title}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3">
              <div className="text-xs tracking-wide text-gray-400 uppercase">
                Date
              </div>
              <div className="text-sm text-white/90">
                {format(new Date(selectedActivity.date), 'EEEE, MMMM d, yyyy')}
              </div>
              <div className="text-sm text-gray-300">
                {selectedActivity.time}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3">
                <div className="flex items-center gap-2 text-emerald-200">
                  <UserCheck className="h-4 w-4" />
                  <span className="text-xs uppercase">Attending</span>
                </div>
                <p className="mt-1 text-xl font-semibold text-white">
                  {attendanceStats.attending}
                </p>
              </div>
              <div className="rounded-xl border border-amber-300/20 bg-amber-500/10 p-3">
                <div className="flex items-center gap-2 text-amber-100">
                  <Clock3 className="h-4 w-4" />
                  <span className="text-xs uppercase">Late</span>
                </div>
                <p className="mt-1 text-xl font-semibold text-white">
                  {attendanceStats.late}
                </p>
              </div>
              <div className="rounded-xl border border-rose-300/20 bg-rose-500/10 p-3">
                <div className="flex items-center gap-2 text-rose-100">
                  <UserX className="h-4 w-4" />
                  <span className="text-xs uppercase">Absent</span>
                </div>
                <p className="mt-1 text-xl font-semibold text-white">
                  {attendanceStats.notAttending}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-800/70 p-3">
                <div className="text-xs uppercase text-gray-300">Total</div>
                <p className="mt-1 text-xl font-semibold text-white">
                  {attendanceStats.total}
                </p>
              </div>
            </div>
          </aside>

          <section className="min-h-0 rounded-xl border border-white/10 bg-slate-900/70">
            <div className="border-b border-white/10 px-4 py-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-200">
                Player Responses
              </h3>
            </div>
            <div className="max-h-[58vh] overflow-y-auto p-3">
              {attendees.length === 0 ? (
                <div className="rounded-lg border border-white/10 bg-slate-950/70 p-4 text-sm text-gray-400">
                  No attendance responses yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {attendees.map((attendance) => {
                    const statusClassName =
                      attendance.attendanceStatus === AttendanceStatus.Attending
                        ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30'
                        : attendance.attendanceStatus === AttendanceStatus.Late
                          ? 'bg-amber-500/20 text-amber-100 border-amber-300/30'
                          : 'bg-rose-500/20 text-rose-100 border-rose-300/30';

                    const initials = attendance.memberName
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <div
                        key={attendance.id}
                        className="rounded-lg border border-white/10 bg-slate-950/80 px-3 py-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex min-w-0 items-center gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-slate-800 text-xs font-semibold text-gray-200">
                              {initials}
                            </div>
                            <span className="truncate text-sm text-white/90">
                              {attendance.memberName}
                            </span>
                          </div>
                          <span
                            className={cn(
                              'rounded-full border px-2 py-0.5 text-xs font-medium',
                              statusClassName,
                            )}
                          >
                            {attendance.attendanceStatus
                              .toLowerCase()
                              .replace('_', ' ')}
                          </span>
                        </div>
                        {attendance.reason && (
                          <p className="mt-1 truncate text-xs text-gray-400">
                            Reason: {attendance.reason}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CoachAttendanceListModal;
