'use client';

import { toastStyling } from '@/features/toast-notification/styling';
import { MutationCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

/**
 * The app's QueryClient. Every mutation failure is logged and toasted from the
 * shared `MutationCache`, so individual `useMutation` calls only add an
 * `onError` when they need something extra.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    mutationCache: new MutationCache({
      onError: (error) => {
        console.error(error);
        toast.error(
          error instanceof Error ? error.message : 'Something went wrong',
          { ...toastStyling, position: 'top-right' },
        );
      },
    }),
  });
}
