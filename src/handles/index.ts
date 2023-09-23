import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore"
import { GraphNode, InitialGraphNode } from "src/types/GraphNode"

/**
 * Fetch all documents from the Firestore "nodes" collection and return them as an array of InitialGraphNode.
 * @returns {Promise<InitialGraphNode[]>} A promise that resolves to an array of InitialGraphNodes.
 */
export const fetchAllDocuments = async (): Promise<InitialGraphNode[]> => {
  // Initialize Firestore instance
  const db = getFirestore()

  // Reference to the Firestore collection "nodes"
  const nodesCollection = collection(db, "nodes")

  // Perform query to fetch all documents from the "nodes" collection
  const querySnapshot = await getDocs(nodesCollection)

  // Initialize an empty array to store fetched nodes
  const allNodes: InitialGraphNode[] = []

  // Populate allNodes array with data from Firestore
  querySnapshot.forEach((docSnapshot) => {
    allNodes.push({
      id: docSnapshot.id,
      ...docSnapshot.data(),
    } as InitialGraphNode)
  })

  return allNodes
}

/**
 * Update a specific document in the Firestore "nodes" collection with the provided fields.
 * @param {string} nodeId - The ID of the node to update.
 * @param {Partial<GraphNode>} updatedFields - An object containing the fields to update.
 * @returns {Promise<void>} A promise that resolves when the document has been updated.
 */
export const updateDocumentInDB = async (
  nodeId: string,
  updatedFields: Partial<GraphNode>
): Promise<void> => {
  // Initialize Firestore instance
  const db = getFirestore()

  // Reference to the specific document in the "nodes" collection
  const docRef = doc(db, "nodes", nodeId)

  // Remove the 'children' field if present, as it should not be updated this way
  if (updatedFields.children) delete updatedFields.children

  // Perform the update
  await setDoc(docRef, updatedFields, { merge: true })
}
