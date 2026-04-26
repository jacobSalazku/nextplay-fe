import { z } from 'zod';
import { PracticeType } from '@/graphql/graphql';

export const gameSchema = z.object({
  title: z.string().min(1, 'Opponent name is required'),
  time: z.string().min(1, 'Start time is required'),
  duration: z.coerce.number().min(0.5, 'Duration must be at least 0.5'),
  date: z.string(),
});

export const practiceSchema = z.object({
  title: z.string().min(1, 'Practice name is required'),
  time: z.string().min(1, 'Start time is required'),
  practiceType: z.enum(
    Object.values(PracticeType) as [PracticeType, ...PracticeType[]],
  ),
  duration: z.coerce.number().min(0.5, 'Duration must be at least 0.5'),
  date: z.string(),
});

export type PracticeData = z.infer<typeof practiceSchema>;

export type GameData = z.infer<typeof gameSchema>;
