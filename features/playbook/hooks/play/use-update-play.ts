import { useRouter } from 'next/navigation';
import type { PlayDiagram } from '@/features/playbook/utils/diagram/types';
import { toastStyling } from '@/features/toast-notification/styling';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { gqlRequest } from '@/lib/graphql/client-request';
import { UpdatePlayDocument, type Category } from '@/graphql/graphql';

export const useUpdatePlay = (routeKey: string, id: string) => {
  const router = useRouter();

  const save = useMutation({
    mutationFn: (diagram: PlayDiagram) =>
      gqlRequest(UpdatePlayDocument, { input: { id, routeKey, diagram } }),
    onSuccess: () => {
      router.refresh();
      toast.success('Play saved', { ...toastStyling, position: 'top-right' });
    },
  });

  const rename = useMutation({
    mutationFn: (name: string) =>
      gqlRequest(UpdatePlayDocument, { input: { id, routeKey, name } }),
    onSuccess: () => router.refresh(),
  });

  const categorise = useMutation({
    mutationFn: (category: Category) =>
      gqlRequest(UpdatePlayDocument, { input: { id, routeKey, category } }),
    onSuccess: () => router.refresh(),
  });

  return {
    savePlay: save.mutateAsync,
    isSaving: save.isPending,
    renamePlay: rename.mutateAsync,
    setPlayCategory: categorise.mutateAsync,
  };
};
