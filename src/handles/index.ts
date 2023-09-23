import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore"
import {
  GraphNode,
  GraphEdge,
  GraphEdgeObj,
  GraphNodeObj,
} from "src/types/Graph"

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
 * Update a specific edge in the Firestore "nodes" collection.
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
