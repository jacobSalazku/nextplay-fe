'use client';

import { useEffect, useState, type FC } from 'react';
import { useCreatePracticePreparation } from '../hooks/use-create-practice-preparation';
import { getCategoryColor } from '../utils/play-category-color';
import {
  practicePreparationSchema,
  type PracticePreparationData,
} from '../zod';
import { useTeam } from '@/context/team-context';
import { getButtonText } from '@/features/schedule/utils/button-text';
import { RichTextEditor } from '@/features/wysiwyg/text-editor';
import { useCoachDashboardStore } from '@/store/use-coach-dashboard-store';
import { cn } from '@/utils/tw-merge';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Clock, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Play, Practice } from '@/graphql/graphql';
import { Checkbox } from '@/components/card/checkbox';
import { Button } from '@/components/foundation/button/button';
import { CategoryBadge } from '@/components/foundation/category-badge';
import { Input } from '@/components/foundation/input';

export type Mode = 'view' | 'create';

type PageProps = {
  practices: Practice[];
  mode: Mode;
  role: string;
  playbook?: Play[];
};

const PracticePreparationForm: FC<PageProps> = ({
  practices,
  mode,
  role,
  playbook,
}) => {
  const { teamRef } = useTeam();
  const [selectedPractice, setSelectedPractice] = useState<string | null>(null);
  const [selectedPlay, setSelectedPlay] = useState<string[] | null>([]);
  const [formState] = useState<Mode>(mode);

  const { setOpenPracticePreparation, openPracticePreparation } =
    useCoachDashboardStore();

  const createPracticePreparation = useCreatePracticePreparation(
    () => setOpenPracticePreparation(false),
    () => {
      reset({
        name: '',
        notes: '',
        teamId: teamRef,
        activityId: '',
        playsId: [],
      });
      setSelectedPractice(null);
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
  } = useForm<PracticePreparationData>({
    resolver: zodResolver(practicePreparationSchema),
  });

  useEffect(() => {
    register('notes', { required: true });
    register('activityId', { required: true });
  }, [register]);

  const notesContent = watch('notes');
  const isCreateMode = formState === 'create';
  const isCoach = role === 'COACH';

  const buttonText = getButtonText(isSubmitting, formState, 'GamePlan');

  const handleGameSelection = (id: string) => {
    const isSelected = selectedPractice === id;
    setSelectedPractice(isSelected ? null : id);
    setValue('activityId', isSelected ? '' : id, {
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

  const onSubmit = async (data: PracticePreparationData) => {
    if (!data.activityId) {
      return;
    }
    const preparation = {
      name: data.name,
      notes: data.notes,
      activityId: data.activityId,
      playsId: data.playsId,
      focus: data.focus,
    };

    await createPracticePreparation.mutateAsync(preparation);
  };

  return (
    <>
      {openPracticePreparation && isCreateMode && (
        <div className="scroll bar fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/10 p-3 backdrop-blur-xs">
          <div className="flex w-full max-w-4xl items-center justify-between rounded-t-lg border border-b border-gray-800 bg-white px-4 py-3">
            <h2 className="font-righteous text-lg font-normal text-gray-950 sm:text-xl">
              Create Practice Preparation
            </h2>
            <Button
              className="bg-transparent py-2 text-xl font-bold text-gray-400 shadow-none hover:bg-gray-900 hover:text-white"
              aria-label="Close"
              onClick={() => {
                setOpenPracticePreparation(false);
                setSelectedPractice(null);
                setSelectedPlay([]);
                reset({
                  name: '',
                  notes: '',
                  teamId: teamRef,
                  activityId: '',
                  playsId: [],
                });
              }}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="scrollbar-none max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-b-lg border border-gray-800 bg-gray-950 px-3 text-white">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex w-full flex-col gap-2 px-2 py-3 lg:px-6"
            >
              <div className="sr-only">
                <Input
                  type="hidden"
                  id="teamId"
                  label="Team ID"
                  {...register('teamId')}
                  placeholder="Enter team ID"
                  defaultValue={teamRef}
                />
              </div>
              <Input
                id="name"
                aria-label="Input the name op the preparation"
                className="border-gray-700"
                label="Preparation Name"
                labelColor="light"
                type="text"
                placeholder="E.g. Eagles FC"
                {...register('name')}
                error={errors.name}
                errorMessage={errors.name?.message}
              />
              <Input
                id="focus"
                aria-label="Input the focus of the practice"
                className="border-gray-700"
                label="Focus"
                labelColor="light"
                type="text"
                placeholder="E.g. Eagles FC"
                {...register('focus')}
                error={errors.focus}
                errorMessage={errors.focus?.message}
              />
              <div className="flex w-full flex-row gap-4 pt-2 text-sm">
                <div className="flex w-full flex-col gap-2">
                  <label>Connect to Practice</label>
                  <div
                    className={cn(
                      errors.activityId?.message
                        ? 'border-red-800 focus:ring-1 focus:ring-gray-500'
                        : 'border-gray-700 focus:ring-1 focus:ring-gray-500',
                      'scrollbar-none flex h-48 max-h-48 w-full flex-col gap-2 overflow-y-auto rounded-lg border p-3',
                    )}
                  >
                    <input type="hidden" {...register('activityId')} />

                    {practices && practices.length > 0 && (
                      <>
                        {practices.map((practice) => (
                          <div
                            key={practice.activityId}
                            className={`cursor-pointer rounded-lg border border-gray-700 p-3 text-white transition-colors ${
                              selectedPractice === practice.activityId
                                ? 'border-gray-950 bg-gray-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() =>
                              handleGameSelection(practice.activityId)
                            }
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className={cn(
                                  selectedPractice === practice.activityId
                                    ? 'text-gray-900'
                                    : '',
                                )}
                              >
                                {practice.title}
                              </span>
                              <span
                                className={cn(
                                  selectedPractice === practice.activityId
                                    ? 'text-gray-900'
                                    : 'text-gray-400',
                                  'text-xs',
                                )}
                              >
                                {format(
                                  new Date(practice.date),
                                  'MMMM d, yyyy',
                                )}
                              </span>
                            </div>
                            <div
                              className={cn(
                                selectedPractice === practice.activityId
                                  ? 'text-gray-900'
                                  : 'text-gray-400',
                              )}
                            >
                              <Clock className="mr-1 inline h-4 w-4" />
                              {practice.time}
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
                  <label>Select play</label>
                  <div className="scrollbar-none flex h-48 max-h-48 w-full flex-col gap-2 overflow-y-auto rounded-lg border border-gray-700 p-3">
                    {playbook && playbook.length > 0 && (
                      <>
                        {playbook.map((play) => (
                          <div
                            key={play.id}
                            className={cn(
                              selectedPlay?.includes(play.id)
                                ? 'bg-gray-800'
                                : '',
                              'flex w-full cursor-pointer flex-row items-center justify-between rounded-lg px-3 py-1.5 text-white transition-colors hover:bg-gray-700',
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
                <label>Select play</label>
                <div className="scrollbar-none flex h-48 max-h-36 w-full flex-col gap-2 overflow-y-auto rounded-lg border border-gray-700 p-3">
                  {playbook && playbook.length > 0 && (
                    <>
                      {playbook.map((play) => (
                        <div
                          key={play.id}
                          className={cn(
                            selectedPlay?.includes(play.id)
                              ? 'bg-gray-800'
                              : '',
                            'flex w-full cursor-pointer flex-row items-center justify-between rounded-lg px-3 py-1.5 text-white transition-colors hover:bg-gray-700',
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
                  className="max-h-96 w-full max-w-full"
                  content={notesContent ?? ''}
                  onChange={(content) =>
                    setValue('notes', content, { shouldValidate: true })
                  }
                />
              </div>
              <div className="bg-g flex justify-end border-t border-gray-800 pt-4">
                {isCoach && (
                  <Button
                    aria-label="Submit Practice Preparation"
                    type="submit"
                    variant="outline"
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

export default PracticePreparationForm;
