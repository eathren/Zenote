import { collection, query, where, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { GraphEdge } from "src/types"
import { db } from "../firebase"

/**
 * Custom hook to fetch and store graph edges from Firebase Firestore based on graphId.
 *
 * @param {string | undefined} graphId - The ID of the graph to filter edges by.
 * @returns {GraphEdge[]} edges - Array of graph edges.
 * @returns {boolean} loading - Indicates whether the data is still loading.
 * @returns {Error | null} error - Contains the error if something went wrong, otherwise null.
 */
export const useGraphEdges = (graphId?: string) => {
  const [edges, setEdges] = useState<GraphEdge[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!graphId) {
      setLoading(false)
      return
    }

    // Reference to Firestore collection
    const edgesCollection = collection(db, "edges")

    // Build the query
    const q = query(edgesCollection, where("graphId", "==", graphId))

    // Subscribe to changes in the collection filtered by graphId
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedEdges: GraphEdge[] = []

        snapshot.forEach((doc) => {
          const data = doc.data() as GraphEdge
          fetchedEdges.push({ ...data, id: doc.id })
        })

        setEdges(fetchedEdges)
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

  return { edges, loading, error }
}
