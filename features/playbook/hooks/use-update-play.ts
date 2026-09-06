import { useRouter } from 'next/navigation';
import type { PlayDiagram } from '@/features/playbook/diagram/types';
import { toastStyling } from '@/features/toast-notification/styling';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { gqlRequest } from '@/lib/graphql/client-request';
import { UpdatePlayDocument } from '@/graphql/graphql';

export const useUpdatePlay = (routeKey: string, id: string) => {
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (diagram: PlayDiagram) =>
      gqlRequest(UpdatePlayDocument, { input: { id, routeKey, diagram } }),
    onSuccess: () => {
      router.refresh();
      toast.success('Play saved', {
        ...toastStyling,
        position: 'top-right',
      });
    },
  });

  return { savePlay: mutateAsync, isSaving: isPending };
};
