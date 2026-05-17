import { Mode } from '@/features/playbook/form/gameplan-form';
import { CoachDashTab } from '@/features/playbook/utils/types';
import { create } from 'zustand';
import { GamePlan } from '@/graphql/graphql';

type DasboardState = {
  gamePlanMode: Mode;
  setGamePlanMode: (mode: Mode) => void;

  selectedGameplan: GamePlan | null;
  setSelectedGameplan: (selectedGameplan: GamePlan | null) => void;

  activeCoachTab: CoachDashTab;
  setActiveCoachTab: (value: CoachDashTab) => void;

  openPracticePreparation: boolean;
  setOpenPracticePreparation: (value: boolean) => void;

  openGamePlan: boolean;
  setOpenGamePlan: (value: boolean) => void;

  viewGameplan: boolean;
  setViewGameplan: (value: boolean) => void;
};

export const useCoachDashboardStore = create<DasboardState>((set) => ({
  gamePlanMode: 'create',
  setGamePlanMode: (mode) => set({ gamePlanMode: mode }),

  selectedGameplan: null,
  setSelectedGameplan: (selectedGameplan) => set({ selectedGameplan }),

  activeCoachTab: 'gameplan',
  setActiveCoachTab: (activeCoachTab) => set({ activeCoachTab }),

  openPracticePreparation: false,
  setOpenPracticePreparation: (openPracticePreparation) =>
    set({ openPracticePreparation }),

  openGamePlan: false,
  setOpenGamePlan: (openGamePlan) => set({ openGamePlan }),

  viewGameplan: false,
  setViewGameplan: (viewGameplan) => set({ viewGameplan }),
}));
