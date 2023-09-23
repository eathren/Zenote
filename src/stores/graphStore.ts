import { fetchEdges, fetchNodes } from "src/handles/index"
import { create } from "zustand"
import { v4 as uuidv4 } from "uuid"
import {
  GraphEdge,
  GraphNode,
  GraphEdgeObj,
  GraphNodeObj,
} from "src/types/Graph"
import {
  findNodeById,
  findEdgeById,
  debouncedAddEdge,
  debouncedAddNode,
  debouncedDeleteEdge,
  debouncedDeleteNode,
  debouncedUpdateEdge,
  debouncedUpdateNode,
} from "src/utils"

type GraphState = {
  nodes: GraphNodeObj
  edges: GraphEdgeObj
  fetchGraph: () => Promise<void>
  addNode: () => void
  updateNode: (nodeId: string, updatedFields: Partial<GraphNode>) => void
  deleteNode: (nodeId: string) => void
  addEdge: (src: string, dest: string) => void
  updateEdge: (edgeId: string, updatedFields: Partial<GraphEdge>) => void
  deleteEdge: (edgeId: string) => void
}

// Initialize the store with fetched data
const initializeStore = async (set: (partial: Partial<GraphState>) => void) => {
  const fetchedNodes = await fetchNodes()
  const fetchedEdges = await fetchEdges()
  set({ nodes: fetchedNodes, edges: fetchedEdges })
}

export const useGraphStore = create<GraphState>((set, get) => {
  initializeStore(set).catch((error) => {
    // Handle initialization error here
    console.error("Failed to initialize store:", error)
  })

  return {
    nodes: {},
    edges: {},
    fetchGraph: async () => {
      const fetchedNodes = await fetchNodes()
      const fetchedEdges = await fetchEdges()
      set({ nodes: fetchedNodes, edges: fetchedEdges })
    },
    addNode: () => {
      const newNode: GraphNode = {
        id: uuidv4(),
        content: "Test",
        date_created: Date.now(),
      }
      set((state) => ({ nodes: { ...state.nodes, [newNode.id]: newNode } }))
      debouncedAddNode(newNode)
    },
    updateNode: (nodeId: string, updatedFields: Partial<GraphNode>) => {
      const node = findNodeById(get().nodes, nodeId)
      if (node) {
        set((state) => ({
          nodes: {
            ...state.nodes,
            [nodeId]: { ...node, ...updatedFields },
          },
        }))
        debouncedUpdateNode(nodeId, updatedFields)
      }
    },
    deleteNode: (nodeId: string) => {
      const { [nodeId]: _, ...restNodes } = get().nodes
      set({ nodes: restNodes })
      debouncedDeleteNode(nodeId)
    },
    addEdge: (src: string, dest: string) => {
      const newEdge: GraphEdge = {
        id: uuidv4(),
        src,
        dest,
      }
      set((state) => ({ edges: { ...state.edges, [newEdge.id]: newEdge } }))
      debouncedAddEdge(newEdge)
    },
    updateEdge: (edgeId: string, updatedFields: Partial<GraphEdge>) => {
      const edge = findEdgeById(get().edges, edgeId)
      if (edge) {
        set((state) => ({
          edges: {
            ...state.edges,
            [edgeId]: { ...edge, ...updatedFields },
          },
        }))
        debouncedUpdateEdge(edgeId, updatedFields)
      }
    },
    deleteEdge: (edgeId: string) => {
      const { [edgeId]: _, ...restEdges } = get().edges
      set({ edges: restEdges })
      debouncedDeleteEdge(edgeId)
    },
  }
})
