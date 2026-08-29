import { AcceptTeamInviteStatus } from '@/graphql/graphql';

type TeamInviteStatusCopy = {
  title: string;
  description: string;
  variant: 'success' | 'warning';
};

export const teamInviteStatusCopy: Record<
  AcceptTeamInviteStatus,
  TeamInviteStatusCopy
> = {
  SUCCESS: {
    title: 'You joined the team',
    description: 'The invite was accepted and your membership is now active.',
    variant: 'success',
  },
  ALREADY_JOINED: {
    title: 'Already on this team',
    description: 'Your account is already an active member of this team.',
    variant: 'success',
  },
  EXPIRED: {
    title: 'Invite expired',
    description: 'Ask your coach for a fresh invite link.',
    variant: 'warning',
  },
  REVOKED: {
    title: 'Invite revoked',
    description: 'This invite was disabled by the team coach.',
    variant: 'warning',
  },
  USED: {
    title: 'Invite already used',
    description: 'This single-use invite has already been accepted.',
    variant: 'warning',
  },
};
