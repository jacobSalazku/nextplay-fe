import { z } from 'zod';

export const teamInviteTokenSchema = z.string().trim().min(1);

export type TeamInviteToken = z.infer<typeof teamInviteTokenSchema>;
