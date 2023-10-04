import { collection, query, where, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { GraphNode } from "src/types"
import { db } from "../firebase"

/**
 * Custom hook to fetch and store graph nodes from Firebase Firestore based on graphId.
 *
 * @param {string | undefined} graphId - The ID of the graph to filter nodes by.
 * @returns {GraphNode[]} nodes - Array of graph nodes.
 * @returns {boolean} loading - Indicates whether the data is still loading.
 * @returns {Error | null} error - Contains the error if something went wrong, otherwise null.
 */
export const useGraphNodes = (graphId?: string) => {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!graphId) {
      setLoading(false)
      return
    }

    // Reference to Firestore collection
    const nodesCollection = collection(db, "nodes")

    // Build the query
    const q = query(nodesCollection, where("graphId", "==", graphId))

    // Subscribe to changes in the collection filtered by graphId
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedNodes: GraphNode[] = []

        snapshot.forEach((doc) => {
          const data = doc.data() as GraphNode
          fetchedNodes.push({ ...data, id: doc.id })
        })

        setNodes(fetchedNodes)
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )

    // Clean up subscription
    return () => {
      unsubscribe()
    }
  }, [graphId])

  return { nodes, loading, error }
}
