import { useRouter } from 'next/navigation';
import { toastStyling } from '@/features/toast-notification/styling';
import { useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
import { DeletePracticePreparationDocument } from '@/graphql/graphql';

type DeletePracticePreparationPayload = {
  teamId: string;
  gamePlanId: string;
};

export const useDeletePracticePreparation = (teamId: string) => {
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
            teamRef: payload.teamId,
            practicePreparationId: payload.gamePlanId,
          },
        },
        refetchQueries: ['GetPracticePreparations'],
      });

      toast.success('Preparation has been deleted', {
        position: 'top-right',
        ...toastStyling,
      });

      router.push(`/${teamId}/playbook-library`);
      router.refresh();
    },
  };
};
