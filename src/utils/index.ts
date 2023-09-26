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
import { TreeNode } from "src/types/Tree"

export const findNodeById = (nodes: GraphNodeObj, id: string) => nodes[id]
export const findEdgeById = (edges: GraphEdgeObj, id: string) => edges[id]

export const createTree = (nodes: GraphNodeObj, edges: GraphEdgeObj) => {
  const seenNodes = new Set<string>()
  const tree: TreeNode[] = []

  // Pre-filter edges
  const edgeMap: { [src: string]: string[] } = {}
  Object.values(edges).forEach((edge) => {
    if (!edgeMap[edge.src]) {
      edgeMap[edge.src] = []
    }
    edgeMap[edge.src].push(edge.dest)
  })

  const findChildren = (
    nodeId: string,
    nodes: GraphNodeObj,
    edgeMap: { [src: string]: string[] },
    seenNodes: Set<string>
  ): TreeNode[] => {
    const children: TreeNode[] = []
    const childIds = edgeMap[nodeId] || []
    childIds.forEach((childId) => {
      const child = findNodeById(nodes, childId)
      if (child && child.id && !seenNodes.has(child.id)) {
        seenNodes.add(child.id)
        children.push({
          ...child,
          children: findChildren(child.id, nodes, edgeMap, seenNodes),
        })
      }
    })
    return children
  }

  Object.keys(nodes).forEach((nodeId) => {
    if (seenNodes.has(nodeId)) return

    const node = nodes[nodeId]
    const children = findChildren(nodeId, nodes, edgeMap, seenNodes)
    tree.push({
      ...node,
      children,
    })
  })

  return tree
}

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
