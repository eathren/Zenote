import { Graph } from "src/types/index"
import { GraphNodeObj, GraphEdgeObj } from "src/types"
import { create } from "zustand"

type GraphActions = {
  setGraphs: (graphs: Graph[]) => void
  addGraph: (graphId: string, graphName: string) => void
  removeGraph: (graphId: string) => void
  updateGraph: (graph: Graph) => void

  setNodes: (nodes: GraphNodeObj) => void
  addNode: (node: GraphNodeObj) => void
  updateNode: (node: GraphNodeObj) => void
  deleteNode: (nodeId: string) => void

  setEdges: (edges: GraphEdgeObj) => void
  addEdge: (edge: GraphEdgeObj) => void
  updateEdge: (edge: GraphEdgeObj) => void
  deleteEdge: (edgeId: string) => void
}

type GraphState = {
  graphs: Graph[]

  nodes: GraphNodeObj
  edges: GraphEdgeObj
  actions: GraphActions
}

const useGraphStore = create<GraphState>((set) => ({
  graphs: [],
  nodes: {},
  edges: {},

  actions: {
    // Graphs
    setGraphs: (graphs) => set({ graphs }),
    addGraph: (graphId, graphName) =>
      set((state) => ({
        graphs: [
          ...state.graphs,
          {
            id: graphId,
            name: graphName,
          },
        ],
      })),
    removeGraph: (graphId) =>
      set((state) => ({
        graphs: state.graphs.filter((graph) => graph.id !== graphId),
      })),
    updateGraph: (graph) =>
      set((state) => ({
        graphs: state.graphs.map((g) => (g.id === graph.id ? graph : g)),
      })),

    // Nodes
    setNodes: (nodes) => set({ nodes }),
    addNode: (node) => set((state) => ({ nodes: { ...state.nodes, ...node } })),
    updateNode: (node) =>
      set((state) => ({ nodes: { ...state.nodes, ...node } })),
    deleteNode: (nodeId) =>
      set((state) => ({
        nodes: Object.fromEntries(
          Object.entries(state.nodes).filter(([key]) => key !== nodeId)
        ),
      })),

    // Edges
    setEdges: (edges) => set({ edges }),
    addEdge: (edge) => set((state) => ({ edges: { ...state.edges, ...edge } })),
    updateEdge: (edge) =>
      set((state) => ({ edges: { ...state.edges, ...edge } })),
    deleteEdge: (edgeId) =>
      set((state) => ({
        edges: Object.fromEntries(
          Object.entries(state.edges).filter(([key]) => key !== edgeId)
        ),
      })),
  },
}))

export const useGraphs = () => useGraphStore((state) => state.graphs)
export const useNodes = () => useGraphStore((state) => state.nodes)
export const useEdges = () => useGraphStore((state) => state.edges)

export const useGraphActions = () => useGraphStore((state) => state.actions)
