import {
  GraphEdge,
  GraphEdgeObj,
  GraphNode,
  GraphNodeObj,
} from "src/types/Graph"
import { debounce } from "lodash"
import {
  updateNodeInDB,
  updateEdgeInDB,
  addNodeInDB,
  deleteNodeInDB,
  addEdgeInDB,
  deleteEdgeInDB,
} from "src/handles"

export const findNodeById = (nodes: GraphNodeObj, id: string) => nodes[id]
export const findEdgeById = (edges: GraphEdgeObj, id: string) => edges[id]

// Update actions
export const debouncedUpdateNode = debounce(
  async (nodeId: string, updatedFields: Partial<GraphNode>) => {
    try {
      await updateNodeInDB(nodeId, updatedFields)
    } catch (error) {
      console.error("Failed to update node in DB:", error)
    }
  },
  300
)

export const debouncedUpdateEdge = debounce(
  async (edgeId: string, updatedFields: Partial<GraphEdge>) => {
    try {
      await updateEdgeInDB(edgeId, updatedFields)
    } catch (error) {
      console.error("Failed to update edge in DB:", error)
    }
  },
  300
)

// Add actions
export const debouncedAddNode = debounce(async (newNode: GraphNode) => {
  try {
    await addNodeInDB(newNode)
  } catch (error) {
    console.error("Failed to add node in DB:", error)
  }
}, 300)

export const debouncedAddEdge = debounce(async (newEdge: GraphEdge) => {
  try {
    await addEdgeInDB(newEdge)
  } catch (error) {
    console.error("Failed to add edge in DB:", error)
  }
}, 300)

// Delete actions
export const debouncedDeleteNode = debounce(async (nodeId: string) => {
  try {
    await deleteNodeInDB(nodeId)
  } catch (error) {
    console.error("Failed to delete node in DB:", error)
  }
}, 300)

export const debouncedDeleteEdge = debounce(async (edgeId: string) => {
  try {
    await deleteEdgeInDB(edgeId)
  } catch (error) {
    console.error("Failed to delete edge in DB:", error)
  }
}, 300)
