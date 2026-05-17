import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import { GetPracticePreparationByIdDocument } from '@/graphql/graphql';

export const getPracticePreparationById = async (
  teamRef: string,
  id: string,
) => {
  const { getPracticePreparationById } = await executeAuthedGraphQL(
    GetPracticePreparationByIdDocument,
    {
      input: { teamRef, id },
    },
  );

  return getPracticePreparationById;
};
