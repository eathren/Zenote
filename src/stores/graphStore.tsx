import { useEffect, useState } from "react"
import {
  doc,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore"
import { db } from "src/firebase" // Import your Firestore configuration

import {
  GraphNode,
  GraphEdge,
  GraphNodeObj,
  GraphEdgeObj,
} from "src/types/Graph"
import { useParams } from "react-router-dom"

export const useGraphStore = () => {
  const [nodes, setNodes] = useState<GraphNodeObj>({})
  const [edges, setEdges] = useState<GraphEdgeObj>({})
  const { id } = useParams()

  useEffect(() => {
    // Listen for real-time updates for nodes
    const nodesUnsubscribe = onSnapshot(collection(db, "nodes"), (snapshot) => {
      const newNodes: GraphNodeObj = {}
      snapshot.forEach((doc) => {
        newNodes[doc.id] = doc.data() as GraphNode
        newNodes[doc.id].id = doc.id
      })
      setNodes(newNodes)
    })

    // Listen for real-time updates for edges
    const edgesUnsubscribe = onSnapshot(collection(db, "edges"), (snapshot) => {
      const newEdges: GraphEdgeObj = {}
      snapshot.forEach((doc) => {
        newEdges[doc.id] = doc.data() as GraphEdge
        newEdges[doc.id].id = doc.id
      })
      setEdges(newEdges)
    })

    return () => {
      nodesUnsubscribe()
      edgesUnsubscribe()
    }
  }, [])

  // Async function to add a new edge
  const addEdge = async (src: string, dest: string) => {
    const newEdge: GraphEdge = { src, dest }
    const docRef = await addDoc(collection(db, "edges"), newEdge)
    return docRef.id
  }

  // Async function to add a new node
  const addNode = async () => {
    const newNode: GraphNode = {
      content: "",
      date_created: Date.now(),
    }
    const docRef = await addDoc(collection(db, "nodes"), newNode)
    return docRef.id
  }

  // Update an existing node
  const updateNode = async (
    nodeId: string,
    updatedFields: Partial<GraphNode>
  ) => {
    try {
      const nodeRef = doc(db, "nodes", nodeId)
      await updateDoc(nodeRef, updatedFields)
    } catch (error) {
      console.error("Failed to update node:", error)
    }
  }

  let updateNodeTimer: number | undefined

  function debouncedUpdateNode(
    nodeId: string | undefined,
    updatedFields: Partial<GraphNode>
  ) {
    clearTimeout(updateNodeTimer)

    if (!nodeId) return
    updateNodeTimer = setTimeout(async () => {
      try {
        console.log("updating")
        const nodeRef = doc(db, "nodes", nodeId)
        await updateDoc(nodeRef, updatedFields)
      } catch (error) {
        console.error("Failed to update node:", error)
      }
    }, 300)
  }

  // Delete an edge
  const deleteEdge = async (edgeId: string) => {
    const edgeRef = doc(db, "edges", edgeId)
    await deleteDoc(edgeRef)
  }

  const deleteNode = async (nodeId: string) => {
    try {
      // Delete all edges that have the deleted node as a source or destination
      const promises: Promise<void>[] = []
      Object.keys(edges).forEach((edgeId) => {
        const edge = edges[edgeId]
        if (edge.src === nodeId || edge.dest === nodeId) {
          promises.push(deleteEdge(edgeId))
        }
      })

      // Await for all edge deletions to complete
      await Promise.all(promises)

      // Then, delete the node itself
      const nodeRef = doc(db, "nodes", nodeId)
      await deleteDoc(nodeRef)
    } catch (err) {
      console.error("An error occurred during the deletion process", err)
    }
  }

  // Update an existing edge
  const updateEdge = async (
    edgeId: string,
    updatedFields: Partial<GraphEdge>
  ) => {
    const edgeRef = doc(db, "edges", edgeId)
    await updateDoc(edgeRef, updatedFields)
  }

  let updateEdgeTimer: number | undefined // Declare a timer variable for edge updates

  // Debounced Update Edge Function
  function debouncedUpdateEdge(
    edgeId: string,
    updatedFields: Partial<GraphEdge>
  ) {
    clearTimeout(updateEdgeTimer) // Clear the previous timer if it exists

    // Set a new timer
    updateEdgeTimer = setTimeout(async () => {
      try {
        const edgeRef = doc(db, "edges", edgeId)
        await updateDoc(edgeRef, updatedFields)
      } catch (error) {
        console.error("Failed to update edge:", error)
      }
    }, 300)
  }

  // Offline-first addEdge
  const addEdgeOfflineFirst = (src: string, dest: string) => {
    const tempEdgeId = `tempEdge-${Date.now()}`
    const newEdge: GraphEdge = { src, dest }
    setEdges({ ...edges, [tempEdgeId]: newEdge })

    addEdge(src, dest).then((newEdgeId) => {
      const updatedEdges = { ...edges }
      updatedEdges[newEdgeId] = updatedEdges[tempEdgeId]
      delete updatedEdges[tempEdgeId]
      setEdges(updatedEdges)
    })
  }

  // Offline-first addNode
  const addNodeOfflineFirst = (nodeId?: string) => {
    const tempNodeId = `tempNode-${Date.now()}`
    const newNode: GraphNode = {
      content: "",
      date_created: Date.now(),
    }
    setNodes({ ...nodes, [tempNodeId]: newNode })

    addNode().then((newNodeId) => {
      const updatedNodes = { ...nodes }
      updatedNodes[newNodeId] = updatedNodes[tempNodeId]
      delete updatedNodes[tempNodeId]
      setNodes(updatedNodes)

      if (nodeId || id) {
        addEdgeOfflineFirst(nodeId || id!, newNodeId)
      }
    })
  }

  return {
    nodes,
    edges,
    addNode: addNodeOfflineFirst,
    updateNode,
    debouncedUpdateNode,
    deleteNode,
    addEdge: addEdgeOfflineFirst,
    updateEdge,
    debouncedUpdateEdge,
    deleteEdge,
  }
}
