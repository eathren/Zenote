import { create } from "zustand"
import { GraphSettings } from "src/types"

type GraphControlsState = {
  settings: Record<string, GraphSettings>
  updateSetting: (graphId: string | undefined, key: string, value: any) => void
  resetToDefaults: (graphId: string | undefined) => void
  getOrInitializeSettings: (graphId: string) => GraphSettings
}

const defaultSettings: GraphSettings = {
  nodeSize: 5,
  linkStrength: 100,
  nodeStrength: -30,
  repelForce: 100,
  nodeGrowth: true,
  searchText: "",
  color: "#000000",
  lineThickness: 1,
}

export const useGraphSettingsStore = create<GraphControlsState>()(
  (set, get) => ({
    settings: {},
    updateSetting: (graphId, key, value) =>
      set((state) => {
        console.log("Updating setting", graphId, key, value)
        if (!graphId) return state
        const existingSettings = state.settings[graphId] || {}
        return {
          settings: {
            ...state.settings,
            [graphId]: {
              ...existingSettings,
              [key]: value,
            },
          },
        }
      }),
    getOrInitializeSettings: (graphId: string) => {
      const currentSettings = get().settings
      if (!currentSettings[graphId]) {
        const updatedSettings = {
          ...currentSettings,
          [graphId]: defaultSettings,
        }
        set({ settings: updatedSettings })
        return defaultSettings
      }
      return currentSettings[graphId]
    },
    resetToDefaults: (graphId) =>
      set((state) => ({
        settings: {
          ...state.settings,
          [graphId]: defaultSettings,
        },
      })),
  })
)

export default useGraphSettingsStore
