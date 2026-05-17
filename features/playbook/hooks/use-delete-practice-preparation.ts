import { useRouter } from 'next/navigation';
import { toastStyling } from '@/features/toast-notification/styling';
import { useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
import { DeletePracticePreparationDocument } from '@/graphql/graphql';

type DeletePracticePreparationPayload = {
  routeKey: string;
  practicePreparationId: string;
};

export const useDeletePracticePreparation = (routeKey: string) => {
  const router = useRouter();
  const [runDelete, { loading }] = useMutation(
    DeletePracticePreparationDocument,
  );

  return {
    isPending: loading,
    mutateAsync: async (payload: DeletePracticePreparationPayload) => {
      await runDelete({
        variables: {
          input: {
            routeKey: payload.routeKey,
            practicePreparationId: payload.practicePreparationId,
          },
        },
        refetchQueries: ['GetPracticePreparations'],
      });

      toast.success('Preparation has been deleted', {
        position: 'top-right',
        ...toastStyling,
      });

      router.push(`/team/${routeKey}/playbook`);
      router.refresh();
    },
  };
};
