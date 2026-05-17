'use client';

import { useEffect, useState, type FC } from 'react';
import { useCreateGameplan } from '../hooks/use-create-gameplan';
import { getCategoryColor } from '../utils/play-category-color';
import { gamePlanSchema, type GamePlanData } from '../zod';
import { useTeam } from '@/context/team-context';
import { getButtonText } from '@/features/schedule/utils/button-text';
import { toastStyling } from '@/features/toast-notification/styling';
import { RichTextEditor } from '@/features/wysiwyg/text-editor';
import { useCoachDashboardStore } from '@/store/use-coach-dashboard-store';
import { cn } from '@/utils/tw-merge';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Clock, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Play, type GetGamesQuery } from '@/graphql/graphql';
import { Checkbox } from '@/components/card/checkbox';
import { Button } from '@/components/foundation/button/button';
import { CategoryBadge } from '@/components/foundation/category-badge';
import { Input } from '@/components/foundation/input';

export type Mode = 'view' | 'create';
type GameActivity = GetGamesQuery['getGames'][number];

type GamePlanFormProps = {
  data: GameActivity[];
  mode: Mode;
  role: string;
  playbook?: Play[];
};

const GamePlanForm: FC<GamePlanFormProps> = ({
  data,
  mode,
  role,
  playbook,
}) => {
  const { routeKey } = useTeam();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedPlay, setSelectedPlay] = useState<string[] | null>([]);
  const [formState] = useState<Mode>(mode);
  const {
    openGamePlan,
    setOpenGamePlan,
    setGamePlanMode,
    setSelectedGameplan,
  } = useCoachDashboardStore();

  const createGameplan = useCreateGameplan(
    routeKey,
    () => setOpenGamePlan(false),
    () => {
      reset({
        name: '',
        notes: '',
        teamId: routeKey,
        activityId: '',
        opponent: '',
        playsId: [],
      });
      setSelectedGame(null);
      setSelectedPlay([]);
    },
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GamePlanData>({
    resolver: zodResolver(gamePlanSchema),
  });

  useEffect(() => {
    register('notes', { required: true });
  }, [register]);

  const notesContent = watch('notes');
  const isCreateMode = formState === 'create';
  const isCoach = role === 'COACH';

  const buttonText = getButtonText(isSubmitting, formState, 'GamePlan');

  const handleGameSelection = (data: GameActivity) => {
    const isSelected = selectedGame === data.id;
    const opponentName = data.game?.opponentStatline?.name ?? data.game?.title;

    setSelectedGame(isSelected ? null : data.id);
    setValue('opponent', isSelected ? '' : opponentName, {
      shouldValidate: true,
    });
    setValue('activityId', isSelected ? '' : data.id, {
      shouldValidate: true,
    });
  };

  const handlePlaySelection = (play: Play) => {
    setSelectedPlay((prev) => {
      const updated = prev?.includes(play.id)
        ? prev.filter((id) => id !== play.id)
        : [...(prev ?? []), play.id];

      setValue('playsId', updated, { shouldValidate: true });

      return updated;
    });
  };

  const onSubmit = async (data: GamePlanData) => {
    if (!data.activityId) {
      toast.error('Please select a game to connect the game plan.', {
        ...toastStyling,
        position: 'top-right',
      });
      return;
    }

    const gamePlan = {
      name: data.name,
      notes: data.notes,
      activityId: data.activityId,
      opponent: data.opponent ?? '',
      playsId: data.playsId,
    };

    await createGameplan.mutateAsync(gamePlan);
  };

  return (
    <>
      {openGamePlan && isCreateMode && (
        <div className="scroll bar fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 p-3 backdrop-blur-sm">
          <div className="relative flex w-full max-w-4xl items-center justify-between rounded-t-xl border border-white/10 border-b-white/20 bg-linear-to-b from-slate-900 to-slate-950 px-4 py-3">
            <div className="absolute top-0 left-0 h-1 w-full rounded-t-xl bg-linear-to-r from-orange-500 via-amber-300 to-orange-500 opacity-80" />
            <h2 className="font-righteous text-lg font-normal text-white sm:text-xl">
              Create GamePlan
            </h2>
            <Button
              className="border border-white/10 bg-transparent py-2 text-xl font-bold text-white/70 shadow-none hover:bg-slate-800 hover:text-white"
              aria-label="Close"
              onClick={() => {
                setOpenGamePlan(false);
                setGamePlanMode('view');
                setSelectedGameplan(null);
                setSelectedGame(null);
                setSelectedPlay([]);
                reset({
                  name: '',
                  notes: '',
                  teamId: routeKey,
                  activityId: '',
                  opponent: '',
                  playsId: [],
                });
              }}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="scrollbar-none max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-b-xl border border-white/10 border-t-0 bg-linear-to-b from-slate-900/95 to-slate-950 px-3 text-white">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex w-full flex-col gap-3 px-2 py-4 lg:px-6"
            >
              <div className="sr-only">
                <Input
                  id="teamId"
                  label="Team ID"
                  {...register('teamId')}
                  placeholder="Enter team ID"
                  defaultValue={routeKey}
                />
              </div>
              <Input
                id="name"
                aria-label="Input the name the gameplan"
                className="border-white/10 bg-slate-900/70"
                label="Gameplan Name"
                labelColor="light"
                type="text"
                placeholder="E.g. Eagles FC"
                {...register('name')}
                error={errors.name}
                errorMessage={errors.name?.message}
              />
              <div className="flex w-full flex-row gap-4 pt-2 text-sm">
                <div className="flex w-full flex-col gap-2">
                  <label className="text-sm uppercase tracking-wide text-white/70">
                    Connect to Game
                  </label>
                  <div
                    className={cn(
                      errors.activityId?.message || errors.opponent?.message
                        ? 'border-red-700/70 ring-1 ring-red-700/30'
                        : 'border-white/10',
                      'scrollbar-none flex h-48 max-h-48 w-full flex-col gap-2 overflow-y-auto rounded-xl border bg-slate-900/60 p-3',
                    )}
                  >
                    <input type="hidden" {...register('activityId')} />
                    <input type="hidden" {...register('opponent')} />
                    {data && data.length > 0 && (
                      <>
                        {data.map((a) => (
                          <div
                            key={a.id}
                            className={`cursor-pointer rounded-xl border p-3 font-bold text-white transition-colors ${
                              selectedGame === a.id
                                ? 'border-orange-300/50 bg-slate-800/90'
                                : 'border-white/10 bg-slate-900/60 hover:border-orange-300/40'
                            }`}
                            onClick={() => handleGameSelection(a)}
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className={cn(
                                  selectedGame === a.id ? 'text-white' : '',
                                )}
                              >
                                vs {a.game?.opponentStatline?.name}
                              </span>
                              <span
                                className={cn(
                                  selectedGame === a.id
                                    ? 'text-white/90'
                                    : 'text-white/50',
                                  'text-xs',
                                )}
                              >
                                {format(new Date(a.date), 'MMMM d, yyyy')}
                              </span>
                            </div>
                            <div
                              className={cn(
                                selectedGame === a.id
                                  ? 'text-white/90'
                                  : 'text-white/60',
                              )}
                            >
                              <Clock className="mr-1 inline h-4 w-4" />
                              {a.time}
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                  <span className="text-red-700">
                    {errors.activityId?.message}
                  </span>
                </div>
                <div className="hidden w-full flex-col gap-2 md:flex">
                  <label className="text-sm uppercase tracking-wide text-white/70">
                    Select play
                  </label>
                  <div className="scrollbar-none flex h-48 max-h-48 w-full flex-col gap-2 overflow-y-auto rounded-xl border border-white/10 bg-slate-900/60 p-3">
                    {playbook && playbook.length > 0 && (
                      <>
                        {playbook.map((play) => (
                          <div
                            key={play.id}
                            className={cn(
                              selectedPlay?.includes(play.id)
                                ? 'border border-orange-300/40 bg-slate-800'
                                : '',
                              'flex w-full cursor-pointer flex-row items-center justify-between rounded-lg px-3 py-1.5 text-white transition-colors hover:bg-slate-800/80',
                            )}
                            onClick={() => handlePlaySelection(play)}
                          >
                            <Checkbox
                              label={play.name}
                              onCheckedChange={() => handlePlaySelection(play)}
                              checked={selectedPlay?.includes(play.id)}
                              tabIndex={-1}
                              aria-label={`Select play ${play.name}`}
                              className="mr-2"
                            >
                              <CategoryBadge
                                label={play.category}
                                className={cn(getCategoryColor(play.category))}
                              />
                            </Checkbox>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col gap-2 md:hidden">
                <label className="text-sm uppercase tracking-wide text-white/70">
                  Select play
                </label>
                <div className="scrollbar-none flex h-48 max-h-36 w-full flex-col gap-2 overflow-y-auto rounded-xl border border-white/10 bg-slate-900/60 p-3">
                  {playbook && playbook.length > 0 && (
                    <>
                      {playbook.map((play) => (
                        <div
                          key={play.id}
                          className={cn(
                            selectedPlay?.includes(play.id)
                              ? 'border border-orange-300/40 bg-slate-800'
                              : '',
                            'flex w-full cursor-pointer flex-row items-center justify-between rounded-lg px-3 py-1.5 text-white transition-colors hover:bg-slate-800/80',
                          )}
                          onClick={() => handlePlaySelection(play)}
                        >
                          <Checkbox
                            label={play.name}
                            onCheckedChange={() => handlePlaySelection(play)}
                            checked={selectedPlay?.includes(play.id)}
                            tabIndex={-1}
                            aria-label={`Select play ${play.name}`}
                            className="mr-2 border"
                          >
                            <CategoryBadge
                              label={play.category}
                              className={cn(getCategoryColor(play.category))}
                            />
                          </Checkbox>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>

              <div>
                <RichTextEditor
                  label="Explain Game Plan"
                  className="max-h-96 w-full max-w-full border-white/10"
                  content={notesContent ?? ''}
                  onChange={(content) =>
                    setValue('notes', content, { shouldValidate: true })
                  }
                />
              </div>
              <div className="bg-g flex justify-end border-t border-white/10 pt-4">
                {isCoach && (
                  <Button
                    aria-label="Submit Game Plan"
                    type="submit"
                    variant="primary"
                    className="min-w-44"
                  >
                    {buttonText}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default GamePlanForm;
