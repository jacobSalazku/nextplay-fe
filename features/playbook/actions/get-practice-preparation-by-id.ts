import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import { GetPracticePreparationByIdDocument } from '@/graphql/graphql';

export const getPracticePreparationById = async (
  routeKey: string,
  id: string,
) => {
  const { getPracticePreparationById } = await executeAuthedGraphQL(
    GetPracticePreparationByIdDocument,
    {
      input: { routeKey, id },
    },
  );

  return getPracticePreparationById;
};
