import { z } from 'zod';

export const playSchema = z.object({
  name: z.string().min(1, 'Play name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  canvas: z.string().min(1, 'Canvas data is required'),
});

export type Play = z.infer<typeof playSchema>;

export const newPlaySchema = z.object({
  court: z.enum(['half', 'full']),
  // '' means "empty court" — no preset
  formationId: z.string(),
});

export type NewPlayData = z.infer<typeof newPlaySchema>;

export const gamePlanSchema = z.object({
  name: z.string().min(1, 'title is required').max(35),
  opponent: z.string().optional(),
  notes: z.string(),
  activityId: z.string().min(1, 'Selecting Game is required'),
  playsId: z.array(z.string()),
  teamId: z.string(),
});

export type GamePlanData = z.infer<typeof gamePlanSchema>;

export const practicePreparationSchema = z.object({
  name: z.string().min(1, 'title is required').max(35),
  focus: z.string().min(1, 'Focus is required'),
  notes: z.string(),
  activityId: z.string().min(1, 'Please select a practice'),
  teamId: z.string(),
  playsId: z.array(z.string()),
});

export type PracticePreparationData = z.infer<typeof practicePreparationSchema>;
