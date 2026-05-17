import { useRouter } from 'next/navigation';
import { toastStyling } from '@/features/toast-notification/styling';
import { useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
import { DeletePracticePreparationDocument } from '@/graphql/graphql';

type DeletePracticePreparationPayload = {
  teamRef: string;
  practicePreparationId: string;
};

export const useDeletePracticePreparation = (teamRef: string) => {
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
            teamRef: payload.teamRef,
            practicePreparationId: payload.practicePreparationId,
          },
        },
        refetchQueries: ['GetPracticePreparations'],
      });

      toast.success('Preparation has been deleted', {
        position: 'top-right',
        ...toastStyling,
      });

      router.push(`/team/${teamRef}/playbook`);
      router.refresh();
    },
  };
};
