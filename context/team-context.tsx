'use client';

import { createContext, useContext, useEffect } from 'react';
import { useUserStore } from '@/store/user-store';
import { parseRouteKey } from '@/lib/helpers/route-key';
import { GetUserResponse } from '@/graphql/graphql';

type TeamContextValue = {
  routeKey: string;
  teamSlug: string;
  teamShortId: string | null;
};

const TeamContext = createContext<TeamContextValue | null>(null);

export function TeamProvider({
  routeKey,
  user,
  children,
}: {
  user: GetUserResponse;
  routeKey: string;
  children: React.ReactNode;
}) {
  const parsed = parseRouteKey(routeKey);

  const setUser = useUserStore.getState().setUser;
  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return (
    <TeamContext.Provider
      value={{
        routeKey,
        teamSlug: parsed?.slug ?? routeKey,
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
