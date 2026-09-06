'use client';

import { CourtDiagram } from '@/features/playbook/components/diagram/court-diagram';
import { useCreatePlay } from '@/features/playbook/hooks/play/use-create-play';
import type { CourtType } from '@/features/playbook/utils/diagram/types';
import {
  seedDiagram,
  toFormationObjects,
} from '@/features/playbook/utils/editor/seed-diagram';
import { newPlaySchema, type NewPlayData } from '@/features/playbook/zod';
import { cn } from '@/utils/tw-merge';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Category } from '@/graphql/graphql';
import { Button } from '@/components/foundation/button/button';

// Loose on purpose: `court` widens from the codegen enum to our string union,
// `objects` is the JSON scalar. Coerced through toFormationObjects on use.
type Formation = {
  id: string;
  name: string;
  court: CourtType;
  objects: unknown;
};

// category is chosen later, in the editor — seed a provisional value the
// backend accepts at creation
const DEFAULT_CATEGORY = Category.Offensive;

const COURTS: { value: CourtType; label: string }[] = [
  { value: 'half', label: 'Half court' },
  { value: 'full', label: 'Full court' },
];

export function NewPlaySetup({
  routeKey,
  formations,
}: {
  routeKey: string;
  formations: Formation[];
}) {
  const { createPlay, isCreating } = useCreatePlay(routeKey);

  const { handleSubmit, control, setValue } = useForm<NewPlayData>({
    resolver: zodResolver(newPlaySchema),
    defaultValues: { court: 'half', formationId: '' },
  });

  const court = useWatch({ control, name: 'court' });
  const courtFormations = formations.filter((f) => f.court === court);

  const onSubmit = async (data: NewPlayData) => {
    const preset = formations.find((f) => f.id === data.formationId);
    const objects = toFormationObjects(preset?.objects);

    // global MutationCache toasts failures; catch to keep the form usable
    await createPlay({
      name: 'New play',
      description: '',
      category: DEFAULT_CATEGORY,
      diagram: seedDiagram(data.court, objects),
    }).catch(() => {});
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-8 p-4 sm:p-6"
    >
      <p className="text-sm text-gray-400">
        Pick a court and a starting formation. You can move players, name the
        play and set its category once the editor opens.
      </p>

      <Fieldset label="Court">
        <Controller
          name="court"
          control={control}
          render={({ field }) => (
            <OptionRow
              options={COURTS}
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                // a formation belongs to one court — re-pick it
                setValue('formationId', '');
              }}
            />
          )}
        />
      </Fieldset>

      <Fieldset label="Formation">
        <Controller
          name="formationId"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              <FormationOption
                name="Empty court"
                court={court}
                selected={field.value === ''}
                onSelect={() => field.onChange('')}
              />
              {courtFormations.map((formation) => (
                <FormationOption
                  key={formation.id}
                  name={formation.name}
                  court={formation.court}
                  objects={toFormationObjects(formation.objects)}
                  selected={field.value === formation.id}
                  onSelect={() => field.onChange(formation.id)}
                />
              ))}
            </div>
          )}
        />
      </Fieldset>

      <Button type="submit" variant="primary" size="full" disabled={isCreating}>
        {isCreating ? 'Creating…' : 'Create play'}
      </Button>
    </form>
  );
}

function Fieldset({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-xs font-semibold tracking-wide text-gray-300 uppercase">
        {label}
      </legend>
      {children}
    </fieldset>
  );
}

function OptionRow<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T | undefined;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-lg border px-4 py-2 text-sm transition',
            value === option.value
              ? 'border-orange-300/50 bg-orange-500/15 text-white'
              : 'border-white/10 bg-slate-900/60 text-gray-200 hover:border-orange-300/40',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function FormationOption({
  name,
  court,
  objects = [],
  selected,
  onSelect,
}: {
  name: string;
  court: CourtType;
  objects?: ReturnType<typeof toFormationObjects>;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'flex flex-col gap-2 rounded-xl border p-2 text-left transition',
        selected
          ? 'border-orange-300/60 bg-orange-500/10'
          : 'border-white/10 bg-slate-900/60 hover:border-orange-300/40',
      )}
    >
      <CourtDiagram
        court={court}
        phase={{ id: 'preview', objects, actions: [] }}
        className="w-full rounded-lg"
      />
      <span className="text-xs font-medium text-gray-200">{name}</span>
    </button>
  );
}
