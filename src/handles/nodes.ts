import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
  query,
  where,
  getDoc,
} from "firebase/firestore"
import { GraphNode } from "src/types/index" // Update the import path according to your project structure
import { notification } from "antd"
import {
  fetchSingleDoc,
  getCurrentUserId,
  getNodeCollectionPath,
  getNodeDocRef,
} from "./utils"
import { ref, deleteObject } from "firebase/storage"
import { storage } from "src/firebase"
import { deleteMarkdown, uploadMarkdown } from "./markdown"
import { updateGraphNodes } from "./graphs"

const db = getFirestore()

export const addNode = async (graphId: string, nodeName: string) => {
  const ownerId = getCurrentUserId()
  if (!ownerId) {
    notification.error({
      message: "Error",
      description: "User not authenticated",
    })
    return
  }

  // Use the utility function to get the node collection path
  const nodeCollectionPath = getNodeCollectionPath(ownerId, graphId)

  // Navigate to the specific nodes collection path
  const nodesCollection = collection(db, nodeCollectionPath)

  let nodeDocRef = null
  let markdownUrl = ""

  // Initialize new node data
  const newNode = {
    name: nodeName,
    graphId,
    date_created: Date.now(),
    tags: [],
    groups: [],
    edges: [],
  }

  try {
    // Step 1: Create a new node in Firestore
    nodeDocRef = await addDoc(nodesCollection, newNode)

    // Step 2: Upload empty markdown associated with the node
    markdownUrl = await uploadMarkdown(nodeDocRef.id, "")

    // Step 3: Update the node to include markdownUrl
    await setDoc(nodeDocRef, { markdownUrl }, { merge: true })
    await updateGraphNodes(graphId, nodeDocRef.id, nodeName, "add")
    return nodeDocRef.id
  } catch (error) {
    // If any of the above operations fail, delete the created resources to maintain atomicity
    if (nodeDocRef) {
      await deleteDoc(nodeDocRef)
    }
    if (markdownUrl) {
      const storageRef = ref(storage, `markdown/${nodeDocRef?.id}.md`)
      await deleteObject(storageRef)
    }

    notification.error({
      message: "Error",
      description: "Failed to add node",
    })

    throw error
  }
}

export const fetchNode = async (graphId: string, nodeId: string) => {
  const ownerId = getCurrentUserId()
  if (!ownerId) {
    notification.error({
      message: "Error",
      description: "User not authenticated",
    })
    return
  }

  const nodeRef = doc(db, `users/${ownerId}/graphs/${graphId}/nodes/${nodeId}`)
  const nodeDoc = await getDoc(nodeRef)
  const node = { id: nodeRef.id, ...nodeDoc.data() } as GraphNode
  return node
}

export const deleteNode = async (nodeId: string) => {
  try {
    const nodeRef = doc(db, "nodes", nodeId)

    // Delete associated edges
    const edgesCollection = collection(db, "edges")
    const q1 = query(edgesCollection, where("source", "==", nodeId))
    const q2 = query(edgesCollection, where("target", "==", nodeId))
    const querySnapshot1 = await getDocs(q1)
    const querySnapshot2 = await getDocs(q2)

    querySnapshot1.forEach(async (documentSnapshot) => {
      await deleteDoc(doc(edgesCollection, documentSnapshot.id))
    })

    querySnapshot2.forEach(async (documentSnapshot) => {
      await deleteDoc(doc(edgesCollection, documentSnapshot.id))
    })

    // Delete markdown
    await deleteMarkdown(nodeId)

    // Delete node
    await deleteDoc(nodeRef)
  } catch (error) {
    notification.error({
      message: "Error",
      description: "Failed to delete node",
    })
  }
}

export const removeEdgeFromNode = async (
  nodeId: string,
  targetNodeId: string
) => {
  const nodeData = (await fetchSingleDoc("nodes", nodeId)) as GraphNode // fetch single node
  const newEdges = nodeData.edges?.filter(
    (edge) => edge.target !== targetNodeId
  )
  const nodeRef = doc(db, "nodes", nodeId)
  await updateDoc(nodeRef, {
    edges: newEdges,
  })
}

export const removeEdgesFromNodeBatch = async (
  graphId: string,
  nodeId: string,
  targetNodeIds: string[]
) => {
  const ownerId = getCurrentUserId()
  if (!ownerId) {
    notification.error({
      message: "Error",
      description: "User not authenticated",
    })
    return
  }

  const nodeDocRef = getNodeDocRef(db, ownerId, graphId, nodeId)
  const nodeDocSnap = await getDoc(nodeDocRef)
  const nodeData = nodeDocSnap.data() as GraphNode

  if (Array.isArray(nodeData.edges)) {
    nodeData.edges = nodeData.edges.filter(
      (edge) => !targetNodeIds.includes(edge.target as string)
    )
  }

  try {
    await updateDoc(nodeDocRef, {
      edges: nodeData.edges,
    })
  } catch (error) {
    notification.error({
      message: "Error",
      description: "Failed to delete edges in DB",
    })
  }
}

export const getNodesFromDB = async () => {
  const ownerId = getCurrentUserId()
  if (!ownerId) {
    notification.error({
      message: "Error",
      description: "User not authenticated",
    })
    return []
  }
}
/**
 * Update the title of a specific node and return the updated list of nodes.
 *
 * @param graphId - The Firestore ID of the graph to which the node belongs.
 * @param nodeId - The Firestore ID of the node whose title needs to be updated.
 * @param newTitle - The new title for the node.
 * @returns Promise resolving to an array of updated GraphNode objects.
 */
export const updateNodeTitle = async (
  graphId: string,
  nodeId: string,
  newTitle: string
): Promise<GraphNode[]> => {
  const ownerId = getCurrentUserId()
  if (!ownerId) {
    notification.error({
      message: "Error",
      description: "User not authenticated",
    })
    return []
  }

  // Use the utility function to get the node collection path
  const nodeCollectionPath = getNodeCollectionPath(ownerId, graphId)

  // Navigate to the specific node document
  const nodeRef = doc(db, `${nodeCollectionPath}/${nodeId}`)

  try {
    await updateDoc(nodeRef, {
      name: newTitle,
    })
    await updateGraphNodes(graphId, nodeId, newTitle, "update")
  } catch (error) {
    notification.error({
      message: "Error",
      description: "Failed to update node title",
    })
    throw error
  }

  // Fetch the updated list of nodes
  const nodesCollection = collection(db, nodeCollectionPath)
  const nodesSnapshot = await getDocs(nodesCollection)
  const nodes: GraphNode[] = []
  nodesSnapshot.forEach((doc) => {
    nodes.push(doc.data() as GraphNode)
  })

  return nodes
}
/**
 * Delete a specific node from the database.
 *
 * @param graphId - The Firestore ID of the graph to which the node belongs.
 * @param nodeId - The Firestore ID of the node to be deleted.
 */
export const deleteNodeInDB = async (graphId: string, nodeId: string) => {
  const ownerId = getCurrentUserId()
  if (!ownerId) {
    notification.error({
      message: "Error",
      description: "User not authenticated",
    })
    return
  }

  const nodeRef = doc(
    db,
    `${getNodeCollectionPath(ownerId, graphId)}/${nodeId}`
  )
  try {
    await deleteDoc(nodeRef)
    await updateGraphNodes(graphId, nodeId, "", "delete")
    await deleteMarkdown(nodeId)
  } catch (error) {
    notification.error({
      message: "Error",
      description: "Failed to delete node in DB",
    })
  }
}

/**
 * Update the groups of a specific node.
 *
 * @param graphId - The Firestore ID of the graph to which the node belongs.
 * @param nodeId - The Firestore ID of the node whose groups need to be updated.
 * @param groups - The new set of groups.
 */
export const updateNodeGroups = async (
  graphId: string,
  nodeId: string,
  groups: string[]
) => {
  const ownerId = getCurrentUserId()
  if (!ownerId) {
    notification.error({
      message: "Error",
      description: "User not authenticated",
    })
    return
  }

  const nodeRef = doc(
    db,
    `${getNodeCollectionPath(ownerId, graphId)}/${nodeId}`
  )
  await updateDoc(nodeRef, {
    groups,
  })
}

export const addTagToNode = async (
  graphId: string | undefined,
  nodeId: string,
  newTag: string
) => {
  const ownerId = getCurrentUserId()
  if (!ownerId) {
    notification.error({
      message: "Error",
      description: "User not authenticated",
    })
    return
  }

  if (!graphId) return

  const nodeRef = doc(
    db,
    `${getNodeCollectionPath(ownerId, graphId)}/${nodeId}`
  )

  const nodeDocSnap = await getDoc(nodeRef)
  const nodeData = nodeDocSnap.data() as GraphNode
  const existingTags = nodeData.tags || []

  if (!existingTags.includes(newTag)) {
    existingTags.push(newTag)
    await updateDoc(nodeRef, {
      tags: existingTags,
    })
  }
}
export const removeTagFromNode = async (
  graphId: string | undefined,
  nodeId: string,
  tagToRemove: string
) => {
  const ownerId = getCurrentUserId()
  if (!ownerId) {
    notification.error({
      message: "Error",
      description: "User not authenticated",
    })
    return
  }

  if (!graphId) return

  const nodeRef = doc(
    db,
    `${getNodeCollectionPath(ownerId, graphId)}/${nodeId}`
  )

  const nodeDocSnap = await getDoc(nodeRef)
  const nodeData = nodeDocSnap.data() as GraphNode
  const existingTags = nodeData.tags || []

  if (existingTags.includes(tagToRemove)) {
    const updatedTags = existingTags.filter((tag) => tag !== tagToRemove)
    await updateDoc(nodeRef, {
      tags: updatedTags,
    })
  }
}
