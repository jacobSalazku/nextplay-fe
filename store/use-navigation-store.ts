import { create } from 'zustand';

type NavigationState = {
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;

  openLogOutModal: boolean;
  setOpenLogOutModal: (open: boolean) => void;
};

export const useNavigationStore = create<NavigationState>((set) => ({
  navOpen: false,
  setNavOpen: (open) => set({ navOpen: open }),

  mobileNavOpen: false,
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),

  openLogOutModal: false,
  setOpenLogOutModal: (open) => set({ openLogOutModal: open }),
}));
