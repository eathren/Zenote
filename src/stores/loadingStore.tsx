// loadingStore.ts
import { create } from "zustand"

type LoadingState = {
  isLoadingUserAuth: boolean
  isLoadingGraphs: boolean
  isLoadingNodes: boolean
  setLoadingUserAuth: (state: boolean) => void
  setLoadingGraphs: (state: boolean) => void
  setLoadingNodes: (state: boolean) => void
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoadingUserAuth: false,
  isLoadingGraphs: false,
  isLoadingNodes: false,
  setLoadingUserAuth: (state) => set({ isLoadingUserAuth: state }),
  setLoadingGraphs: (state) => set({ isLoadingGraphs: state }),
  setLoadingNodes: (state) => set({ isLoadingNodes: state }),
}))
