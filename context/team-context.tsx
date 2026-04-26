'use client';

import { createContext, useContext } from 'react';
import { useUserStore } from '@/store/user-store';
import { parseTeamRef } from '@/lib/helpers/team-ref';
import { GetUserResponse } from '@/graphql/graphql';

type TeamContextValue = {
  teamRef: string;
  teamSlug: string;
  teamShortId: string | null;
};

const TeamContext = createContext<TeamContextValue | null>(null);

export function TeamProvider({
  teamRef,
  user,
  children,
}: {
  user: GetUserResponse;
  teamRef: string;
  children: React.ReactNode;
}) {
  const parsed = parseTeamRef(teamRef);

  const setUser = useUserStore.getState().setUser;
  setUser(user);

  return (
    <TeamContext.Provider
      value={{
        teamRef,
        teamSlug: parsed?.slug ?? teamRef,
        teamShortId: parsed?.shortId ?? null,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (!context) throw new Error('useTeam must be used within a TeamProvider');
  return context;
}
