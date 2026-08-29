import { z } from 'zod';

export const createTeamSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Team name must be at least 3 characters.' }),
  image: z.string().optional(),
  ageGroup: z.string().min(1, 'Age group is required'),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  phone: z.string().min(1, 'Phone number is required'),
  height: z.coerce.number({ required_error: 'Height is required' }),
  weight: z.coerce.number({ required_error: 'Weight is required' }),
  dominantHand: z.string().min(1, 'Dominant hand is required'),
});

export type CreateTeamData = z.infer<typeof createTeamSchema>;

export type UpdateUserData = z.infer<typeof updateUserSchema>;
