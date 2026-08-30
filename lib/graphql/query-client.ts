'use client';

import { toastStyling } from '@/features/toast-notification/styling';
import { MutationCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      /** Opt out of the global error toast — for mutations that render their
       *  own error UI (inline form errors, a status card, a background autosave). */
      skipGlobalErrorToast?: boolean;
    };
  }
}

/**
 * The app's QueryClient. Every mutation failure is logged and toasted from the
 * shared `MutationCache`, unless the mutation sets
 * `meta: { skipGlobalErrorToast: true }`.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        console.error(error);
        if (mutation.meta?.skipGlobalErrorToast) return;
        toast.error(
          error instanceof Error ? error.message : 'Something went wrong',
          { ...toastStyling, position: 'top-right' },
        );
      },
    }),
  });
}
