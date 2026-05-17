import { useRouter } from 'next/navigation';
import { toastStyling } from '@/features/toast-notification/styling';
import { useCoachDashboardStore } from '@/store/use-coach-dashboard-store';
import { useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
import { CreateGamePlanDocument } from '@/graphql/graphql';

type CreateGamePlanPayload = {
  name: string;
  opponent: string;
  notes: string;
  activityId: string;
  playsId: string[];
};

export const useCreateGameplan = (
  routeKey: string,
  onClose: () => void,
  resetForm: () => void,
) => {
  const router = useRouter();
  const { setActiveCoachTab } = useCoachDashboardStore();
  const [createGameplan, { loading }] = useMutation(CreateGamePlanDocument);

  return {
    isPending: loading,
    mutateAsync: async (payload: CreateGamePlanPayload) => {
      try {
        await createGameplan({
          variables: {
            input: {
              routeKey,
              name: payload.name,
              opponent: payload.opponent,
              notes: payload.notes,
              activityId: payload.activityId,
              playsId: payload.playsId,
            },
          },
          refetchQueries: ['GetGameplan'],
        });

        setActiveCoachTab('gameplan');
        onClose();
        resetForm();
        router.refresh();

        toast.success('Your gameplan has been successfully created', {
          ...toastStyling,
          position: 'top-right',
        });
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to create gameplan. Please try again.';

        toast.error(message, {
          ...toastStyling,
          position: 'top-right',
        });
      }
    },
  };
};
