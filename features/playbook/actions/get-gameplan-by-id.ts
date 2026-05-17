import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import {
  GetGameplanByIdDocument,
  GetGamePlanByIdInput,
} from '@/graphql/graphql';

export const getGameplanById = async (input: GetGamePlanByIdInput) => {
  const { getGameplanById } = await executeAuthedGraphQL(
    GetGameplanByIdDocument,
    {
      input: { routeKey: input.routeKey, id: input.id },
    },
  );

  return getGameplanById;
};
