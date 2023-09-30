import {
  getFirestore,
  collection,
  setDoc,
  doc,
  deleteDoc,
  addDoc,
} from "firebase/firestore"
import { debounce } from "lodash"
import { GraphNode, GraphEdge } from "src/types/Graph"

export const updateNodeInDB = async (
  nodeId: string,
  updatedFields: Partial<GraphNode>
) => {
  const db = getFirestore()
  const docRef = doc(db, "nodes", nodeId)
  await setDoc(docRef, updatedFields, { merge: true })
}

export const updateEdgeInDB = async (
  edgeId: string,
  updatedFields: Partial<GraphEdge>
) => {
  const db = getFirestore()
  const docRef = doc(db, "edges", edgeId)
  await setDoc(docRef, updatedFields, { merge: true })
}

export const addEmptyNodeInDB = async (nodeId?: string | undefined) => {
  const db = getFirestore()
  const nodesCollection = collection(db, "nodes")
  try {
    const docRef = await addDoc(nodesCollection, {
      content: "",
      date_created: Date.now(),
    })
    const newId = docRef.id
    if (nodeId) {
      const edge = { src: nodeId, dest: newId } as GraphEdge
      addEdgeInDB(edge)
    }
    return newId
  } catch (error) {
    console.error("Failed to add empty node in DB:", error)
  }
}

export const addNodeInDB = async (newNode: GraphNode) => {
  const db = getFirestore()
  const nodesCollection = collection(db, "nodes")
  try {
    const docRef = await addDoc(nodesCollection, newNode)
    return docRef.id
  } catch (error) {
    console.error("Failed to add node in DB:", error)
  }
}

export const deleteNodeInDB = async (nodeId: string) => {
  const db = getFirestore()
  const nodeDoc = doc(db, "nodes", nodeId)
  try {
    await deleteDoc(nodeDoc)
  } catch (error) {
    console.error("Failed to delete node in DB:", error)
  }
}

export const addEdgeInDB = async (newEdge: GraphEdge) => {
  const db = getFirestore()
  const edgesCollection = collection(db, "edges")
  try {
    const docRef = await addDoc(edgesCollection, newEdge)
    return docRef.id
  } catch (error) {
    console.error("Failed to add edge in DB:", error)
  }
}

export const deleteEdgeInDB = async (edgeId: string) => {
  const db = getFirestore()
  const edgeDoc = doc(db, "edges", edgeId)
  try {
    await deleteDoc(edgeDoc)
  } catch (error) {
    console.error("Failed to delete edge in DB:", error)
  }
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
