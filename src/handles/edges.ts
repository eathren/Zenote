import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  getDoc,
} from "firebase/firestore"
import { GraphEdge } from "src/types/index" // Update the import path according to your project structure
import { notification } from "antd"
import { getNodeCollectionPath, getNodeDocRef } from "./utils"
import { v4 as uuidv4 } from "uuid"
import { GraphNode } from "src/types/index"
const db = getFirestore()

/**
 * Add an edge to a specific node.
 *
 * @param db - Firestore database instance
 * @param ownerId - Owner's Firestore ID
 * @param graphId - Graph's Firestore ID
 * @param nodeId - Node's Firestore ID
 * @param targetNodeId - Target node's Firestore ID
 * @returns Promise resolving to a boolean indicating the success of the operation
 */
export const addEdgeToNode = async (
  graphId: string | undefined,
  nodeId: string | undefined,
  targetNodeId: string | undefined
) => {
  try {
    if (!graphId || !nodeId || !targetNodeId) return false
    // Get reference to the specific node document
    const nodeDocRef = getNodeDocRef(db, graphId, nodeId)

    // Fetch the node data
    const nodeDocSnap = await getDoc(nodeDocRef)
    const nodeData = nodeDocSnap.data() as GraphNode

    // Initialize new edge
    const newEdge = {
      id: uuidv4(),
      graphId,
      source: nodeId,
      target: targetNodeId,
      date_created: Date.now(),
    }

    // If edges field is not an array or not defined, initialize it
    if (!Array.isArray(nodeData.edges)) {
      nodeData.edges = []
    }

    // Add new edge to edges array
    nodeData.edges.push(newEdge)

    // Update the document
    await updateDoc(nodeDocRef, {
      edges: nodeData.edges,
    })
    return true
  } catch (error) {
    console.error("Error adding edge: ", error)
    return false // Edge addition failed
  }
}

// Updated batchUpdateNodeEdges function
export const batchUpdateNodeEdges = async (
  graphId: string,
  nodeId: string,
  edgesToAdd: string[],
  edgesToRemove: string[]
) => {
  try {
    // Get reference to the specific node document
    const nodeDocRef = getNodeDocRef(db, graphId, nodeId)

    // Fetch the node data
    const nodeDocSnap = await getDoc(nodeDocRef)
    const nodeData = nodeDocSnap.data() as GraphNode

    // Initialize new edges to be added
    const newEdges: GraphEdge[] = edgesToAdd.map((targetNodeId) => ({
      id: uuidv4(),
      graphId,
      date_created: Date.now(),
      source: nodeId,
      target: targetNodeId,
    }))

    // If edges field is not an array or not defined, initialize it
    if (!Array.isArray(nodeData.edges)) {
      nodeData.edges = []
    }

    console.log("newEdges", newEdges, nodeData)

    // Add new edges to edges array locally, only if they do not already exist
    newEdges.forEach((newEdge) => {
      if (
        !nodeData.edges?.some(
          (existingEdge) => existingEdge.target === newEdge.target
        )
      ) {
        nodeData.edges?.push(newEdge)
      }
    })

    // Remove old edges
    if (Array.isArray(nodeData.edges)) {
      nodeData.edges = nodeData.edges.filter(
        (edge) => !edgesToRemove.includes(edge.target as string)
      )
    }

    // Perform a single batch update to the database
    await updateDoc(nodeDocRef, {
      edges: nodeData.edges,
    })

    return true
  } catch (error) {
    console.error("Error updating edges: ", error)
    return false
  }
}

export const addEdgesToNodeBatch = async (
  graphId: string,
  nodeId: string,
  targetNodeIds: string[]
): Promise<boolean> => {
  try {
    // Get reference to the specific node document
    const nodeDocRef = getNodeDocRef(db, graphId, nodeId)

    // Fetch the node data
    const nodeDocSnap = await getDoc(nodeDocRef)
    const nodeData = nodeDocSnap.data() as GraphNode
    console.log("here", nodeData)
    // Initialize new edges
    const newEdges = targetNodeIds.map((targetNodeId) => ({
      id: uuidv4(),
      graphId,
      source: nodeId,
      target: targetNodeId,
      date_created: Date.now(),
    }))

    // If edges field is not an array or not defined, initialize it
    if (!Array.isArray(nodeData.edges)) {
      nodeData.edges = []
    }

    // Add new edges to edges array locally
    nodeData.edges.push(...newEdges)

    // Perform a single batch update to the database
    await updateDoc(nodeDocRef, {
      edges: nodeData.edges,
    })

    return true
  } catch (error) {
    console.error("Error adding edges: ", error)
    return false
  }
}

/**
 * Fetches all edges for a specific graph from the database.
 *
 * @param graphId - The Firestore ID of the graph.
 * @returns An array of edges.
 */
export const getEdgesFromDB = async (graphId: string): Promise<GraphEdge[]> => {
  // Define the path to the nodes collection for this graph
  const nodesCollectionPath = getNodeCollectionPath(graphId)

  // Fetch all node documents in the graph
  const nodesSnapshot = await getDocs(collection(db, nodesCollectionPath))
  const edges: GraphEdge[] = []

  // Accumulate all edges from all nodes
  nodesSnapshot.forEach((nodeDoc) => {
    const nodeData = nodeDoc.data() as GraphNode
    if (Array.isArray(nodeData.edges)) {
      edges.push(...nodeData.edges)
    }
  })

  return edges
}

/**
 * Delete a specific edge from a node.
 *
 * @param graphId - The Firestore ID of the graph.
 * @param nodeId - The Firestore ID of the node containing the edge.
 * @param edgeId - The ID of the edge to be deleted.
 */
export const deleteEdgeInDB = async (
  graphId: string | undefined,
  nodeId: string | undefined,
  edgeId: string | undefined
) => {
  if (!graphId || !nodeId || !edgeId) return

  // Get the document reference for the specific node
  const nodeDocRef = getNodeDocRef(db, graphId, nodeId)

  // Fetch the existing node data
  const nodeDocSnap = await getDoc(nodeDocRef)
  const nodeData = nodeDocSnap.data() as GraphNode

  // Filter out the edge to be deleted
  if (Array.isArray(nodeData.edges)) {
    nodeData.edges = nodeData.edges.filter((edge) => edge.id !== edgeId)
  }

  // Update the node document
  try {
    await updateDoc(nodeDocRef, {
      edges: nodeData.edges,
    })
  } catch (error) {
    notification.error({
      message: "Error",
      description: "Failed to delete edge in DB",
    })
  }
}
