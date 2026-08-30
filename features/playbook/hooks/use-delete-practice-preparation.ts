import { useRouter } from 'next/navigation';
import { toastStyling } from '@/features/toast-notification/styling';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { gqlRequest } from '@/lib/graphql/client-request';
import { DeletePracticePreparationDocument } from '@/graphql/graphql';

type DeletePracticePreparationPayload = {
  routeKey: string;
  practicePreparationId: string;
};

export const useDeletePracticePreparation = (routeKey: string) => {
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: DeletePracticePreparationPayload) =>
      gqlRequest(DeletePracticePreparationDocument, {
        input: {
          routeKey: payload.routeKey,
          practicePreparationId: payload.practicePreparationId,
        },
      }),
    onSuccess: () => {
      toast.success('Preparation has been deleted', {
        ...toastStyling,
        position: 'top-right',
      });
      router.push(`/team/${routeKey}/playbook`);
      router.refresh();
    },
  });

  return { isPending, mutateAsync };
};
