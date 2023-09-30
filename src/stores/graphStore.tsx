import { useEffect, useState } from "react"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "src/firebase" // Import your Firestore configuration

import {
  GraphNode,
  GraphEdge,
  GraphNodeObj,
  GraphEdgeObj,
} from "src/types/Graph"

export const useGraphStore = () => {
  const [nodes, setNodes] = useState<GraphNodeObj>({})
  const [edges, setEdges] = useState<GraphEdgeObj>({})

  useEffect(() => {
    // Listen for real-time updates for nodes
    const nodesUnsubscribe = onSnapshot(collection(db, "nodes"), (snapshot) => {
      const newNodes: GraphNodeObj = {}
      snapshot.forEach((doc) => {
        const id = doc.id
        newNodes[id] = { ...doc.data(), id: id } as GraphNode
      })
      setNodes(newNodes)
    })
    return () => {
      nodesUnsubscribe()
    }
  }, [])

  useEffect(() => {
    // Listen for real-time updates for edges
    const edgesUnsubscribe = onSnapshot(collection(db, "edges"), (snapshot) => {
      const newEdges: GraphEdgeObj = {}
      snapshot.forEach((doc) => {
        const id = doc.id
        newEdges[doc.id] = { ...doc.data(), id: id } as GraphEdge
      })
      setEdges(newEdges)
    })

    return () => {
      edgesUnsubscribe()
    }
  }, [])

  return {
    nodes,
    edges,
  }
}
