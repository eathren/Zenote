import { GraphEdge } from "src/types/index";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type EdgeState = {
  edges: GraphEdge[];
  setEdges: (edges: GraphEdge[]) => void;
  addEdge: (edge: GraphEdge) => void;
  removeEdge: (edgeId: string) => void;
  updateEdge: (edge: GraphEdge) => void;
};

export const useEdgeStore = create<EdgeState>()(
  persist(
    (set) => ({
      edges: [],
      setEdges: (edges) => set({ edges }),
      addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),
      removeEdge: (edgeId) =>
        set((state) => ({
          edges: state.edges.filter((edge) => edge.id !== edgeId),
        })),
      updateEdge: (edge) =>
        set((state) => ({
          edges: state.edges.map((e) => (e.id === edge.id ? edge : e)),
        })),
    }),
    {
      name: "edge-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
