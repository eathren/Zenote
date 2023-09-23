import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  addDoc,
} from "firebase/firestore"
import {
  GraphNode,
  GraphEdge,
  GraphEdgeObj,
  GraphNodeObj,
} from "src/types/Graph"

/**
 * Fetch all nodes from the Firestore "nodes" collection and return them as a GraphNodeObj.
 * @returns {Promise<GraphNodeObj>} A promise that resolves to a GraphNodeObj.
 */
export const fetchNodes = async (): Promise<GraphNodeObj> => {
  const db = getFirestore()
  const nodesCollection = collection(db, "nodes")
  const querySnapshot = await getDocs(nodesCollection)
  const nodes: GraphNodeObj = {}

  querySnapshot.forEach((docSnapshot) => {
    const data = docSnapshot.data()
    nodes[docSnapshot.id] = {
      id: docSnapshot.id,
      ...data,
    } as GraphNode
  })

  return nodes
}

/**
 * Fetch all edges from the Firestore "edges" collection and return them as a GraphEdgeObj.
 * @returns {Promise<GraphEdgeObj>} A promise that resolves to a GraphEdgeObj.
 */
export const fetchEdges = async (): Promise<GraphEdgeObj> => {
  const db = getFirestore()
  const edgesCollection = collection(db, "edges")
  const querySnapshot = await getDocs(edgesCollection)
  const edges: GraphEdgeObj = {}

  querySnapshot.forEach((docSnapshot) => {
    const data = docSnapshot.data()
    edges[docSnapshot.id] = data as GraphEdge
  })

  return edges
}

/**
 * Update a specific node in the Firestore "nodes" collection.
 * @param {string} nodeId - The ID of the GraphNode to update.
 * @param {Partial<GraphNode>} updatedFields - An object containing the fields to update.
 * @returns {Promise<void>} A promise that resolves when the node has been updated.
 */
export const updateNodeInDB = async (
  nodeId: string,
  updatedFields: Partial<GraphNode>
): Promise<void> => {
  const db = getFirestore()
  const docRef = doc(db, "nodes", nodeId)
  await setDoc(docRef, updatedFields, { merge: true })
}

/**
 * Update a specific edge in the Firestore "edges" collection.
 * @param {string} edgeId - The ID of the GraphEdge to update.
 * @param {Partial<GraphEdge>} updatedFields - An object containing the fields to update.
 * @returns {Promise<void>} A promise that resolves when the edge has been updated.
 */
export const updateEdgeInDB = async (
  edgeId: string,
  updatedFields: Partial<GraphEdge>
): Promise<void> => {
  const db = getFirestore()
  const docRef = doc(db, "edges", edgeId)
  await setDoc(docRef, updatedFields, { merge: true })
}

/**
 * Add a new node to the Firestore "nodes" collection.
 * @param {GraphNode} newNode - The new node to add.
 * @returns {Promise<void>} A promise that resolves when the new node has been added.
 */
export const addNodeInDB = async (newNode: GraphNode): Promise<void> => {
  const db = getFirestore()
  const nodesCollection = collection(db, "nodes")
  try {
    await addDoc(nodesCollection, newNode)
  } catch (error) {
    console.error("Failed to add node in DB:", error)
  }
}

/**
 * Delete a specific node from the Firestore "nodes" collection.
 * @param {string} nodeId - The ID of the GraphNode to delete.
 * @returns {Promise<void>} A promise that resolves when the node has been deleted.
 */
export const deleteNodeInDB = async (nodeId: string): Promise<void> => {
  const db = getFirestore()
  const nodeDoc = doc(db, "nodes", nodeId)
  try {
    await deleteDoc(nodeDoc)
  } catch (error) {
    console.error("Failed to delete node in DB:", error)
  }
}

/**
 * Add a new edge to the Firestore "edges" collection.
 * @param {GraphEdge} newEdge - The new edge to add.
 * @returns {Promise<void>} A promise that resolves when the new edge has been added.
 */
export const addEdgeInDB = async (newEdge: GraphEdge): Promise<void> => {
  const db = getFirestore()
  const edgesCollection = collection(db, "edges")
  try {
    await addDoc(edgesCollection, newEdge)
  } catch (error) {
    console.error("Failed to add edge in DB:", error)
  }
}

/**
 * Delete a specific edge from the Firestore "edges" collection.
 * @param {string} edgeId - The ID of the GraphEdge to delete.
 * @returns {Promise<void>} A promise that resolves when the edge has been deleted.
 */
export const deleteEdgeInDB = async (edgeId: string): Promise<void> => {
  const db = getFirestore()
  const edgeDoc = doc(db, "edges", edgeId)
  try {
    await deleteDoc(edgeDoc)
  } catch (error) {
    console.error("Failed to delete edge in DB:", error)
  }
}
