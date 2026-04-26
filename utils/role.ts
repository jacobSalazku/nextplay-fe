import { User } from '@/graphql/graphql';

export const getRoleById = (member: User['members'][0]) => {
  return member?.role === 'COACH';
};
