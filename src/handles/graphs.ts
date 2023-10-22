import {
  getFirestore,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  writeBatch,
  query,
  collection,
} from "firebase/firestore"
import { Graph } from "src/types/index"
import { notification } from "antd"
import {
  getCurrentUserId,
  getGraphsCollectionRef,
  getNodeCollectionPath,
} from "./utils"
import { deleteMarkdown } from "./markdown"

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
    nodes: {},
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
  const graphsSnapshot = await getDocs(graphsCollectionRef)
  const graphs: Graph[] = []
  graphsSnapshot.forEach((doc) => {
    graphs.push(doc.data() as Graph)
  })
  return graphs
}

export const deleteGraph = async (graphId: string) => {
  const ownerId = getCurrentUserId()
  if (!ownerId) {
    notification.error({
      message: "Error",
      description: "User not authenticated",
    })
    return
  }

  const batch = writeBatch(db)
  const graphRef = doc(db, `users/${ownerId}/graphs`, graphId)
  batch.delete(graphRef)

  // Fetch and delete all nodes associated with this graph
  const nodeQuery = query(
    collection(db, getNodeCollectionPath(ownerId, graphId))
  )
  const nodeSnapshot = await getDocs(nodeQuery)
  nodeSnapshot.forEach((doc) => {
    // Delete the markdown files
    deleteMarkdown(doc.id)

    // Delete the node document
    batch.delete(doc.ref)
  })

  try {
    await batch.commit()
    notification.success({
      message: "Success",
      description: "Graph and associated nodes deleted successfully",
    })
  } catch (error) {
    notification.error({
      message: "Error",
      description: "Failed to delete graph and associated nodes",
    })
  }
}
// Function to update node summary in the graph
export const updateGraphNodes = async (
  graphId: string,
  nodeId: string,
  nodeName: string,
  operation: "add" | "delete" | "update"
) => {
  const ownerId = getCurrentUserId()
  if (!ownerId) {
    return
  }

  const graphRef = doc(db, `users/${ownerId}/graphs`, graphId)
  const graphDoc = await getDoc(graphRef)

  if (graphDoc.exists()) {
    let graphData = graphDoc.data() as Graph

    // Initialize if nodes doesn't exist
    if (!graphData.nodes) {
      graphData = { ...graphData, nodes: {} }
    }

    const nodes = graphData.nodes ?? {}

    // Perform the update based on the operation
    if (operation === "add" || operation === "update") {
      nodes[nodeId] = nodeName
    } else if (operation === "delete") {
      delete nodes[nodeId]
    }

    // Update the graph
    await updateDoc(graphRef, {
      nodes: graphData.nodes,
    })
  }
}
