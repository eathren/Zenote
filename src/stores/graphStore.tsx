import { Graph } from "src/types/index";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type GraphState = {
  graphs: Graph[];
  setGraphs: (graphs: Graph[]) => void;
  addGraph: (graph: Graph) => void;
  removeGraph: (graphId: string) => void;
  updateGraph: (graph: Graph) => void;
};

export const useGraphStore = create<GraphState>()(
  persist<GraphState>(
    // State creator function
    (set) => ({
      graphs: [],
      setGraphs: (graphs) => set({ graphs }),
      addGraph: (graph) =>
        set((state) => ({
          graphs: [...state.graphs, graph],
        })),
      removeGraph: (graphId) =>
        set((state) => ({
          graphs: state.graphs.filter((graph) => graph.id !== graphId),
        })),
      updateGraph: (graph) =>
        set((state) => ({
          graphs: state.graphs.map((g) => (g.id === graph.id ? graph : g)),
        })),
    }),
    {
      name: "graph-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
