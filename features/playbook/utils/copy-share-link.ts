'use client';

import { toastStyling } from '@/features/toast-notification/styling';
import { toast } from 'sonner';

// Same URL a team member already sees when they open this play — sharing it
// carries no auth or access change, it's just a copy-to-clipboard convenience.
export async function copyShareLink(routeKey: string, playId: string) {
  const url = `${window.location.origin}/team/${routeKey}/playbook/play/${playId}`;
  try {
    await navigator.clipboard.writeText(url);
    toast.success('Link copied', { ...toastStyling, position: 'top-right' });
  } catch {
    toast.error('Could not copy the link');
  }
}
