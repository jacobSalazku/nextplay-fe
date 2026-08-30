import { useRouter } from 'next/navigation';
import { useTeam } from '@/context/team-context';
import { toastStyling } from '@/features/toast-notification/styling';
import { useCoachDashboardStore } from '@/store/use-coach-dashboard-store';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { gqlRequest } from '@/lib/graphql/client-request';
import { CreatePracticePreparationDocument } from '@/graphql/graphql';

type CreatePracticePreparationPayload = {
  name: string;
  focus: string;
  notes: string;
  activityId: string;
  playsId: string[];
};

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
        input: {
          routeKey,
          name: payload.name,
          focus: payload.focus,
          notes: payload.notes,
          activityId: payload.activityId,
          playsId: payload.playsId,
        },
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
    onError: (error) => {
      toast.error(error.message, { ...toastStyling, position: 'top-right' });
    },
  });

  return { isPending, mutateAsync };
};
