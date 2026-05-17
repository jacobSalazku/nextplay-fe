import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import { GetPracticePreparationsDocument } from '@/graphql/graphql';

export const getPracticePreparations = async (routeKey: string) => {
  const { getPracticePreparations } = await executeAuthedGraphQL(
    GetPracticePreparationsDocument,
    {
      input: { routeKey },
    },
  );

  return getPracticePreparations;
};
