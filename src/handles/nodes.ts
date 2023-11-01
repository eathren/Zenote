import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore"
import { GraphNode } from "src/types/index"
import { notification } from "antd"
import {
  getCurrentUserId,
  getNodeCollectionPath,
  handleOperation,
} from "./utils"
import { deleteMarkdown, uploadMarkdown } from "./markdown"
import { updateGraphNodes } from "./graphs"

const db = getFirestore()

export const addNode = async (graphId: string, nodeName: string) => {
  return handleOperation(async () => {
    const nodeCollectionPath = `graphs/${graphId}/nodes`
    const nodesCollection = collection(db, nodeCollectionPath)

    let nodeDocRef = null
    let markdownUrl = ""

    const newNode = {
      name: nodeName,
      graphId,
      date_created: Date.now(),
      tags: [],
      groups: [],
      edges: [],
    }

    nodeDocRef = await addDoc(nodesCollection, newNode)
    markdownUrl = await uploadMarkdown(nodeDocRef.id, "")
    await setDoc(nodeDocRef, { markdownUrl }, { merge: true })
    await updateGraphNodes(graphId, nodeDocRef.id, nodeName, "add")
    return nodeDocRef.id
  })
}

export const fetchNode = async (graphId: string, nodeId: string) => {
  return handleOperation(async () => {
    const nodeRef = doc(db, `graphs/${graphId}/nodes/${nodeId}`)
    const nodeDoc = await getDoc(nodeRef)
    const node = { id: nodeRef.id, ...nodeDoc.data() } as GraphNode
    return node
  })
}

export const updateNodeTitle = async (
  graphId: string,
  nodeId: string,
  newTitle: string
): Promise<GraphNode[] | null> => {
  return handleOperation(async () => {
    // Navigate to the specific graph document
    const graphRef = doc(db, `graphs/${graphId}`)
    const graphDoc = await getDoc(graphRef)

    if (!graphDoc.exists()) {
      throw new Error("Graph does not exist")
    }

    const graphData = graphDoc.data()
    const nodes: GraphNode[] = graphData?.nodes || []

    // Find the node that needs to be updated
    const nodeIndex = nodes.findIndex((node) => node.id === nodeId)

    if (nodeIndex === -1) {
      throw new Error("Node does not exist")
    }

    // Update the node title
    nodes[nodeIndex].name = newTitle

    // Update the nodes array in the graph document
    await updateDoc(graphRef, { nodes })

    // Optionally update other places where this node might be used
    await updateGraphNodes(graphId, nodeId, newTitle, "update")

    return nodes
  })
}
/**
 * Delete a specific node from the database.
 *
 * @param graphId - The Firestore ID of the graph to which the node belongs.
 * @param nodeId - The Firestore ID of the node to be deleted.
 */
export const deleteNodeInDB = async (
  graphId: string | undefined,
  nodeId: string | undefined
) => {
  const ownerId = getCurrentUserId()
  if (!graphId || !nodeId) return
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

export const updateNodeFavoriteStatus = async (
  graphId: string | undefined,
  nodeId: string | undefined
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

  const nodeRef = doc(db, "/graphs/:graphId")

  const nodeDocSnap = await getDoc(nodeRef)
  if (!nodeDocSnap.exists()) {
    notification.error({
      message: "Error",
      description: "Node does not exist",
    })
    return
  }

  const nodeData = nodeDocSnap.data() as GraphNode
  let newStatus: boolean

  // Check if isFavorite is undefined, if so set it to true
  if (nodeData.isFavorite === undefined) {
    newStatus = true
  } else {
    // Toggle the status otherwise
    newStatus = !nodeData.isFavorite
  }

  await updateDoc(nodeRef, {
    isFavorite: newStatus,
  })
}

export const batchUpdateNodeTags = async (
  graphId: string,
  nodeId: string,
  addedTags: string[],
  deletedTags: string[]
): Promise<boolean> => {
  try {
    const ownerId = getCurrentUserId()
    if (!ownerId) {
      notification.error({
        message: "Error",
        description: "User not authenticated",
      })
      return false
    }
    const nodeRef = doc(
      db,
      `${getNodeCollectionPath(ownerId, graphId)}/${nodeId}`
    )

    const nodeSnapshot = await getDoc(nodeRef)

    if (!nodeSnapshot.exists()) {
      console.error("Node does not exist")
      return false
    }

    // If there are tags to be added
    if (addedTags.length > 0) {
      await updateDoc(nodeRef, {
        tags: arrayUnion(...addedTags),
      })
    }

    // If there are tags to be deleted
    if (deletedTags.length > 0) {
      await updateDoc(nodeRef, {
        tags: arrayRemove(...deletedTags),
      })
    }

    return true
  } catch (error) {
    console.error("Error updating tags:", error)
    return false
  }
}
