import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { gqlRequest } from '@/lib/graphql/client-request';
import { CreatePlayDocument, type CreatePlayInput } from '@/graphql/graphql';

type CreatePlayPayload = Omit<CreatePlayInput, 'routeKey'>;

export const useCreatePlay = (routeKey: string) => {
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: CreatePlayPayload) =>
      gqlRequest(CreatePlayDocument, { input: { routeKey, ...payload } }),
    onSuccess: ({ createPlay }) => {
      router.push(`/team/${routeKey}/playbook/play/${createPlay.id}/edit`);
    },
  });

  return { createPlay: mutateAsync, isCreating: isPending };
};
