import { GraphNode } from "src/types/index"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

type NodeState = {
  nodes: GraphNode[]
  setNodes: (nodes: GraphNode[]) => void
  addNode: (node: GraphNode) => void
  removeNode: (nodeId: string) => void
  updateNode: (node: GraphNode) => void
}

export const useNodeStore = create<NodeState>()(
  persist(
    (set) => ({
      nodes: [],
      setNodes: (nodes) => set({ nodes }),
      addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
      removeNode: (nodeId) =>
        set((state) => ({
          nodes: state.nodes.filter((node) => node.id !== nodeId),
        })),
      updateNode: (node) =>
        set((state) => ({
          nodes: state.nodes.map((n) => (n.id === node.id ? node : n)),
        })),
    }),
    {
      name: "node-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
