'use client';

import { useState, type FC } from 'react';
import { useRouter } from 'next/navigation';
import { getButtonText } from '../../utils/button-text';
import { gameSchema, type GameData } from '../../zod';
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
  CreateGameDocument,
  MemberWithAttendances,
  Team,
  UpdateGameDocument,
} from '@/graphql/graphql';
import { Button } from '@/components/foundation/button/button';
import { CategoryBadge } from '@/components/foundation/category-badge';
import { Input } from '@/components/foundation/input';

export type Mode = 'view' | 'edit' | 'create';

type GameFormProps = {
  mode: Mode;
  team: Team;
  onClose: () => void;
  member: MemberWithAttendances;
};

const GameForm: FC<GameFormProps> = ({ onClose, mode, member }) => {
  const { routeKey } = useTeam();
  const [formState, setFormState] = useState<Mode>(mode);
  const [createGame] = useMutation(CreateGameDocument);
  const [updateGame] = useMutation(UpdateGameDocument);
  const router = useRouter();
  const { selectedDate, selectedActivity } = useStore();

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GameData>({
    resolver: zodResolver(gameSchema),
    defaultValues: {
      date: formattedDate,
      duration: 2,
      time: '11:00',
    },
  });

  const isViewMode = formState === 'view';
  const isEditMode = formState === 'edit';
  const isCreateMode = formState === 'create';
  const role = member?.role === 'COACH';

  const buttonText = getButtonText(isSubmitting, formState, 'Game');

  const onSubmit = async (data: GameData) => {
    const date = new Date(data.date);

    try {
      if (formState === 'edit') {
        await updateGame({
          variables: {
            input: {
              ...data,
              id: selectedActivity!.id,
              date: date.toISOString(),
              teamId: routeKey,
              type: ActivityType.Game,
              location: 'HOME',
            },
          },
        });
        router.refresh();
        setFormState('view');
        toast.success('Game Updated', {
          ...toastStyling,
          position: 'top-center',
        });
      } else {
        await createGame({
          variables: {
            input: {
              ...data,
              date: date.toISOString(),
              teamId: routeKey,
              type: ActivityType.Game,
              location: 'HOME',
            },
          },
        });
        onClose();
        toast.success('Your Game has been successfully created', {
          ...toastStyling,
          position: 'top-center',
        });
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  if ((isViewMode || isEditMode) && !selectedActivity) return null;
  if (isCreateMode && !selectedDate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-md overflow-auto rounded-2xl border border-white/10 bg-linear-to-b from-slate-900/95 to-slate-950 shadow-[0_0_30px_rgba(0,0,0,0.35)]">
        <div className="relative flex items-center justify-between border-b border-white/10 bg-slate-900/60 px-4 py-3 text-white">
          <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-orange-500 via-amber-300 to-orange-500 opacity-80" />
          <h2 className="font-righteous text-lg font-normal sm:text-xl">
            {isViewMode
              ? selectedActivity?.title
              : isEditMode
                ? (selectedActivity?.title ?? 'Edit Game')
                : 'Create Game'}
          </h2>
          <Button
            onClick={onClose}
            className="border border-white/10 bg-transparent py-2 text-xl font-bold text-gray-300 shadow-none hover:bg-slate-900 hover:text-white"
            aria-label="Close Game Form"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {(isEditMode || isCreateMode) && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5">
            <Input
              id="title"
              aria-label="Input the name of the opponent team"
              className="border-white/10 bg-slate-900/70 text-white placeholder:text-gray-500"
              label="Opponent Name"
              labelColor="light"
              type="text"
              placeholder="E.g. Eagles FC"
              {...register('title')}
              error={errors.title}
              errorMessage={errors.title?.message}
            />
            <Input
              id="time"
              aria-label="Input the start time of the game"
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
              aria-label="Input the duration of the game in hours"
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
              aria-label="Input the date of the game"
              className="border-white/10 bg-slate-900/70 text-white"
              label="Date"
              labelColor="light"
              type="date"
              {...register('date')}
              error={errors.date}
              errorMessage={errors.date?.message}
            />
            <div className="flex justify-end border-t border-white/10 pt-5">
              {role && (
                <Button aria-label={buttonText} type="submit" variant="primary">
                  {buttonText}
                </Button>
              )}
            </div>
          </form>
        )}

        {isViewMode && selectedActivity && (
          <>
            <div className="space-y-3 p-5 text-sm text-white sm:text-base">
              <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3">
                <div className="text-xs tracking-wide text-gray-400 uppercase">
                  Type
                </div>
                <div className="inline-block rounded-full py-2 text-xs text-black">
                  <CategoryBadge
                    label={selectedActivity.type}
                    className={cn(getTypeBgColor(selectedActivity.type))}
                  />
                </div>
              </div>
              {selectedActivity.type == ActivityType.Practice && (
                <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3">
                  <div className="text-xs tracking-wide text-gray-400 uppercase">
                    Type of Practice
                  </div>
                  <div className="text-white/90">
                    {selectedActivity.practice?.practicetype}
                  </div>
                </div>
              )}
              <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3">
                <div className="text-xs tracking-wide text-gray-400 uppercase">
                  Time
                </div>
                <div className="text-white/90">{selectedActivity.time}</div>
              </div>
              {selectedActivity.duration && (
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
                <div className="text-white/90">
                  {format(
                    new Date(selectedActivity.date),
                    'EEEE, MMMM d, yyyy',
                  )}
                </div>
              </div>
            </div>
            {role && (
              <div className="flex justify-end space-x-2 border-t border-white/10 p-5">
                <Button
                  aria-label="Edit Game Form"
                  onClick={() => {
                    setFormState('edit');
                    reset({
                      title: selectedActivity.title,
                      time: selectedActivity.time,
                      duration: selectedActivity.duration ?? 2,
                      date: format(
                        new Date(selectedActivity.date),
                        'yyyy-MM-dd',
                      ),
                    });
                  }}
                  variant="outline"
                  className="border-white/20 bg-slate-900/80 hover:border-orange-300/40"
                >
                  Edit Game
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GameForm;
