import {
  getFirestore,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore"
import { Graph } from "src/types/index"
import { notification } from "antd"
import { getCurrentUserId, getGraphsCollectionRef } from "./utils"

const db = getFirestore()

// Function to add a new graph to the database
export const addGraphInDB = async (graphName: string) => {
  const ownerId = getCurrentUserId()
  if (!ownerId) {
    notification.error({
      message: "Error",
      description: "User not authenticated",
    })
    return
  }

  const graphsCollectionRef = getGraphsCollectionRef(db)
  const graph: Graph = {
    name: graphName,
    ownerId,
    date_created: Date.now(),
  }

  try {
    const docRef = await addDoc(graphsCollectionRef, graph)
    return docRef.id
  } catch (error) {
    notification.error({
      message: "Error",
      description: "Failed to add graph in DB",
    })
  }
}

// Function to get all graphs from the database
export const getGraphsFromDB = async () => {
  const ownerId = getCurrentUserId()
  if (!ownerId) {
    notification.error({
      message: "Error",
      description: "User not authenticated",
    })
    return []
  }

  const graphsCollectionRef = getGraphsCollectionRef(db)
  console.log(graphsCollectionRef)
  const graphsSnapshot = await getDocs(graphsCollectionRef)
  const graphs: Graph[] = []
  graphsSnapshot.forEach((doc) => {
    graphs.push(doc.data() as Graph)
  })
  return graphs
}

// Function to delete a graph from the database
export const deleteGraph = async (graphId: string) => {
  const ownerId = getCurrentUserId()
  if (!ownerId) {
    notification.error({
      message: "Error",
      description: "User not authenticated",
    })
    return
  }

  try {
    const graphRef = doc(db, `users/${ownerId}/graphs`, graphId)
    await deleteDoc(graphRef)
  } catch (error) {
    notification.error({
      message: "Error",
      description: "Failed to delete graph",
    })
  }
}
