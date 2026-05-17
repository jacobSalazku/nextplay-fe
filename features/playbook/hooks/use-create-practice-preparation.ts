import { useRouter } from 'next/navigation';
import { useTeam } from '@/context/team-context';
import { toastStyling } from '@/features/toast-notification/styling';
import { useCoachDashboardStore } from '@/store/use-coach-dashboard-store';
import { useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
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
  const { teamRef } = useTeam();
  const router = useRouter();
  const { setActiveCoachTab } = useCoachDashboardStore();
  const [createPreparation, { loading }] = useMutation(
    CreatePracticePreparationDocument,
  );

  return {
    isPending: loading,
    mutateAsync: async (payload: CreatePracticePreparationPayload) => {
      try {
        await createPreparation({
          variables: {
            input: {
              teamRef,
              name: payload.name,
              focus: payload.focus,
              notes: payload.notes,
              activityId: payload.activityId,
              playsId: payload.playsId,
            },
          },
          refetchQueries: ['GetPracticePreparations'],
        });

        setActiveCoachTab('practice');
        onClose();
        resetForm();
        router.refresh();

        toast.success(
          'Your practice preparation has been successfully created',
          {
            ...toastStyling,
            position: 'top-right',
          },
        );
      } catch {
        toast.error(
          'Failed to create practice preparation. Please try again.',
          {
            ...toastStyling,
            position: 'top-right',
          },
        );
      }
    },
  };
};
