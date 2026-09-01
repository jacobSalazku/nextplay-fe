'use client';

import { signOut } from 'next-auth/react';
import { useConfirmedAction } from '@/components/feedback/confirm-provider';

export function useLogout() {
  return useConfirmedAction(() => signOut({ callbackUrl: '/login' }), {
    title: 'Log out?',
    description: "You'll be signed out and returned to the login page.",
    confirmLabel: 'Log out',
  });
}
