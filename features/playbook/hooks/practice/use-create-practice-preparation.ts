import { useRouter } from 'next/navigation';
import { useTeam } from '@/context/team-context';
import { toastStyling } from '@/features/toast-notification/styling';
import { useCoachDashboardStore } from '@/store/use-coach-dashboard-store';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { gqlRequest } from '@/lib/graphql/client-request';
import {
  CreatePracticePreparationDocument,
  type CreatePracticePreparationInput,
} from '@/graphql/graphql';

type CreatePracticePreparationPayload = Omit<
  CreatePracticePreparationInput,
  'routeKey'
>;

export const useCreatePracticePreparation = (
  onClose: () => void,
  resetForm: () => void,
) => {
  const { routeKey } = useTeam();
  const router = useRouter();
  const { setActiveCoachTab } = useCoachDashboardStore();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: CreatePracticePreparationPayload) =>
      gqlRequest(CreatePracticePreparationDocument, {
        input: { routeKey, ...payload },
      }),
    onSuccess: () => {
      setActiveCoachTab('practice');
      onClose();
      resetForm();
      router.refresh();
      toast.success('Your practice preparation has been successfully created', {
        ...toastStyling,
        position: 'top-right',
      });
    },
  });

  return { isPending, mutateAsync };
};
