'use client';

import { useState, type FC } from 'react';
import { useRouter } from 'next/navigation';
import { getButtonText } from '../../utils/button-text';
import { practiceSchema, type PracticeData } from '../../zod';
import { useTeam } from '@/context/team-context';
import { toastStyling } from '@/features/toast-notification/styling';
import useStore from '@/store/store';
import { getTypeBgColor } from '@/utils';
import { cn } from '@/utils/tw-merge';
import { useMutation } from '@apollo/client/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  ActivityType,
  CreatePracticeDocument,
  MemberWithAttendances,
  PracticeType,
  Team,
  UpdatePracticeDocument,
} from '@/graphql/graphql';
import { Button } from '@/components/foundation/button/button';
import { Input } from '@/components/foundation/input';
import { Mode } from './game-form';

type PracticeProps = {
  mode: Mode;
  team: Team;
  onClose: () => void;
  member: MemberWithAttendances;
};

const PracticeForm: FC<PracticeProps> = ({ mode, onClose, member }) => {
  const { routeKey } = useTeam();
  const [formState, setFormState] = useState<Mode>(mode);
  const [createPractice] = useMutation(CreatePracticeDocument);
  const [updatePractice] = useMutation(UpdatePracticeDocument);
  const router = useRouter();

  const {
    selectedDate,
    openGameDetails,
    openPracticeDetails,
    selectedActivity,
  } = useStore();

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PracticeData>({
    resolver: zodResolver(practiceSchema),
    defaultValues: {
      date: formattedDate,
      duration: 2,
      time: '18:00',
    },
  });

  const isViewMode = formState === 'view';
  const isEditMode = formState === 'edit';
  const isCreateMode = formState === 'create';
  const role = member?.role === 'COACH';

  const buttonText = getButtonText(isSubmitting, formState, 'Practice');

  const onSubmit = async (data: PracticeData) => {
    const date = new Date(data.date);

    try {
      if (formState === 'edit') {
        await updatePractice({
          variables: {
            input: {
              ...data,
              id: selectedActivity!.id,
              date: date.toISOString(),
              teamId: routeKey,
              type: ActivityType.Practice,
              facility: 'Sportschuur',
            },
          },
        });
        router.refresh();
        onClose();
        setFormState('view');
      } else {
        await createPractice({
          variables: {
            input: {
              ...data,
              date: date.toISOString(),
              teamId: routeKey,
              type: ActivityType.Practice,
              facility: 'Sportschuur',
            },
          },
        });
        toast.success('Practice created successfully!', toastStyling);
        onClose();
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  const shouldShowModal =
    formState === 'create' ||
    (selectedActivity && (openGameDetails || openPracticeDetails));

  if (!shouldShowModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden bg-black/60 p-3 backdrop-blur-sm sm:p-4">
      <div className="max-h-[90vh] w-full max-w-[calc(100vw-1.5rem)] overflow-y-auto overflow-x-hidden rounded-2xl border border-white/10 bg-linear-to-b from-slate-900/95 to-slate-950 shadow-[0_0_30px_rgba(0,0,0,0.35)] sm:max-w-md">
        <div className="relative flex min-w-0 items-center justify-between gap-3 border-b border-white/10 bg-slate-900/60 px-4 py-3 text-white">
          <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-orange-500 via-amber-300 to-orange-500 opacity-80" />
          <h2 className="font-righteous min-w-0 truncate text-lg font-normal sm:text-xl">
            {isViewMode
              ? selectedActivity?.title
              : isEditMode
                ? (selectedActivity?.title ?? 'Edit Practice')
                : 'Create Practice'}
          </h2>
          <Button
            onClick={onClose}
            className="shrink-0 border border-white/10 bg-transparent py-2 text-xl font-bold text-gray-300 shadow-none hover:bg-slate-900 hover:text-white"
            aria-label="Close Practice Form"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        {isViewMode && selectedActivity && (
          <>
            <div className="min-w-0 space-y-3 p-4 text-sm text-white sm:p-5 sm:text-base">
              <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3">
                <div className="text-xs tracking-wide text-gray-400 uppercase">
                  Type
                </div>
                <div className="inline-block rounded-full py-2 text-xs text-black">
                  <span
                    className={cn(
                      selectedActivity
                        ? getTypeBgColor(selectedActivity.type)
                        : '',
                      'rounded-xl p-2',
                    )}
                  >
                    {selectedActivity.type}
                  </span>
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3">
                <div className="text-xs tracking-wide text-gray-400 uppercase">
                  Practice Type
                </div>
                <div className="break-words text-white/90">
                  {selectedActivity.practice?.practicetype}
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3">
                <div className="text-xs tracking-wide text-gray-400 uppercase">
                  Time
                </div>
                <div className="text-white/90">{selectedActivity.time}</div>
              </div>
              {selectedActivity?.duration && (
                <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3">
                  <div className="text-xs tracking-wide text-gray-400 uppercase">
                    Duration
                  </div>
                  <div className="text-white/90">
                    {selectedActivity.duration}
                  </div>
                </div>
              )}
              <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3">
                <div className="text-xs tracking-wide text-gray-400 uppercase">
                  Date
                </div>
                <div className="break-words text-white/90">
                  {format(
                    new Date(selectedActivity.date),
                    'EEEE, MMMM d, yyyy',
                  )}
                </div>
              </div>
            </div>

            {role && (
              <div className="flex min-w-0 justify-end gap-2 border-t border-white/10 p-4 sm:p-5">
                <Button
                  onClick={() => {
                    setFormState('edit');
                    reset({
                      title: selectedActivity.title,
                      date: format(
                        new Date(selectedActivity.date),
                        'yyyy-MM-dd',
                      ),
                      time: selectedActivity.time,
                      duration: selectedActivity.duration ?? undefined,
                      practiceType:
                        (selectedActivity.practice
                          ?.practicetype as PracticeType) ?? undefined,
                    });
                  }}
                  variant="outline"
                  className="w-full border-white/20 bg-slate-900/80 hover:border-orange-300/40 sm:w-auto"
                >
                  Edit Practice
                </Button>
              </div>
            )}
          </>
        )}

        {(isEditMode || isCreateMode) && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="min-w-0 w-full space-y-4 p-4 sm:p-5"
          >
            <Input
              id="title"
              aria-label="Practice title input"
              className="border-white/10 bg-slate-900/70 text-white placeholder:text-gray-500"
              label="Title"
              labelColor="light"
              type="text"
              placeholder="Preparation for next match"
              {...register('title')}
              error={errors.title}
              errorMessage={errors.title?.message}
            />
            <div>
              <label className="mb-2 block text-sm font-semibold tracking-wide text-gray-100 uppercase">
                Practice Type
              </label>
              <div className="flex min-w-0 flex-col gap-2">
                {Object.values(PracticeType).map((practice) => (
                  <label
                    key={practice}
                    className="flex min-w-0 items-center gap-3 rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 transition-colors hover:border-orange-300/40"
                  >
                    <input
                      aria-label={`Practice type radio input${practice}`}
                      type="radio"
                      value={practice}
                      {...register('practiceType', {
                        required: 'Please select a practice type',
                      })}
                      className="h-4 w-4 shrink-0 border-white/30 bg-slate-900 text-blue-500 accent-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-950"
                    />
                    <span className="min-w-0 flex-1 break-words text-gray-200">
                      {practice}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <Input
              id="time"
              aria-label="Practice start time input"
              className="border-white/10 bg-slate-900/70 text-white"
              label="Start Time"
              labelColor="light"
              type="time"
              {...register('time')}
              error={errors.time}
              errorMessage={errors.time?.message}
            />
            <Input
              id="duration"
              aria-label="Practice duration input"
              className="border-white/10 bg-slate-900/70 text-white placeholder:text-gray-500"
              label="Duration"
              labelColor="light"
              type="number"
              step="0.5"
              min="0.5"
              placeholder="E.g. 2"
              {...register('duration', {
                required: 'Duration is required',
                min: 0.5,
              })}
              error={errors.duration}
              errorMessage={errors.duration?.message}
            />
            <Input
              id="date"
              aria-label="Practice date input"
              className="border-white/10 bg-slate-900/70 text-white"
              label="Date"
              labelColor="light"
              type="date"
              {...register('date')}
              error={errors.date}
              errorMessage={errors.date?.message}
            />
            <div className="flex min-w-0 justify-end gap-3 border-t border-white/10 pt-5">
              {role && isEditMode && (
                <Button
                  aria-label="Edit Practice"
                  type="submit"
                  variant="primary"
                  className="w-full sm:w-auto"
                >
                  Edit Practice
                </Button>
              )}
              {role && isCreateMode && (
                <Button
                  aria-label="Create Practice "
                  type="submit"
                  variant="primary"
                  className="w-full sm:w-auto"
                >
                  {buttonText}
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PracticeForm;
