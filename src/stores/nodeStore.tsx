import { GraphNode } from "src/types"
import { create } from "zustand"

type NodeState = {
  nodes: GraphNode[]
  setNodes: (nodes: GraphNode[]) => void
  addNode: (node: GraphNode) => void
  updateNode: (node: GraphNode) => void
  deleteNode: (nodeId: string) => void
}

export const useNodeStore = create<NodeState>((set) => ({
  // Nodes
  nodes: [],
  setNodes: (nodes) => set({ nodes }),
  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  updateNode: (node) =>
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === node.id ? node : n)),
    })),
  deleteNode: (nodeId) =>
    set((state) => ({ nodes: state.nodes.filter((n) => n.id !== nodeId) })),
}))
