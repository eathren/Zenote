// loadingStore.ts
import { create } from "zustand";

type LoadingState = {
  isLoadingUserAuth: boolean;
  setLoadingUserAuth: (state: boolean) => void;
};

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoadingUserAuth: false,
  setLoadingUserAuth: (state) => set({ isLoadingUserAuth: state }),
}));
