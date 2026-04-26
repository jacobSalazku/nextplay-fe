import { create } from 'zustand';
import { GetUserResponse } from '@/graphql/graphql';

type UserStore = {
  user: GetUserResponse | null;
  setUser: (user: GetUserResponse) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user: GetUserResponse) => set({ user }),
  clearUser: () => set({ user: null }),
}));
