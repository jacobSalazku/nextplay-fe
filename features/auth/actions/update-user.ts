import { UpdateUserData } from '../zod';
import { executeAuthedMutation } from '@/lib/auth/server-authed';
import { UpdateUserDocument } from '@/graphql/graphql';

export const updateUser = async (data: UpdateUserData) => {
  const updateUser = await executeAuthedMutation(UpdateUserDocument, {
    input: data,
  });

  return updateUser;
};
