import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import {
  GetGameplanByIdDocument,
  GetGamePlanByIdInput,
} from '@/graphql/graphql';

export const getGameplanById = async (input: GetGamePlanByIdInput) => {
  const { getGameplanById } = await executeAuthedGraphQL(
    GetGameplanByIdDocument,
    {
      input: { teamRef: input.teamRef, id: input.id },
    },
  );

  return getGameplanById;
};
