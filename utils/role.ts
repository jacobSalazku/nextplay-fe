import { User } from '@/graphql/graphql';

export const getRoleById = (member: NonNullable<User['members']>[0]) => {
  return member?.role === 'COACH';
};
