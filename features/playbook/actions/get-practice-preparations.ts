import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import { GetPracticePreparationsDocument } from '@/graphql/graphql';

export const getPracticePreparations = async (teamRef: string) => {
  const { getPracticePreparations } = await executeAuthedGraphQL(
    GetPracticePreparationsDocument,
    {
      input: { teamRef },
    },
  );

  return getPracticePreparations;
};
