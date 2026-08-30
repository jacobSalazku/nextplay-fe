'use client';

import { useRouter } from 'next/navigation';
import { CreateTeamData, createTeamSchema } from '../zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { gqlRequest } from '@/lib/graphql/client-request';
import { CreateTeamDocument } from '@/graphql/graphql';
import { Button } from '@/components/foundation/button/button';
import { Input } from '@/components/foundation/input';

const CreateTeamForm = () => {
  const { mutateAsync: createTeam } = useMutation({
    mutationFn: (input: CreateTeamData) =>
      gqlRequest(CreateTeamDocument, { input }),
    meta: { skipGlobalErrorToast: true },
  });
  const { update } = useSession();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateTeamData>({
    resolver: zodResolver(createTeamSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: CreateTeamData) => {
    try {
      await createTeam(data);

      await update({ hasOnBoarded: true });
      router.replace('/club');
      router.refresh();
    } catch (error: unknown) {
      setError('root', {
        type: 'server',
        message:
          error instanceof Error ? error.message : 'Failed to create team',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full sm:w-1/2">
      <div className="mb-4">
        <Input
          id="name"
          label="Team Name"
          type="text"
          {...register('name')}
          error={errors.name}
          errorMessage={errors.name?.message}
        />
      </div>
      <div className="mb-4">
        <Input
          id="ageGroup"
          label="Age group"
          type="text"
          {...register('ageGroup')}
          error={errors.ageGroup}
          errorMessage={errors.ageGroup?.message}
        />
      </div>

      {errors.root?.message ? (
        <p className="mb-4 text-sm text-red-500">{errors.root.message}</p>
      ) : null}

      <div className="flex items-center justify-between py-4">
        <Button
          className="w-full py-5 text-sm hover:border-gray-950 hover:bg-gray-600 hover:text-white sm:w-1/3"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Team'}
        </Button>
      </div>
    </form>
  );
};

export default CreateTeamForm;
