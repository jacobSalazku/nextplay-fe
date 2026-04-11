'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { positionOptions } from '../utils/constants';
import { JoinTeamFormData, joinTeamSchema } from '../zod';
import { useMutation } from '@apollo/client/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/helpers/utils';
import { JoinTeamDocument } from '@/graphql/graphql';
import { Button } from '@/components/foundation/button/button';
import { Input } from '@/components/foundation/input';
import { RadioGroup } from '@/components/foundation/radio/radio-group';
import { RadioGroupItem } from '@/components/foundation/radio/radio-group-item';

const JoinTeamForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinTeamFormData>({
    resolver: zodResolver(joinTeamSchema),
  });

  const [joinTeam] = useMutation(JoinTeamDocument);

  const onSubmit = async (data: JoinTeamFormData) => {
    startTransition(async () => {
      await joinTeam({
        variables: {
          input: {
            ...data,
          },
        },
      });
    });

    router.push('/');
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="teamCode"
        aria-label="Enter team code:"
        label="Enter team code:"
        type="text"
        {...register('teamCode')}
        error={errors.teamCode}
        errorMessage={errors.teamCode?.message}
      />
      <RadioGroup className="flex flex-row gap-4">
        {positionOptions.map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <RadioGroupItem
              value={option.value}
              id={`position-${option.value}`}
              {...register('position')}
              className={cn(
                'h-5 w-5 rounded-full border-2 border-gray-400 duration-150 ease-in-out focus:ring-2 focus:ring-gray-100',
                'transition-colors hover:border-gray-950 focus:outline-none data-[state=checked]:bg-gray-950',
              )}
            />
            <label
              htmlFor={`position-${option.value}`}
              className="text-sm text-gray-800"
            >
              {option.value}
            </label>
          </div>
        ))}
      </RadioGroup>
      <Input
        id="teamCode"
        aria-label="Enter Jersey Number:"
        label="Jersey Number"
        type="text"
        {...register('number')}
        error={errors.number}
        errorMessage={errors.number?.message}
      />
      <div className="space-2 flex w-full items-center justify-between py-4">
        <Button
          aria-label="Join team"
          type="submit"
          className="w-full py-5 text-sm hover:border-gray-950 hover:bg-gray-600 hover:text-white sm:w-1/3"
          disabled={isPending}
        >
          {isPending ? 'Joining...' : 'Join Team'}
        </Button>
      </div>
    </form>
  );
};

export { JoinTeamForm };
