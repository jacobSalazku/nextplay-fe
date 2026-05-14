'use client';

import { type FC } from 'react';
import { attendanceStatus } from '../utils/const';
import { type AttendanceData, type AttendanceStatusOption } from '../zod';
import useStore from '@/store/store';
import { useMutation } from '@apollo/client/react';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  MemberWithAttendances,
  SubmitAttendanceDocument,
} from '@/graphql/graphql';
import { Button } from '@/components/foundation/button/button';
import { RadioGroup } from '@/components/foundation/radio/radio-group';
import { RadioGroupItem } from '@/components/foundation/radio/radio-group-item';
import { Textarea } from '@/components/foundation/textarea';

type Mode = 'Game' | 'Practice';

type AttendanceProps = {
  mode: Mode;
  member: MemberWithAttendances;
};

const AttendanceModal: FC<AttendanceProps> = ({ mode, member }) => {
  const { selectedActivity, setOpenGameAttendance, setOpenPracticeAttendance } =
    useStore();

  const [submitAttendance] = useMutation(SubmitAttendanceDocument);

  const { handleSubmit, register, control, reset } = useForm<AttendanceData>({
    defaultValues: {
      attendanceStatus:
        (selectedActivity?.attendees?.find((a) => a.memberId === member?.id)
          ?.attendanceStatus as
          | 'ATTENDING'
          | 'NOT_ATTENDING'
          | 'LATE'
          | undefined) ?? undefined,
      reason:
        selectedActivity?.attendees?.find((a) => a.memberId === member?.id)
          ?.reason ?? '',
    },
  });

  const isGame = mode === 'Game';
  const attendanceSelection = useWatch({ control, name: 'attendanceStatus' });

  const formattedDate =
    selectedActivity && format(selectedActivity.date, 'EEEE, d MMM');

  const onSubmit = async (attendance: AttendanceData) => {
    if (!selectedActivity?.id) {
      throw new Error('Activity ID is required.');
    }
    if (!member) {
      throw new Error('Team member is required.');
    }

    await submitAttendance({
      variables: {
        input: {
          activityId: selectedActivity.id,
          memberId: member.id,
          attendanceStatus: attendance.attendanceStatus,
          reason: attendance.reason ?? '',
        },
      },
    });

    if (isGame) setOpenGameAttendance(false);
    if (!isGame) setOpenPracticeAttendance(false);

    reset({
      attendanceStatus: attendance.attendanceStatus,
      reason: attendance.reason,
    });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-orange-200/30 bg-black text-white shadow-lg sm:max-w-lg">
        <div className="flex items-center justify-between border-b border-orange-200/30 px-4 py-3 sm:px-5 sm:py-4">
          <h2 className="font-righteous text-lg tracking-wide sm:text-xl">
            Attendance
          </h2>
          <button
            onClick={
              isGame
                ? () => setOpenGameAttendance(false)
                : () => setOpenPracticeAttendance(false)
            }
            className="cursor-pointer rounded p-2 text-xl font-bold text-gray-400 hover:bg-gray-800 hover:text-orange-300"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 p-4 sm:p-5"
        >
          <div className="space-y-1 text-center">
            <h3 className="text-sm font-semibold sm:text-base">
              {isGame
                ? `Will you attend the game vs ${selectedActivity?.title}?`
                : `Will you attend practice on ${formattedDate}?`}
            </h3>
            <p className="text-xs text-gray-400 sm:text-sm">
              Please select your attendance status
            </p>
          </div>

          <Controller
            control={control}
            name="attendanceStatus"
            rules={{ required: true }}
            render={({ field }) => (
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="space-y-3"
              >
                {attendanceStatus.map((status: AttendanceStatusOption) => (
                  <label
                    key={status.value}
                    htmlFor={status.value}
                    className="flex cursor-pointer items-center rounded-md border border-gray-700 p-3 transition hover:border-orange-300/20 hover:bg-gray-950 data-[state=checked]:bg-gray-950"
                  >
                    <RadioGroupItem
                      value={status.value}
                      id={status.value}
                      className="peer mr-3 h-4 w-4 rounded-full border border-gray-500 bg-gray-300 ring-0 focus:ring-0 data-[state=checked]:bg-gray-900"
                    />
                    <span className="text-sm font-medium">{status.label}</span>
                  </label>
                ))}
              </RadioGroup>
            )}
          />

          {(attendanceSelection === 'NOT_ATTENDING' ||
            attendanceSelection === 'LATE') && (
            <div className="space-y-2">
              <label htmlFor="reason" className="pb-2 text-sm text-gray-300">
                Reasoning
              </label>
              <Textarea
                id="reason"
                aria-label="Enter your reason for not attending or being late"
                {...register('reason')}
                placeholder="Optional reason (e.g. sick, travel, etc.)"
                className="min-h-[80px] border border-gray-700 bg-gray-950 text-white"
              />
            </div>
          )}

          <div className="flex justify-end border-gray-800 pt-1">
            <Button type="submit" variant="outline">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttendanceModal;
