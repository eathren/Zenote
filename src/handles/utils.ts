import { getAuth } from "firebase/auth"
import { Firestore, collection, doc, getDoc } from "firebase/firestore"
import { db } from "src/firebase"

// Function to get current user's UID
export const getCurrentUserId = () => {
  const auth = getAuth()
  const user = auth.currentUser
  return user ? user.uid : null
}

/**
 * Get the Firestore path to the graphs collection for a given user.
 *
 * @param db - Firestore database instance.
 * @param ownerId - The Firestore ID of the user.
 * @returns A collection reference to the graphs collection.
 */
export const getGraphsCollectionRef = (db: Firestore) => {
  const ownerId = getCurrentUserId()
  return collection(db, `users/${ownerId}/graphs`)
}

/**
 * Get the Firestore path for the nodes collection based on the owner and graph IDs.
 * @param ownerId - The Firestore ID of the owner of the graph.
 * @param graphId - The Firestore ID of the graph.
 * @returns The Firestore path as a string.
 */
export const getNodeCollectionPath = (
  ownerId: string,
  graphId: string
): string => {
  return `users/${ownerId}/graphs/${graphId}/nodes`
}

/**
 * Get a reference to a node document.
 *
 * @param db - Firestore database instance
 * @param ownerId - Owner's Firestore ID
 * @param graphId - Graph's Firestore ID
 * @param nodeId - Node's Firestore ID
 * @returns Reference to the node document
 */
export const getNodeDocRef = (
  db: Firestore,
  ownerId: string,
  graphId: string,
  nodeId: string
) => {
  return doc(db, `users/${ownerId}/graphs/${graphId}/nodes/${nodeId}`)
}
// Fetches a single document by its ID and collection
export const fetchSingleDoc = async (collectionName: string, docId: string) => {
  const docRef = doc(db, collectionName, docId)
  const docSnap = await getDoc(docRef)
  return docSnap.data()
}
