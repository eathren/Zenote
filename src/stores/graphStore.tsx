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

  // Add a new edge
  const addEdge = async (src: string, dest: string) => {
    const newEdge: GraphEdge = {
      src,
      dest,
    }
    await addDoc(collection(db, "edges"), newEdge)
  }

  // Add a new node
  const addNode = async (nodeId?: string) => {
    const newNode: GraphNode = {
      content: "",
      date_created: Date.now(),
    }
    await addDoc(collection(db, "nodes"), newNode).then((docRef) => {
      const newNodeId = docRef.id
      // If a pageId exists, or a nodeId exists in the URL, add an edge
      if (nodeId) {
        addEdge(nodeId, newNodeId)
      } else if (id) {
        addEdge(id, newNodeId)
      }
    })
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

  // Delete a node
  const deleteNode = async (nodeId: string) => {
    const nodeRef = doc(db, "nodes", nodeId)
    await deleteDoc(nodeRef)
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

  // Delete an edge
  const deleteEdge = async (edgeId: string) => {
    const edgeRef = doc(db, "edges", edgeId)
    await deleteDoc(edgeRef)
  }

  return {
    nodes,
    edges,
    addNode,
    updateNode,
    debouncedUpdateNode,
    deleteNode,
    addEdge,
    updateEdge,
    debouncedUpdateEdge,
    deleteEdge,
  }
}
