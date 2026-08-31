import 'server-only';
import { cache } from 'react';
import { executeAuthedGraphQL } from '@/lib/auth/server-authed';
import {
  GetMemberProfileInput,
  GetUserProfileDocument,
} from '@/graphql/graphql';

export const getUserProfile = cache(async (input: GetMemberProfileInput) => {
  const { getUserProfile } = await executeAuthedGraphQL(
    GetUserProfileDocument,
    {
      input: { ...input },
    },
  );

  return getUserProfile;
});
