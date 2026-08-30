import { useRouter } from 'next/navigation';
import { toastStyling } from '@/features/toast-notification/styling';
import { useCoachDashboardStore } from '@/store/use-coach-dashboard-store';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { gqlRequest } from '@/lib/graphql/client-request';
import {
  CreateGamePlanDocument,
  type CreateGamePlanInput,
} from '@/graphql/graphql';

type CreateGamePlanPayload = Omit<CreateGamePlanInput, 'routeKey'>;

export const useCreateGameplan = (
  routeKey: string,
  onClose: () => void,
  resetForm: () => void,
) => {
  const router = useRouter();
  const { setActiveCoachTab } = useCoachDashboardStore();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: CreateGamePlanPayload) =>
      gqlRequest(CreateGamePlanDocument, { input: { routeKey, ...payload } }),
    onSuccess: () => {
      setActiveCoachTab('gameplan');
      onClose();
      resetForm();
      router.refresh();
      toast.success('Your gameplan has been successfully created', {
        ...toastStyling,
        position: 'top-right',
      });
    },
  });

  return { isPending, mutateAsync };
};
