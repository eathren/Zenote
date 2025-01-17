import {
  getFirestore,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
  getDocs,
  where,
  query,
  writeBatch,
} from "firebase/firestore"
import { GraphNode } from "src/types/index"
import { getNodeCollectionPath, handleOperation } from "./utils"
import { deleteMarkdown, uploadMarkdown } from "./markdown"
import { updateGraphNodes, updateGraphNodesBatch } from "./graphs"

const db = getFirestore()

export const addNode = async (graphId: string, nodeNames: string[]) => {
  return await handleOperation(async () => {
    const nodeCollectionPath = `graphs/${graphId}/nodes`
    const nodesCollection = collection(db, nodeCollectionPath)
    const batch = writeBatch(db)
    const nodeIds = []
    const nodesToUpdate = []

    for (const nodeName of nodeNames) {
      const newNode = {
        name: nodeName.trim(),
        graphId,
        date_created: Date.now(),
        tags: [],
        groups: [],
        edges: [],
      }

      const nodeDocRef = doc(nodesCollection)
      batch.set(nodeDocRef, newNode)
      nodeIds.push(nodeDocRef.id)
      nodesToUpdate.push({ nodeId: nodeDocRef.id, nodeName: nodeName.trim() })
    }

    await batch.commit()

    const markdownBatch = writeBatch(db)
    for (const nodeId of nodeIds) {
      const markdownUrl = await uploadMarkdown(nodeId, "")
      const nodeRef = doc(db, nodeCollectionPath, nodeId)
      markdownBatch.set(nodeRef, { markdownUrl, id: nodeId }, { merge: true })
    }

    await markdownBatch.commit()

    // Update the graph document with the new nodes in a batch operation
    await updateGraphNodesBatch(graphId, nodesToUpdate, "add")

    return nodeIds
  })
}
export const fetchNode = async (graphId: string, nodeId: string) => {
  return await handleOperation(async () => {
    const nodeRef = doc(db, `graphs/${graphId}/nodes/${nodeId}`)
    const nodeDoc = await getDoc(nodeRef)
    const node = { ...nodeDoc.data() } as GraphNode
    return node
  })
}

export const addNodeAndReturn = async (
  graphId: string,
  nodeNames: string[]
) => {
  return await handleOperation(async () => {
    const nodeCollectionPath = `graphs/${graphId}/nodes`
    const nodesCollection = collection(db, nodeCollectionPath)
    const batch = writeBatch(db)
    const nodes: GraphNode[] = []

    for (const nodeName of nodeNames) {
      const newNode = {
        name: nodeName.trim(),
        graphId,
        date_created: Date.now(),
        tags: [],
        groups: [],
        edges: [],
      }

      const nodeDocRef = doc(nodesCollection)
      batch.set(nodeDocRef, newNode)
      nodes.push({ ...newNode, id: nodeDocRef.id })
    }

    await batch.commit()

    const markdownBatch = writeBatch(db)
    for (const node of nodes) {
      const markdownUrl = await uploadMarkdown(node.id, "")
      const nodeRef = doc(db, nodeCollectionPath, node.id)
      markdownBatch.set(nodeRef, { markdownUrl, id: node.id }, { merge: true })
    }

    await markdownBatch.commit()

    // Now update the graph document with the new nodes in a batch operation
    const nodesUpdate = nodes.map((node) => ({
      nodeId: node.id,
      nodeName: node.name,
    }))
    await updateGraphNodesBatch(graphId, nodesUpdate, "add")

    return nodes
  })
}
export const updateNodeTitle = async (
  graphId: string,
  nodeId: string,
  newTitle: string
): Promise<GraphNode[] | null> => {
  return await handleOperation(async () => {
    // Use the utility function to get the node collection path
    const nodeCollectionPath = getNodeCollectionPath(graphId)

    // Navigate to the specific node document
    const nodeRef = doc(db, `${nodeCollectionPath}/${nodeId}`)

    await updateDoc(nodeRef, {
      name: newTitle,
    })
    await updateGraphNodes(graphId, nodeId, newTitle, "update")

    // Fetch the updated list of nodes
    const nodesCollection = collection(db, nodeCollectionPath)
    const nodesSnapshot = await getDocs(nodesCollection)
    const nodes: GraphNode[] = []
    nodesSnapshot.forEach((doc) => {
      nodes.push(doc.data() as GraphNode)
    })

    return nodes
  })
}

export const deleteNode = async (nodeId: string) => {
  return await handleOperation(async () => {
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
  })
}

export const deleteNodeInDB = async (graphId: string, nodeId: string) => {
  return await handleOperation(async () => {
    const nodeCollectionPath = getNodeCollectionPath(graphId)
    const nodeRef = doc(db, `${nodeCollectionPath}/${nodeId}`)
    const nodeDoc = await getDoc(nodeRef)
    if (!nodeDoc.exists()) {
      throw new Error(`Node document does not exist: ${nodeId}`)
    }
    await updateGraphNodes(graphId, nodeId, "", "delete")
    await deleteMarkdown(nodeId)
    await deleteDoc(nodeRef)
  })
}

export const updateNodeGroups = async (
  graphId: string,
  nodeId: string,
  groups: string[]
) => {
  return await handleOperation(async () => {
    const nodeRef = doc(db, `${getNodeCollectionPath(graphId)}/${nodeId}`)
    await updateDoc(nodeRef, {
      groups,
    })
  })
}

export const addTagToNode = async (
  graphId: string,
  nodeId: string,
  newTag: string
) => {
  return await handleOperation(async () => {
    const nodeRef = doc(db, `${getNodeCollectionPath(graphId)}/${nodeId}`)

    const nodeDocSnap = await getDoc(nodeRef)
    const nodeData = nodeDocSnap.data() as GraphNode
    const existingTags = nodeData.tags || []

    if (!existingTags.includes(newTag)) {
      existingTags.push(newTag)
      await updateDoc(nodeRef, {
        tags: existingTags,
      })
    }
  })
}

export const removeTagFromNode = async (
  graphId: string | undefined,
  nodeId: string,
  tagToRemove: string
) => {
  return await handleOperation(async () => {
    if (!graphId) return

    const nodeRef = doc(db, `${getNodeCollectionPath(graphId)}/${nodeId}`)

    const nodeDocSnap = await getDoc(nodeRef)
    const nodeData = nodeDocSnap.data() as GraphNode
    const existingTags = nodeData.tags || []

    if (existingTags.includes(tagToRemove)) {
      const updatedTags = existingTags.filter((tag) => tag !== tagToRemove)
      await updateDoc(nodeRef, {
        tags: updatedTags,
      })
    }
  })
}

export const updateNodeFavoriteStatus = async (
  graphId: string | undefined,
  nodeId: string
) => {
  return await handleOperation(async () => {
    if (!graphId) return
    const nodeRef = doc(db, `${getNodeCollectionPath(graphId)}/${nodeId}`)

    const nodeDocSnap = await getDoc(nodeRef)

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
  })
}

export const batchUpdateNodeTags = async (
  graphId: string,
  nodeId: string,
  addedTags: string[],
  deletedTags: string[]
) => {
  return await handleOperation(async () => {
    const nodeRef = doc(db, `${getNodeCollectionPath(graphId)}/${nodeId}`)

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
  })
}
